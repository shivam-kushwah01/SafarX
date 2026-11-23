import React from 'react';
import safarX from '../assets/safarX.png'
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserDataContext } from '../context/userContext.jsx';

const Start = () => {
    return (
        <div className='min-h-[100dvh] flex flex-col md:flex-row'>
            {/* Photo: fills the screen above the panel on phones, left column on tablets/desktops */}
            <div className='flex-1 md:flex-none md:w-1/2 lg:w-3/5 md:min-h-[100dvh] bg-cover bg-center bg-[url(https://images.unsplash.com/photo-1619059558110-c45be64b73ae?w=1200&auto=format&fit=crop&q=70&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dHJhZmZpYyUyMGxpZ2h0fGVufDB8fDB8fHww)] pt-3'>
                <img className='w-20 ml-3 md:hidden' src={safarX} alt="SafarX" />
            </div>
            <div className='bg-white pb-7 py-4 px-4 md:w-1/2 lg:w-2/5 md:flex md:flex-col md:justify-center md:px-12 lg:px-20'>
                <img className='hidden md:block w-28 mb-10' src={safarX} alt="SafarX" />
                <h2 className='text-2xl md:text-4xl font-bold'>Get Started with SafarX</h2>
                <p className='hidden md:block text-gray-600 mt-3 text-lg'>Book rides in seconds and track your trip live.</p>
                <Link to='/user-login' className='flex justify-center items-center w-full bg-black text-white py-3 rounded mt-5 md:mt-8 md:max-w-sm'>Continue</Link>
            </div>
        </div>
    )
}

export default Start;