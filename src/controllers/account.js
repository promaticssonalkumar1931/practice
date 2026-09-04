const accountModel=require('../models/account');


async function createAccount(req,res){
    const account=await accountModel.create({
        user:req.user._id
        
    })

    res.status(200).json({
        message:"Account created sucessfully...",
        account
    })
}

async function getAccount(req,res){
    const user=req.user._id;

    console.log(req.ip);

    const getaccount=await accountModel.find({user:user});

    res.status(200).json({
        message:"get all account of this user",
        getaccount
    })
}

async function getbalance(req,res){

    let account=req.params.id;

    let accountpresent=await accountModel.findById(account);

    if(!accountpresent){
        return res.status(400).json({
            message:"Account is not persent"
        })
    }

   const amount= await accountpresent.getBalance();

   return res.status(200).json({
    message:"Amount fetched Sucessfully..",
    amount
   })

    


}


module.exports={createAccount,getAccount,getbalance};