const mongoose=require("mongoose");

const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:true,
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:true,
        immutable:true
    },
    transection:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transection",
        required:true,
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["DEBIT","CREDIT"],
            message:"Leadger type should be DEBIT OR CREDIT"
        },
        required:true,
        index:true,
        immutable:true
    }

},{
    timestamps:true
})

function preventLedgerModification(){
    throw new Error("You can not Change, delete or modified the ledger")
}

ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('updateOne',preventLedgerModification);
ledgerSchema.pre('deleteOne',preventLedgerModification);
ledgerSchema.pre('remove',preventLedgerModification);
ledgerSchema.pre('deleteMany',preventLedgerModification);
ledgerSchema.pre('updateMany',preventLedgerModification);
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification);
ledgerSchema.pre('findOneAndDelete',preventLedgerModification);
ledgerSchema.pre('findOneAndReplace',preventLedgerModification);


const ledgerModel=mongoose.model('ledger',ledgerSchema);

module.exports=ledgerModel;