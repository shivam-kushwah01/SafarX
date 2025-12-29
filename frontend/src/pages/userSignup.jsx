import React, { useState } from 'react';
import safarX from '../assets/safarX.png'
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useContext } from 'react';
import { UserDataContext } from '../context/userContext.jsx';

const UserSignup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [userData, setUserData] = useState({});

    const navigate = useNavigate();

    const { setUser } = useContext(UserDataContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            email,
            password
        };

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, newUser);

        if(response.status === 201){
            const data = response.data;
            setUser(data.user);
            localStorage.setItem('token', data.token);
            navigate('/home');
        }
        setUserData(newUser);

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className='p-7 flex flex-col justify-between h-screen'>
            <div>
                <img className='w-20 -ml-1 mb-2' src={safarX} alt="" />

            <form onSubmit={(e) => handleSubmit(e)}>
                <h3 className='text-lg font-medium mb-2'>What's your name</h3>

                <div className='flex gap-4 mb-6'>
                <input 
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name" 
                className ='bg-[#eeeeee] rounded px-4 py-2 w-1/2 border text-lg placeholder:text-base '
                required 
                />
                <input 
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name" 
                className ='bg-[#eeeeee] rounded px-4 py-2 w-1/2 border text-lg placeholder:text-base '
                required 
                />
                </div>

                <h3 className='text-lg font-medium mb-2'>What's your email</h3>

                <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com" 
                className ='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                required 
                />

                <h3 className='text-lg font-medium mb-2'>Enter Password</h3>

                <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password" 
                className ='bg-[#eeeeee] mb-6 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                required 
                />

                <button
                className ='bg-[#111] text-white font-semibold mb-2 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                >Register</button>

                <p className='text-center'>Already have an Account?<Link to="/user-login" className='text-blue-600'>Login here</Link></p>
            </form>
            </div>
            <div>
            <p className='text-[10px] leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply</p>
            </div>
        </div>
    );
}

export default UserSignup;