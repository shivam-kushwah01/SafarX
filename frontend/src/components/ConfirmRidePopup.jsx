import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { CaptainDataContext } from "../context/captainContext";
import { useContext } from "react";

const ConfirmRidePopup = (props) => {

    const [ otp, setOtp] = useState("");

    const { captain } = useContext(CaptainDataContext);

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
            rideId: props.ride._id,
            captain,
            otp
        },{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });

        if(response.status === 200){
            props.setConfirmRidePopupPanel(false);
            props.setRidePopupPanel(false);
            // Pass ride data to CaptainRiding via navigation state so it can render immediately
            const rideData = response.data?.ride || response.data || props.ride;
            navigate('/captain-riding', { state: { ride: rideData, captain } });
        }

    }

    return (
        <div>
                        <h5 onClick={() => {
                            props.setConfirmRidePopupPanel(false);
                        }} className="w-full p-1 text-center absolute top-0"><i className="text-3xl color-gray ri-arrow-down-wide-fill"></i>
                        </h5>
                        <h3 className="font-bold mb-2 text-lg">Confirm this ride to Start</h3>
                        <div className="flex items-center justify-between p-3 bg-yellow-400 rounded-lg mt-3">
                            <div className="flex items-center gap-3">
                                <img className="h-12 w-12 rounded-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBHbvzAQOAEvoGlHkYUn9wCp-g0oiBmgkQvA&s" alt="" />
                                <h2 className="text-lg font-semibold">{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</h2>
                            </div>
                            <h5 className="font-semibold">2.2 KM</h5>
                        </div>
                        <div className="flex gap-2 flex-col justify-between items-center">
                            <div className="w-full mt-5">
                                <div className="flex items-center gap-5 p-3 border-b-1 border-gray-600">
                                    <i className="text-lg ri-map-pin-2-fill"></i>
                                    <div>
                                        <h3 className="text-lg font-medium">562/11-A</h3>
                                        <p className="text-sm text-gray-600 -mt-1">{props.ride?.pickupLocation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 p-3 border-b-1 border-gray-600">
                                    <i className="ri-map-pin-user-line"></i>
                                    <div>
                                        <h3 className="text-lg font-medium">263</h3>
                                        <p className="text-sm text-gray-600 -mt-1">{props.ride?.dropLocation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5 p-3">
                                    <i className="ri-money-rupee-circle-fill"></i>
                                    <div>
                                        <h3 className="text-lg font-medium">₹{props.ride?.fare}</h3>
                                        <p className="text-sm text-gray-600 -mt-1">Cash Cash</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 w-full">
                                <form onSubmit={(e) => {
                                    handleSubmit(e);
                                }} >

                                    <input 
                                    type="text" 
                                    className="bg-[#eee] px-6 py-4 w-full text-lg rounded-lg w-full mt-3 mb-3"  
                                    placeholder="Enter OTP" 
                                    value={otp}
                                    onChange={(e) => {
                                        setOtp(e.target.value)
                                    }}
                                    />
                                <div className="flex gap-2 fixed bottom-5 w-[94%]">
                                    <button onClick={() => {
                                props.setConfirmRidePopupPanel(false);
                             }
                            } className="w-1/2 bg-red-600 text-white font-semibold p-3 rounded-lg">Cancel</button>
                                    <button 
                                    className="w-1/2 flex justify-center bg-green-600 text-white font-semibold p-3 rounded-lg">Confirm</button>
                                </div>
                                </form>
                            </div>
                        
                        </div>
        </div>
    )
};

export default ConfirmRidePopup;