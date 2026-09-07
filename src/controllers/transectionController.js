const transectionModel=require('../models/transection');
const accountModel=require('../models/account');
const ledgerModel = require('../models/ledger');
const userModel=require('../models/User');
const mongoose = require('mongoose');

async function createtransection(req,res){
    /**
     * -1.Validate Request
     */
    const{fromaccount,toaccount,amount,idempotencyKey}=req.body;

    if(!fromaccount||!toaccount||!amount||!idempotencyKey){
        return res.status(400).json({
            message:"fromaccount,toaccount,amount,idempotency all required to create the transeection",
        })
    }
    const fromuseraccount=await accountModel.findOne({_id:fromaccount, user:req.user._id});
    const touseraccount=await accountModel.findOne({_id:toaccount});


    if(!fromuseraccount){
        return res.status(400).json({ message:"Sender account was not found or does not belong to you." })
    }
    if(!touseraccount){
        return res.status(400).json({ message:"Recipient account ID was not found." })
    }


    /**
     * -2.Valid Idempotency Key
     */

    const isidempotencyKeypresent=await transectionModel.findOne({idempotencyKey:idempotencyKey});

    if(isidempotencyKeypresent){
        if(isidempotencyKeypresent.status==="COMPLETED"){
            return res.status(200).json({
                message:"Transection Completed"
            })
        }

        if(isidempotencyKeypresent.status==="PENDING"){
            return res.status(200).json({
                message:"Transection is still in process"
            })
        }
        if(isidempotencyKeypresent.status==="REVERSED"){
            return res.status(500).json({
                message:"Transection Reversed"
            })
        }
        if(isidempotencyKeypresent.status==="FAILED"){
            return res.status(500).json({
                message:"Transection FAILED"
            })
        }
    }

    /**
     * -3.check account status whether it is active or not
     */
     console.log(fromuseraccount.status,touseraccount.status)

    if(fromuseraccount.status!=="ACTIVE" || touseraccount.status!=="ACTIVE"){
        return res.status(401).json({
            message:"Account status is not active"
        })
    }

    /**
     * -4.Derived sender balance from ledger
     */
     
     const totalamount=await fromuseraccount.getBalance();

     if(amount>totalamount){
        return res.status(400).json({
            message:`You dont have that mush payment to make a transection your actual balance is ${totalamount}`
        })
     }
     

     try{


    /**
     * -5.transection creation with mongodb.session
     */
     

    const session=await mongoose.startSession();

    session.startTransaction()

    const transection=(await transectionModel.create([{
        fromaccount,
        toaccount,
        amount,
        idempotencyKey,
        status:"PENDING"
    }],{session}))[0]

    const debitLedger = await ledgerModel.create([
        {
            account: fromaccount,
            amount: amount,
            type: "DEBIT",
            transection: transection._id
        }
    ], { session });

    const creditLedger = await ledgerModel.create([
        {
            account: toaccount,
            amount: amount,
            type: "CREDIT",
            transection: transection._id
        }
    ], { session });

    await transectionModel.findOneAndUpdate({ _id: transection._id }, { status: "COMPLETED" }, { session });

    try {
        await session.commitTransaction();
    } catch (commitErr) {
        await session.abortTransaction();
        session.endSession();
        return res.status(500).json({ message: "Transection commit failed, please retry", error: commitErr.message });
    }

    session.endSession();
} catch (err) {
    try {
        await session.abortTransaction();
    } catch (e) {}
    if (session && session.endSession) session.endSession();
    return res.status(500).json({ message: "Transection failed, please retry later", error: err.message });
}

    res.status(200).json({
        message:"Transection created",
        transection
    })
}

async function initalfundbyMainuser(req,res){
  const{toaccount,amount,idempotencyKey}=req.body;

  if(!toaccount||!amount||!idempotencyKey){
    return res.status(400).json({
        message:"All field are required"
    })
  }

  const touseraccount=await accountModel.findOne({_id:toaccount});
  if(!touseraccount){
    return res.status(400).json({
        message:"To user account is not there"
    })
  }

  const fromaccount=await userModel.findOne({_id:req.user._id,mainuser:true})

  if(!fromaccount){
    return res.status(400).json({
        message:"You are unautorized person"
    })
  }

  const isidempotencyalredyexists=await transectionModel.findOne({idempotencyKey:idempotencyKey});

  if(isidempotencyalredyexists){
    if(isidempotencyalredyexists.status==="COMPLETED"){
        return res.status(200).json({
            message:"TRanection Completed.."
        })
    }
    if(isidempotencyalredyexists.status==="PENDING"){
        return res.status(200).json({
            message:"Transection Pending"
        })
    }
    if(isidempotencyalredyexists.status==="REVERSED"){
        return res.status(500).json({
            message:"Transection Reversed"
        })
    }
    if(isidempotencyalredyexists.status==="FAILED"){
        return res.status(500).json({
            message:"Transection Failed"
        })
    }
  }

  if(touseraccount.status!="ACTIVE"){
    return res.status(400).json({
        message:"Your account is Inactive"
    })
  }
   

  const session=await mongoose.startSession();

  session.startTransaction();


  const transection=await transectionModel({fromaccount,toaccount,amount,idempotencyKey,status:"PENDING"});


  const debitLedger=await ledgerModel.create([{account:fromaccount,amount:amount,transection:transection._id,type:"DEBIT"}],{session});

  const creditLedger=await ledgerModel.create([{account:toaccount,amount:amount,transection:transection._id,type:"CREDIT"}],{session})
   
  transection.status="COMPLETED"
  await transection.save({session});


  await session.commitTransaction();
  await session.endSession();


  res.status(200).json({
    message:"Transection Credited",
    transection
  })



}

module.exports={createtransection,initalfundbyMainuser}
