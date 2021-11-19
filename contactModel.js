
var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken")
var contactSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    gender: String,
    phone: String,
    create_date: {
        type: Date,
        default: Date.now
    },
    password:{
        type:String,
        required:true
    },
    tokens: 
    [{token:{type: String}
}],
});

contactSchema.set('validateBeforeSave', false);
contactSchema.path('email').validate(()=>{
    return false
},'Email Already exists')

contactSchema.methods.ganerateAuthToken = async function(){
     try{
         console.log(this._id)
            const token=jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
             this.tokens =this.tokens.concat({token:token})
             await this.save();
             return token;
     }   
     catch(error){
         console.log();(`the error part      ${error}`)
     } 
 }


contactSchema.pre("save",async function(next){
    if(this.isModified("password")){
        this.password=await bcrypt.hash(this.password, 10);
       
    }
    next();
})
// Export Contact model
var Contact = module.exports = mongoose.model('contact', contactSchema);
module.exports.get = function (callback, limit) {
    Contact.find(callback).limit(limit);
}