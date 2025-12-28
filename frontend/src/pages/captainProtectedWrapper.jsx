import React, { useContext, useEffect }from 'react';
import { CaptainDataContext } from '../context/captainContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import axios from 'axios';

const CaptainProtectedWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const { captain, setCaptain } = useContext(CaptainDataContext);
    const [ isloading, setIsloading ] = useState(true);

    useEffect(() => {
        if(!token){
            navigate('/captain-login');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`,{
            headers: {
                Authorization: `Bearer ${token}`
            }
        } ).then((response) => {
            if(response.status === 200){
                const data = response.data;
                setCaptain(data.captain);
                setIsloading(false);
            }
        })
        .catch(err => {
            console.log(err);
            localStorage.removeItem('token');
            navigate('/captain-login');
        })
    }, [token, navigate, setCaptain]);

    if(isloading){
        return <div>Loading...</div>
    }

    return (
        <div>
            { children }
        </div>
    )
};

export default CaptainProtectedWrapper;