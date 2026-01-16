import React from "react";
import uberCar from '../assets/uberCar-removebg-preview.png';
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/socketContext";
import LiveTracking from "../components/LiveTracking";

const Riding = () => {
    const location = useLocation();
    const ride = location.state?.ride;

    const { onEvent } = useSocket();
    const navigate = useNavigate();

    useEffect(() => {
        const off = onEvent('ride-ended', () => {
        navigate('/home');
        });
        return off;
    }, [onEvent]);


    return (
        <div className="min-h-[100dvh]">
            <Link to='/home' className="fixed z-10 right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full">
                <i className="text-lg font-medium ri-home-9-fill"></i>
            </Link>
            <div className="h-1/2">
                <LiveTracking
                ride={ride}
                />
            </div>
            <div className="h-1/2 p-4 fixed z-10 w-full bottom-0 bg-white">
            <div className="flex items-center justify-between">
                                            <img className="h-15" src={uberCar} alt="" />
                                            <div className="text-right">
                                                <h2 className="text-lg font-medium">{ride?.captain.fullname.firstname}</h2>
                                                <h4 className="text-xl font-semibold -mt-1 -mb-1">{ride?.vehicle?.plate}</h4>
                                                <p className="text-sm text-gray-600">Maruti Suzuki Alto</p>
                                            </div>
                                                                    
            </div>
            <div className="flex gap-2 flex-col justify-between items-center">
                                            <div className="w-full mt-5">
                                                <div className="flex items-center gap-5 p-3 border-b-1 border-gray-600">
                                                    <i className="text-lg ri-map-pin-2-fill"></i>
                                                    <div>
                                                        <h3 className="text-lg font-medium">562/11-A</h3>
                                                        <p className="text-sm text-gray-600 -mt-1">{ride?.pickupLocation}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-5 p-3">
                                                    <i className="ri-money-rupee-circle-fill"></i>
                                                    <div>
                                                        <h3 className="text-lg font-medium">₹{ride?.fare}</h3>
                                                        <p className="text-sm text-gray-600 -mt-1">Cash Cash</p>
                                                    </div>
                                                </div>
                                            </div>
            </div>
            <button
            onClick={() => {
                navigate('/home');
            }}
            className="w-full mt-7 bg-green-600 text-white font-semibold p-2 rounded-lg">Make a Payment</button>
            </div>
        </div>
    )
}

export default Riding;