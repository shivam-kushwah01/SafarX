import react, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import safarX from '../assets/safarX.png'
import CaptainDetails from "../components/CaptainDetails.jsx";
import RidePopup from "../components/RidePopup.jsx";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ConfirmRidePopup from "../components/ConfirmRidePopup.jsx";
import { useEffect, useContext } from "react";
import { useSocket } from "../context/socketContext.jsx";
import { CaptainDataContext } from "../context/captainContext.jsx";
import axios from "axios";
import LiveTracking from "../components/LiveTracking.jsx";

const CaptainHome = () => {

    const [ridePopupPanel, setRidePopupPanel] = useState(false);

    const ridePopupPanelRef = useRef(null);

    const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);

    const confirmRidePopupPanelRef = useRef(null);

    const [ride, setRide] = useState(null);

    const { captain } = useContext(CaptainDataContext);
    const { sendMessage, onEvent } = useSocket();

    useEffect(() => {
        if (!captain?._id) return;

        sendMessage('join', {
            userId: captain._id,
            role: 'captain'
        });

        const sendLocation = () => {
            if (!navigator.geolocation) return;

            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const { latitude: lat, longitude: lon } = pos.coords;
                    sendMessage('update-location-captain', { userId: captain._id, location: { lat, lon } });
                },
                (err) => console.error('Geolocation error', err),
                { enableHighAccuracy: true }
            );
        };

        // send immediately then every 10s
        sendLocation();
        const intervalId = setInterval(sendLocation, 10000);

        return () => clearInterval(intervalId);
    }, [captain, sendMessage]);

    useEffect(() => {
        const off = onEvent('new-ride', (ride) => {
            console.log('New ride received:', ride);
            setRide(ride);
            setRidePopupPanel(true);
        });
        return off;
    }, [onEvent]);

    useGSAP(() => {
        if(ridePopupPanel){
            gsap.to(ridePopupPanelRef.current, {
            transform:'translateY(0)'
        })
        }
        else{
            gsap.to(ridePopupPanelRef.current, {
            transform:'translateY(100%)'
        })
        }
    }, [ridePopupPanel]);

    useGSAP(() => {
        if(confirmRidePopupPanel){
            gsap.to(confirmRidePopupPanelRef.current, {
            transform:'translateY(0)'
        })
        }
        else{
            gsap.to(confirmRidePopupPanelRef.current, {
            transform:'translateY(100%)'
        })
        }
    }, [confirmRidePopupPanel]);

    async function confirmRide(){
        const response = axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captain
        },{
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
    }

    return (
        <div className="min-h-[100dvh]">
            <div className="fixed p-6 top-0 z-10">
                <img className="w-20 fixed left-2 top-3" src={safarX} alt="" />
                <Link to='/home' className="fixed right-2 top-2 h-10 w-10 bg-white flex items-center justify-center rounded-full">
                <i className="text-lg font-medium ri-contract-left-line"></i>
            </Link>
            </div>
            <div className="h-[65%]">
                <LiveTracking
                ride={ride}
                />
            </div>
            <div className="fixed w-full bg-white h-[35%] p-5 z-10 overflow-y-hidden">
                <CaptainDetails />
            </div>
            <div ref={ridePopupPanelRef} className="fixed translate-y-full z-10 bottom-0 px-3 py-10 bg-white w-full">
                <RidePopup 
                ride={ride}
                confirmRide={confirmRide}
                setRidePopupPanel={setRidePopupPanel} 
                setConfirmRidePopupPanel={setConfirmRidePopupPanel}
                />
            </div>
            <div ref={confirmRidePopupPanelRef} className="fixed translate-y-full z-10 bottom-0 px-3 py-10 bg-white w-full h-full">
                <ConfirmRidePopup 
                ride={ride} 
                setConfirmRidePopupPanel={setConfirmRidePopupPanel} 
                setRidePopupPanel={setRidePopupPanel}
                />
            </div>
        </div>
    )
};

export default CaptainHome;