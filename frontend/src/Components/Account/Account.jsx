import React, { useEffect } from 'react';
import "./Account.css"
import { useDispatch, useSelector } from 'react-redux';
import { getMyPosts } from '../../Actions/user';

const Account = () => {

    const dispatch = useDispatch();
    const{loading, error, posts}=useSelector((state)=>state.myPosts);


    useEffect(()=>{
        dispatch(getMyPosts());
    },[dispatch]);

    return (
        <div className='account'>
            <div className='accountLeft'></div>
<div className='accountright'></div>       
        </div>
    );
};

export default Account;
