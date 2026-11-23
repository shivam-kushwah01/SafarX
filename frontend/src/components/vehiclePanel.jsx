import React from "react";
import uberCar from '../assets/uberCar-removebg-preview.png';
import uberBike from '../assets/uberBike-removebg-preview.png';
import uberAuto from '../assets/uberAuto-removebg-preview.png';

const VehiclePanel = (props) => {
    return(
        <div>
                 <h5 onClick={() =>
                    props.setVehiclePanel(false)
                 } className="w-full p-1 text-center absolute top-0"><i className="text-3xl color-gray ri-arrow-down-wide-fill"></i></h5>
                 <h3 className="font-bold mb-2 text-lg">Choose a Vehicle</h3>
                 <div onClick={() => {
                    props.setConfirmRidePanel(true),
                    props.setVehicleType('car')
                 }} className="flex mb-2 bg-[#eee] border-2 border-transparent active:border-black hover:border-gray-400 cursor-pointer rounded-xl p-3 items-center justify-between gap-3 w-full">
                    <img className="h-14 w-20 shrink-0 object-contain" src={uberCar} alt="" />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base">UberGo <span><i className="ri-user-3-fill"></i>4</span></h4>
                        <h5 className="font-medium text-sm">2 mins away</h5>
                        <p className="text-xs text-gray-600">Affordable, compact rides</p>
                    </div>
                    <h2 className="text-xl font-semibold shrink-0">₹{props.fares.car}</h2>
                 </div>
                 <div onClick={() => {
                    props.setConfirmRidePanel(true),
                    props.setVehicleType('moto')
                 }} className="flex mb-2 bg-[#eee] border-2 border-transparent active:border-black hover:border-gray-400 cursor-pointer rounded-xl p-3 items-center justify-between gap-3 w-full">
                    <img className="h-14 w-20 shrink-0 object-contain" src={uberBike} alt="" />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base">Moto <span><i className="ri-user-3-fill"></i>1</span></h4>
                        <h5 className="font-medium text-sm">3 mins away</h5>
                        <p className="text-xs text-gray-600">Affordable, motorcycle rides</p>
                    </div>
                    <h2 className="text-xl font-semibold shrink-0">₹{props.fares.moto}</h2>
                 </div>
                 <div onClick={() => {
                    props.setConfirmRidePanel(true),
                    props.setVehicleType('auto')
                 }} className="flex mb-2 bg-[#eee] border-2 border-transparent active:border-black hover:border-gray-400 cursor-pointer rounded-xl p-3 items-center justify-between gap-3 w-full">
                    <img className="h-14 w-20 shrink-0 object-contain" src={uberAuto} alt="" />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-base">UberAuto <span><i className="ri-user-3-fill"></i>3</span></h4>
                        <h5 className="font-medium text-sm">3 mins away</h5>
                        <p className="text-xs text-gray-600">Affordable, auto rides</p>
                    </div>
                    <h2 className="text-xl font-semibold shrink-0">₹{props.fares.auto}</h2>
                 </div>
        </div>
    )
};

export default VehiclePanel;