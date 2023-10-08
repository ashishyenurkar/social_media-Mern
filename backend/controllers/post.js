const Post = require("../models/Post");
const User = require("../models/User");


exports.createPost = async (req, res) => {
    try {
        const newPostData = {
            caption: req.body.caption,
            image: {
                public_id: "req.body.public_id",
                url: "req.body.url"
            },
            owner: req.user._id,
        };

        const post = await Post.create(newPostData);

        const user = await User.findById(req.user._id);
        user.posts.push(post._id);

        await user.save();

        res.status(201).json({
            success: true,
            post,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
        
    }
};

exports.deletePost = async (req, res) => {
    try {
        //find a post to delete.
        const post = await Post.findById(req.params.id);

        //if post not found.
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            })
        }
        //only owner of post can delete this post
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                successs: false,
                message: "unAuthorized",
            })
        }
        //Deleting a post mongodb method
        await post.deleteOne();

        //find user to delete post from user profile
        const user = await User.findById(req.user._id);
        const index = user.posts.indexOf(req.params.id);
        //delet post from user document
        user.posts.splice(index, 1);

        //save new updated user post
        await user.save();

        res.status(200).json({
            sucess: true,
            message: 'Post Deleted',
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    };
};


//Like and ulike post 
exports.likeAndUnlikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            })
        }
        if (post.likes.includes(req.user._id)) {
           
    //remove like from the array
            const index = post.likes.indexOf(req.user._id);
            post.likes.splice(index, 1);
            await post.save();

            return res.status(200).json({
                success: true,
                message:"Post Unliked",
            })
        }
        else {
            //add like to the array
            post.likes.push(req.user._id);
            await post.save();
            return res.status(200).json({
                success: true,
                message:"Post Liked",
            })
}
} catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.getPostOfFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        const posts = await Post.find({
            owner: {
                $in: user.following,
            },
        }).populate("owner likes comments.user");

        res.status(200).json({
            success: true,
            posts:posts.reverse(),
            
        })
    
} catch (error) {
    res.status(500).json({
        success: false,
        message : error.message,
    })
}
}

//Update caption 
exports.updateCaption = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post Not Found",
            })
        };
        if (post.owner.toString() !== req.user._id.toString()) {
            return res.status(401).json({
                successs: false,
                message: "Unauthorized",
            })
        };
        post.caption = req.body.caption;
        //save to database
        await post.save();
        res.status(200).json({
            sucess: true,
            message: "Post Updated",
        })
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Add Comment.

exports.addComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({
                success: false,
                message: "Post not found",
            })
        };

        //checking comment is exist or not.
        let commentIndex = -1;
        post.comments.forEach((item, index) => {
            if (item.user.toString() === req.user._id.toString()) {
                commentIndex = index;
            }
        })

        if (commentIndex !== -1) {
            post.comments[commentIndex].comment = req.body.comment;
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Comment Updated",
            })
        }
        else {
            post.comments.push({
                user: req.user._id,
                comment: req.body.comment,
            });
            
            await post.save();
            return res.status(200).json({
                success: true,
                message: "Comment Added",
            })

        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

//Delete Comment.
exports.deleteComment = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({
                success: false,
                message:"Post not found",
            })
        }
//Checking if post owner wants to delete comment
        if (post.owner.toString() === req.user._id.toString()) {

            if (req.body.commentId == undefined) {
                return res.status(400).json({
                    success: false,
                    message:"Comment id is required."
                })
            }

            post.comments.forEach((item, index) => {
                if (item._id.toString() === req.body.commentId.toString()) {
                    return post.comments.splice(index, 1);
                }
            });
            await post.save();
            return res.status(200).json({
                success: true,
                message:"Selected comment has deleted"
            })
            
        } else {
           
            post.comments.forEach((item, index) => {
                if (item.user.toString() === req.user._id.toString()) {
                    return post.comments.splice(index, 1);
                }
            });
            await post.save();

            return res.status(200).json({
                success: true,
                message:"Your comment has deleted"
            })
            
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};

