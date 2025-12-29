import React from 'react';
import safarX from '../assets/safarX.png'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserDataContext } from '../context/userContext.jsx';

const Start = () => {
    return (
        <div>
            <div className='bg-cover bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)] h-screen pt-8 flex justify-between flex-col w-full'>
                <img className='w-20 -mt-5 ml-3' src={safarX} alt="" />
                <div className='bg-white pb-7 py-4 px-4'>
                    <h2 className='text-2xl font-bold'>Get Started with SafarX</h2>
                    <Link to='/user-login' className='flex justify-center items-center w-full bg-black text-white py-3 rounded mt-5'>Continue</Link>
                </div>
            </div>
        </div>
    )
}

export default Start;