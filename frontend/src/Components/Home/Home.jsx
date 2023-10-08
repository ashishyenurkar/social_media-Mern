import React, { Fragment, useEffect } from 'react';
import User from '../User/User';
import Post from '../Post/Post';
import "./Home.css";
import { useDispatch, useSelector } from "react-redux";
import { getAllUsers, getFollowingPosts } from '../../Actions/user';
import Loader from '../Loader/Loader';
import { Typography } from '@mui/material';
import { useAlert } from 'react-alert';

function Home() {

    const dispatch = useDispatch();
    const alert = useAlert();


    const { loading, posts, error } = useSelector((state) => state.postOfFollowing);
    const { loading:usersLoading, users, error:usersError} = useSelector((state) => state.allUsers);
    const { error: likeError, message } = useSelector((state) => state.like);
    

    useEffect(() => {
        dispatch(getFollowingPosts());
        dispatch(getAllUsers());
        if (error) {
            alert.error(error);
            dispatch({ type: "clearErrors" });
        };
        if (likeError) {
            alert.error(likeError);
            dispatch({ type: "clearErrors" });
        };
        if (usersError) {
            alert.error(usersError);
            dispatch({ type: "clearErrors" });
        };

        if (message) {
            alert.success(message);
            dispatch({ type: "clearMessage" })
        }
    }, [dispatch, alert, message, error, likeError, usersError]);

    
   


    return (
    <Fragment>
      {loading || usersLoading ? <Loader/>:(<div className='home'>
      <div className='homeleft'>
                    {
                        posts && posts.length > 0 ? (posts.map((post) => (
                            <Post
                                key={post._id}
             
                                isDelete={false}
                                postId={post._id}
    caption={post.caption}
    postImage={post.image.url}
    likes ={post.likes}
    comments = {post.comments}
    ownerImage={post.owner.avatar.url}
    ownerName={post.owner.name}
    ownerId={post.owner._id}
          />
                        )
                        )
                        )
                            : <Typography component={"h6"}>No Posts Yet</Typography>
                    }
                    
          
      </div>
      <div className='homeright'>
                    {
                        users && users.length > 0 ? users.map((user)=>(
                            <User
                                key={user._id}
                            userId={user._id}
                            name={user.name}
                            avatar={user.avatar.url}
                                                />
                        )):<Typography>No Users Yet</Typography>
         }
      </div>
</div>)}
</Fragment>   
  )
}

export default Home