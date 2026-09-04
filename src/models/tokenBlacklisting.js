const mongoose=require("mongoose");

const tokenBlackListSchema=new mongoose.Schema({
    token:{
        type:String,
        required:true,
        unique:true
    }
},{
    timestamps:true
})

tokenBlackListSchema.index({createdAt:1},{
    expireAfterSeconds:60*60*24*3
})//ttl timetilive

const tokenBlackListModel=mongoose.model("tokenblacklist",tokenBlackListSchema);


module.exports=tokenBlackListModel;