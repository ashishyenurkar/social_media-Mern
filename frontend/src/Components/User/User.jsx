import React from 'react';
import { Link } from "react-router-dom";
import{Avatar, Typography} from "@mui/material"

function User({userId,name,avatar}) {
  return (
   
      <Link to={`/user/${userId}`} className='homeUser'>
          <div className='gola'><Avatar src={avatar} alt={name} /></div>
          <Typography>{name}</Typography>
          </Link>
    
  )
}

export default User