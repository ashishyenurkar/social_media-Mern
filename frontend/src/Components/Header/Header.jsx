import React, { useState } from 'react'
import "./Header.css";
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AddIcon from '@mui/icons-material/Add';
import AddOutlinedIcon from '@mui/icons-material/AddOutlined';
import SearchIcon from '@mui/icons-material/Search';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function Header() {

    const [tab, setTab] = useState(window.location.pathname);


  return (
      <div className='header'>
          <Link to="/" onClick={()=>setTab("/")}>
              {
                  tab === "/" ? <HomeIcon style={{color:"black"}}/> : <HomeOutlinedIcon/>
          }
              
          </Link>
          <Link to="/newpost" onClick={()=>setTab("/newpost")}>
          {
                  tab === "/newpost" ? <AddIcon  style={{color:"black"}}/> : <AddOutlinedIcon/>
          }
          </Link>
          <Link to="/search" onClick={()=>setTab("/search")}>
          {
                  tab === "/search" ? <SearchIcon style={{color:"black"}}/> : <SearchOutlinedIcon/>
          }
          </Link>
          <Link to="/account" onClick={()=>setTab("/account")}>
          {
                  tab === "/account" ? <AccountCircleIcon style={{color:"black"}}/> : <AccountCircleOutlinedIcon/>
          }
          </Link>
    </div>
  )
}

export default Header