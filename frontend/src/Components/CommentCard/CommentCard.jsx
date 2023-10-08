import React from 'react'
import "./CommentCard.css"
import { Link } from 'react-router-dom'
import { Avatar, Button, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCommentOnPost } from '../../Actions/post';
import { getFollowingPosts } from '../../Actions/user';

function CommentCard({
    userId,
    name,
    avatar,
    comment,
    commentId,
    postId,
    isAccount
}) {

   const dispatch = useDispatch()
    const { user } = useSelector(state => state.user);

        const deleteCommentHandle = () => {
            dispatch(deleteCommentOnPost(postId,commentId))
         
            if (isAccount) {
                console.log("Bring my posts")
            } else {
                dispatch(getFollowingPosts());
            }
        }

    
   
  return (
      <div className='commentUser'>
          <Link to={`/user/${userId}`}>
              <img src={avatar} alt={name} />
              <Typography style={{ minWidth: "6vmax" }}>{name}</Typography>
              
          </Link>
          <Typography>{comment}</Typography>
          
          {/* delete button */}
         

          {isAccount || (userId === user._id) ? (
  <Button onClick={deleteCommentHandle}>
    <DeleteIcon />
  </Button>
) : null}
           
    </div>
  )
}

export default CommentCard