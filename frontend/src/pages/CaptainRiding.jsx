import React, { useRef, useState } from "react";
import safarX from '../assets/safarX.png'
import { Link, useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import FinishRide from "../components/FinishRide.jsx";
import LiveTracking from "../components/LiveTracking.jsx";

const CaptainRiding = () => {

    const [finishRidePanel, setFinishRidePanel] = useState(false);

    const finishRidePanelRef = useRef(null);

    const location = useLocation();

    const rideData = location.state?.ride;

    useGSAP(() => {
        if(finishRidePanel){
            gsap.to(finishRidePanelRef.current, {
            transform:'translateY(0)'
        })
        }
        else{
            gsap.to(finishRidePanelRef.current, {
            transform:'translateY(100%)'
        })
        }
    }, [finishRidePanel]);


    return (
        <div className="min-h-[100dvh]">
            <div className="fixed top-0 w-screen flex justify-between items-center z-10">
                <img className='w-20 fixed left-2 top-3' src={safarX} alt="" />
                <Link to='/captain-home' className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full">
                <i className="text-lg font-medium ri-contract-left-line"></i>
                </Link>
            </div>
            <div className="h-screen">
                <LiveTracking
                ride={rideData}
                />
            </div>
            <div onClick={() => {
                setFinishRidePanel(true);
            }} className="fixed h-1/5 p-6 bottom-0 bg-yellow-400 w-screen flex justify-between items-center z-10">
                    <h5 onClick={() => {
                    }} className="absolute color-black w-[30%] top-3 left-1/3">
                       <hr className="border-0 h-1 bg-black rounded" />
                </h5>
                <h4 className="text-xl font-semibold">4 KM away</h4>
                <button className="flex justify-center bg-green-600 text-white font-semibold p-2 px-10 rounded-lg">Complete Ride</button>
            </div>
            <div ref={finishRidePanelRef} className="fixed translate-y-full z-10 bottom-0 px-3 py-10 bg-white w-full">
                <FinishRide 
                ride={rideData} 
                setFinishRidePanel={setFinishRidePanel} 
                />
            </div>
        </div>
    )
}

export default CaptainRiding;