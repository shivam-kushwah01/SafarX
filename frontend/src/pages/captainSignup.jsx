import React, { useState } from 'react';
import safarX from '../assets/safarX.png'
import { Link } from 'react-router-dom';
import { CaptainDataContext } from '../context/captainContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CaptainSignup = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [vehicleColor, setVehicleColor] = useState('');
    const [vehiclePlate, setVehiclePlate] = useState('');
    const [vehicleType, setVehicleType] = useState('');
    const [vehicleCapacity, setVehicleCapacity] = useState('');

    const { captain, setCaptain } = React.useContext(CaptainDataContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            fullname: {
                firstname: firstName,
                lastname: lastName
            },
            email,
            password,
            vehicle: {
                color: vehicleColor,
                plate: vehiclePlate,
                capacity: Number(vehicleCapacity),
                vehicleType: vehicleType
            }
        };

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, newUser);

        console.log(newUser);

        if(response.status === 201){
            const data = response.data;
            setCaptain(data.captain);
            localStorage.setItem('token', data.token);
            navigate('/captain-home');
        }

        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setVehicleColor('');
        setVehiclePlate('');
        setVehicleType('');
        setVehicleCapacity('');
    }

    return (
        <div className='p-7 flex flex-col justify-between min-h-[100dvh]'>
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

                <h3 className='text-lg font-medium mb-2'>Vehicle color</h3>

                <input
                type="text"
                value={vehicleColor}
                onChange={(e) => setVehicleColor(e.target.value)}
                placeholder="e.g. red"
                className='bg-[#eeeeee] mb-4 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                required
                />

                <h3 className='text-lg font-medium mb-2'>Vehicle plate</h3>

                <input
                type="text"
                value={vehiclePlate}
                onChange={(e) => setVehiclePlate(e.target.value)}
                placeholder="e.g. ABC123"
                className='bg-[#eeeeee] mb-4 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                required
                />

                <div className='flex gap-4 mb-6'>
                <div className='w-1/2'>
                    <h3 className='text-lg font-medium mb-2'>Capacity</h3>
                    <input
                    type="number"
                    min={1}
                    value={vehicleCapacity}
                    onChange={(e) => setVehicleCapacity(e.target.value)}
                    placeholder="e.g. 4"
                    className='bg-[#eeeeee] rounded px-4 py-2 w-full border text-lg placeholder:text-base '
                    required
                    />
                </div>

                <div className='w-1/2'>
                    <h3 className='text-lg font-medium mb-2'>Vehicle type</h3>
                    <select
                        value={vehicleType}
                        onChange={(e) => setVehicleType(e.target.value)}
                        className='bg-[#eeeeee] rounded px-4 py-2 w-full border text-lg'
                        required
                    >
                        <option value="">Select type</option>
                        <option value="car">Car</option>
                        <option value="bike">Bike</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>
                </div>

                <button
                className ='bg-[#111] text-white font-semibold mb-2 rounded px-4 py-2 border w-full text-lg placeholder:text-base '
                >Register</button>

                <p className='text-center'>Already have an Account?<Link to="/captain-login" className='text-blue-600'>Login here</Link></p>
            </form>
            </div>
            <div>
            <p className='text-[10px] mt-5 mb-5 leading-tight'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy Policy</span> and <span className='underline'>Terms of Service</span> apply</p>
            </div>
        </div>
    );
}

export default CaptainSignup;