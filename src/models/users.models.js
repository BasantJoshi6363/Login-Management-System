import mongoose,{Schema} from "mongoose";

const userSchema = new Schema({
    username : {
        type : String,
        unique : true,
        lowercase : true,
        trim : true,
        // unique : true,
        required : true

    },
    email :{
        type : String,
        // unique : true,
        lowercase : true,
        trim : true,
        unique : true,
        required : true
    },
  
    password:{
        type : String,
        min : [6,"password at least 6"],
        max : [20, "maximum 20 characters allowed"],
        required: true
    },
    isVerifiedEmail:  {
        type : Boolean
    }

},{timestamps : true})


export let User = mongoose.model("User",userSchema)