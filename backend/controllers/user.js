const { json } = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const { sendEmail } = require("../middlewares/sendEmail");
const crypto = require("crypto");

//Register User.
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User Already exists" });
        }
        user = await User.create({ name, email, password, avatar: { public_id: "sample_id", url: "sampleurl" } });

        //generating jsonwebToken for login User.
        const token = await user.generateToken();
        const options = {
           
            expires : new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
           
        }

        res.status(201).cookie("token", token,options)
            .json({
            success: true,
            user,
                token,
            message:"Congratulations User Login succesfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
        
    }
};


//Logine User.

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'User does not exist',
            });
        };

        //Check Password match or Not.
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid Password',
            })
        };

        //generating jsonwebToken for login User.
        const token = await user.generateToken();
        const options = {
           
            expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            httpOnly: true,
           
        }

        res.status(200).cookie("token", token, options)
            .json({
                success: true,
                user,
                token,
            });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


//Logout User.
exports.logout = async (req, res) => {
    try {
        res.status(200).cookie("token", null, { expires: new Date(Date.now()), httpOnly: true }).json({
            success: true,
            message: "Logged out",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        }); 
    }
 }


//follow User route
exports.followUser = async (req, res) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const loggedInUser = await User.findById(req.user._id);
        //if userToFollow not exist
        if (!userToFollow) {
            return res.status(404).json({
                success: false,
                message: "User Not Found",
            });
        };
        //if following already exists
        if (loggedInUser.following.includes(userToFollow._id)) {
            //remove from array
            const indexfollowing = loggedInUser.following.indexOf(userToFollow._id);
            loggedInUser.following.splice(indexfollowing, 1);

            const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);
            userToFollow.followers.splice(indexfollowers, 1);

            await loggedInUser.save();
            await userToFollow.save();

            return res.status(200).json({
                success: true,
                message: "User unFollowed",
            })
        } else {
            //push following and followers
            loggedInUser.following.push(userToFollow._id);
            userToFollow.followers.push(loggedInUser._id);
        
            await loggedInUser.save();
            await userToFollow.save();

            res.status(200).json({
                success: true,
                message: "User Followed",
            })
            
        }

} catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//Update Password.

exports.updatePassword = async (req, res) => {
    try {

        //find user 
        const user = await User.findById(req.user._id).select("+password");
        const { oldpassword, newPassword } = req.body;

        if (!oldpassword || !newPassword) {
          return res.status(400).json({
                success: false,
                message: "please Provide oldPassword & newPassword",
            })
}

        const isMatch = await user.matchPassword(oldpassword);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Incorrect old password"
            })
        }
        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Password Updated",
        })

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//Update Password.
exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const { name, email } = req.body;

        if (name) {
            user.name = name;
        }
        
        if (email) {
            user.email = email;
        
        }
        await user.save();

        //User Avatar:TODO,
        res.status(200).json({
            success: true,
            message: "Profile Updated",
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
    
};


//Delete my profile.

exports.deleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        const userpost = user.posts;
        const userFollowers = user.followers;
        const userId = user._id;
        const userFollowing = user.following;
        await user.deleteOne();

        //Deleting User
        res.cookie("token", null, {
            expires: new Date(Date.now()),
            httpOnly: true,
        });

        //Deleting Post;
        for (let i = 0; i < userpost.length; i++) { 
            const post = await Post.findById(userpost[i]);
            await post.deleteOne();
        }

        //Deleting user from followers following.
       
        for (let i = 0; i < userFollowers.length; i++) { 
            const follower = await User.findById(userFollowers[i]);
            const index = follower.following.indexOf(userId);
            follower.following.splice(index, 1);

            await follower.save();
        }

        //Deleting user from  following,s followers.
       
        for (let i = 0; i < userFollowing.length; i++) { 
            const follows = await User.findById(userFollowing[i]);
            const index = follows.followers.indexOf(userId);
            follows.followers.splice(index, 1);

            await follows.save();
        }

        res.status(200).json({
            success: true,
            message:"Your Profile Deleted Successfully"
        })



        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//My pROFILE
exports.myProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate("posts");
        res.status(200).json({
            success: true, 
            user,
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message:error.message,
        })
    }
};

//get User Profile.
exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("posts");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            })
        }

        res.status(200).json({
            success: true,
            user,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//Get All Users.
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});

        res.status(200).json({
            success: true,
            users,
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//Forgot Password.
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not Found",
            })
        };
        //Reset Password token.
        const resetPasswordToken = user.getResetPasswordToken()
        await user.save();
        //                       https               hostName ex localhost path               Resettoken
        const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetPasswordToken}`;

        const message = `Reset Your Password By clicking on the link below : \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Reset your password',
                message,
            });

            res.status(200).json({
                success: true,
                message: `email sent to ${user.email}`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save();

            res.status(500).json({
                success: false,
                message: error.message,
            })
        }

        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//reset password.
exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() },
        });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Token on has expired",
            })
        };

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();
        
        res.status(200).json({
            success: true,
            massage:"password Updated Succesfully."
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

//Login Users Post

exports.getMyPosts = async(req,res)=>{
    try {
        const user = await User.findById(req.user._id);
        const posts = [];
         
        for(let i=0; i<user.posts.length; i++){
            const post = await Post.findById(user.posts[i]).populate("likes comments.user");
            posts.push(post);
        }
      res.status(200).json({
        success:true,
        posts,
      })  ;
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}
