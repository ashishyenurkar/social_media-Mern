const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "Please enter a name"],
    },
    avatar: {
        public_id: String,
        url: String,
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: [true, "Email already Exists"],
    },
    password: {
        type: String,
        required: [true, "Please Enter a password"],
        minlength: [6, "Password must have 6 characters"],
        select: false,
    },
    createdAt: {
        type: Date,
    default: Date.now,
        
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
    resetPasswordToken: String,
resetPasswordExpire: Date,
    
});
//saving modified password.
userSchema.pre("save", async function (next) {
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
   
});

//Match password during login process.
userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};
//generate token for cookie
userSchema.methods.generateToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET);
};
//generation of reset password Token.
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);