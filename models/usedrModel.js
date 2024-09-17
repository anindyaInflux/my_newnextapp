
import mongoose from"mongoose"



const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"Please Provied a UserName"],
  
    },
    email:{
        type:String,
        required:[true,"Please Provide a Valid Email"],

       
    },
    password:{
        type:String,
     
        minlength:[8,"Password should be at least 8 characters long"]
    },
    isVerfied:{
        type:Boolean,
        default:false,
    },
    isAdmin:{
        type:Boolean,
        default:false   
    },
    forgotPasswordToken: String,
    forgotPasswordTokenExpiry: Date,
    verifyToken: String,
    verifyTokenExpiry: Date,
},{ timestamps: true })


const User = mongoose.model.users||mongoose.model("newstudent",userSchema)

export default User