import React from "react";

const RidePopup = (props) => {
    return (
        <div>
                        <h5 onClick={() => {
                            props.setRidePopupPanel(false);
                        }} className="w-full p-1 text-center absolute top-0"><i className="text-3xl color-gray ri-arrow-down-wide-fill"></i>
                        </h5>
                        <h3 className="font-bold mb-2 text-lg">New Ride Available!</h3>
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
                            <button onClick={() => {
                                props.setConfirmRidePopupPanel(true),
                                props.confirmRide()
                             }
                            } className="w-full bg-yellow-400 font-semibold p-2 rounded-lg">Accept</button>
                            <button onClick={() => {
                                props.setRidePopupPanel(false);
                             }
                            } className="w-full bg-gray-300 font-semibold p-2 rounded-lg">Ignore</button>
                        
                        </div>
        </div>
    )
};

export default RidePopup;