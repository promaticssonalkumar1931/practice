const mongoose=require('mongoose');


const transectionSchema=new mongoose.Schema({
    fromaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"from account is required for creating the transection"],
        index:true
    },
    toaccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"to account is required for creating the transection"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","REVERSED","COMPLETED"],
        },
        default:"PENDING",
        index:true
    },
    amount:{
        type:Number,
        min:[0,"amount will not go in negative"],
        required:true,
    },
    idempotencyKey:{
        type:String,
        unique:true,
        required:[true,"Idempotency key is required for the transection"]
    }
},{
    timestamps:true
})


const transectionModel=mongoose.model("transection",transectionSchema);

module.exports=transectionModel;
