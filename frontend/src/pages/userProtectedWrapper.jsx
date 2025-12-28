import React, { useContext, useEffect, useState }from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserDataContext } from '../context/userContext';

const UserProtectedWrapper = ({
    children
}) => {
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const { setUser } = useContext(UserDataContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            navigate('/');
            return;
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/users/profile`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then((response) => {0
            if (response.status === 200) {
                setUser(response.data);
                setLoading(false);
            } else {
                localStorage.removeItem('token');
                navigate('/');
            }
        })
        .catch((error) => {
            console.log(error);
            localStorage.removeItem('token');
            navigate('/');
        });
    }, [token, navigate, setUser]);
    if (loading) return null;

    return (
        <div>
            { children }
        </div>
    )
};

export default UserProtectedWrapper;