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

    const getaccount=await accountModel.find({user:user, status: { $ne: 'CLOSED' }});

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


async function deleteAccount(req, res) {
    const account = await accountModel.findOne({ _id: req.params.id, user: req.user._id });
    if (!account) return res.status(404).json({ message: 'Account not found' });

    const balance = await account.getBalance();
    if (balance !== 0) {
        return res.status(400).json({ message: 'Transfer or withdraw the remaining balance before deleting this account.' });
    }

    // Retain immutable ledger history; closed accounts cannot be used for transfers.
    account.status = 'CLOSED';
    await account.save();
    return res.status(200).json({ message: 'Account closed successfully' });
}

module.exports={createAccount,getAccount,getbalance,deleteAccount};
