import React from "react";
import uberCar from '../assets/uberCar-removebg-preview.png';


const LookingForDriver = (props) => {
    return (
        <div>
                    <h5 onClick={() => {
                            props.setVehicleFound(false);
                        }} className="w-full p-1 text-center absolute top-0"><i className="text-3xl color-gray ri-arrow-down-wide-fill"></i>
                    </h5>
                    <h3 className="font-bold mb-2 text-lg">Looking for a Driver...</h3>
                    <div className="flex gap-2 flex-col justify-between items-center">
                        <img className="h-30" src={uberCar} alt="" />
                        <div className="w-full mt-5">
                            <div className="flex items-center gap-5 p-3 border-b-1 border-gray-600">
                                <i className="text-lg ri-map-pin-2-fill"></i>
                                <div>
                                    <h3 className="text-lg font-medium">562/11-A</h3>
                                    <p className="text-sm text-gray-600 -mt-1">{props.pickup}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-3 border-b-1 border-gray-600">
                                <i className="ri-map-pin-user-line"></i>
                                <div>
                                    <h3 className="text-lg font-medium">263</h3>
                                    <p className="text-sm text-gray-600 -mt-1">{props.destination}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-5 p-3">
                                <i className="ri-money-rupee-circle-fill"></i>
                                <div>
                                    <h3 className="text-lg font-medium">₹{props.fares[props.vehicleType]}</h3>
                                    <p className="text-sm text-gray-600 -mt-1">Cash Cash</p>
                                </div>
                            </div>
                        </div>
                    </div>
        
                </div>
    )
};

export default LookingForDriver;