import React, { useState, useContext } from 'react';
import safarX from '../assets/safarX.png'
import { Link } from 'react-router-dom';
import { UserDataContext } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Userlogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { setUser } = useContext(UserDataContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userData = {
            email: email,
            password: password
        }

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`, userData);

        if(response.status === 200){
            const data = response.data;
            setUser(data.user);
            localStorage.setItem('token', data.token);
            navigate('/home');
        }
        setEmail('');
        setPassword('');
    }

    return (
        <div className='p-7 flex flex-col justify-between h-screen'>
            <div>
                <img className='w-16 mb-10' src={safarX} alt="" />

            <form onSubmit={(e) => handleSubmit(e)}>
                <h3 className='text-xl font-medium mb-2'>What's your email</h3>

                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com" 
                className ='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                required 
                />

                <h3 className='text-xl font-medium mb-2'>Enter Password</h3>

                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password" 
                className ='bg-[#eeeeee] mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                required 
                />

                <button
                className ='bg-[#111] text-white font-semibold mb-7 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                >Login</button>

                <p className='text-center'>New here?<Link to="/user-signup" className='text-blue-600'>Create new Account</Link></p>
            </form>
            </div>
            <div>
            <Link
                to='/captain-login'
                className ='bg-[#10b461] flex justify-center items-center text-white font-semibold mb-5 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                >Sign in as Captain</Link>
            </div>
        </div>
    );
}

export default Userlogin;