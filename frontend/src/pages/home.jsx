import React, { useState, useRef, useEffect } from "react";
import safarX from '../assets/safarX.png'
import { gsap } from 'gsap';
import 'remixicon/fonts/remixicon.css';
import LocationSearchPanel from "../components/locationSearchPanel";
import { useGSAP } from '@gsap/react';
import VehiclePanel from "../components/vehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import WaitForDriver from "../components/WaitForDriver";
import LookingForDriver from "../components/LookingForDriver";
import axios from 'axios';
import { useSocket } from "../context/socketContext";
import { UserDataContext } from "../context/userContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

const Home = () => {
    const [pickup, setPickup] = useState("");
    const [destination, setDestination] = useState("");
    const [panel, setPanel] = useState(false);
    const panelRef =  useRef(null);
    const panelCloseRef =  useRef(null);
    const [vehiclePanel, setVehiclePanel] = useState(false);
    const vehiclePanelRef = useRef(null);
    const [confirmRidePanel, setConfirmRidePanel] = useState(false);
    const confirmRidePanelRef = useRef(null);
    const [vehicleFound, setVehicleFound] = useState(false);
    const vehicleFoundRef = useRef(null);
    const [waitingForDriver, setWaitingForDriver] = useState(false);
    const waitingForDriverRef = useRef(null);
    const [suggestions, setSuggestions] = useState([]);
    const [activeField, setActiveField] = useState(null);
    const [fare, setFare] = useState({});
    const [vehicleType, setVehicleType] = useState("");
    const [ride, setRide] = useState(null);

    const navigate = useNavigate();

    const { sendMessage, onEvent } = useSocket();
    const { user } = useContext(UserDataContext);

    useEffect(() => {
        sendMessage('join', {
            userId: user.user._id,
            role: 'user'
        });
    },[user, sendMessage]);

    // send user's live location to backend via socket every 10 seconds
    useEffect(() => {
        if (!navigator.geolocation) return;
        let intervalId;

        const sendLocation = () => {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const lat = pos.coords.latitude;
                    const lon = pos.coords.longitude;
                    sendMessage('update-location-user', { userId: user.user._id, location: { lat, lon } });
                },
                (err) => console.error('Geolocation error', err),
                { enableHighAccuracy: true }
            );
        };

        // start immediately and then every 10s
        sendLocation();
        intervalId = setInterval(sendLocation, 10000);

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [sendMessage, user]);

    useEffect(() => {
        const off = onEvent('ride-confirmed', (ride) => {
        setWaitingForDriver(true);
        setRide(ride);
        });
        return off;
    }, [onEvent]);

    useEffect(() => {
        const off = onEvent('ride-started', (rideData) => {
        setWaitingForDriver(false);
        navigate('/riding', { state: { ride: rideData || ride } });
        });
        return off;
    }, [onEvent]);

    const handleSubmit = (e) => {
        e.preventDefault();
    }

    const handleLocationInput = async (value, fieldType) => {
        if (fieldType === 'pickup') {
            setPickup(value);
        } else {
            setDestination(value);
        }

        if (value.length > 2) {
            try {
                const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`, {
                    params: { input: value },
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setSuggestions(response.data.suggestions || []);
                setActiveField(fieldType);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
        }
    }

    useGSAP(() => {
        if (!panelRef.current) return;
        if(panel){
            gsap.to(panelRef.current, { height: '70%', duration: 0.4, opacity: 1, padding: 20  });
            gsap.to(panelCloseRef.current, { opacity: 1 });
        } else {
            gsap.to(panelRef.current, { height: '0%', duration: 0.4, opacity: 0, padding : 0 });
            gsap.to(panelCloseRef.current, { opacity: 0 });
        }
    }, [panel]);

    useGSAP(() => {
        if(vehiclePanel){
            gsap.to(vehiclePanelRef.current, {
            transform:'translateY(0)'
        })
        }
        else{
            gsap.to(vehiclePanelRef.current, {
            transform:'translateY(100%)'
        })
        }
    }, [vehiclePanel]);

    useGSAP(() => {
        if(confirmRidePanel){
            gsap.to(confirmRidePanelRef.current, {
            transform:'translateY(0)'
        })
        }
        else{
            gsap.to(confirmRidePanelRef.current, {
            transform:'translateY(100%)'
        })
        }
    }, [confirmRidePanel]);

    useGSAP(() => {
        if(vehicleFound){
            gsap.to(vehicleFoundRef.current, {
            transform:'translateY(0)'
        })
        }
        else{
            gsap.to(vehicleFoundRef.current, {
            transform:'translateY(100%)'
        })
        }
    }, [vehicleFound]);

     useGSAP(() => {
        if(waitingForDriver){
            gsap.to(waitingForDriverRef.current, {
            transform:'translateY(0)'
        })
        }
        else{
            gsap.to(waitingForDriverRef.current, {
            transform:'translateY(100%)'
        })
        }
    }, [waitingForDriver]);


    async function findTrip() {
        setVehiclePanel(true);
        setPanel(false);

        try {
            const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/fare`, {
                params: { pickupLocation: pickup, dropLocation: destination },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            setFare(response.data.fares);
        } catch (error) {
            console.error('Error fetching fare:', error);
        }
    }

    async function createRide() {
        try {
            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create-ride`, {
                pickupLocation: pickup,
                dropLocation: destination,
                vehicleType
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            response.status(200).json({ message: 'Ride created successfully' });
        } catch (error) {
            console.error('Error creating ride:', error);
        }
    }

    return (
        <div className="h-screen overflow-hidden relative">
            <img className='w-20 fixed z-9 left-2 top-2' src={safarX} alt="" />
            <div className="w-screen h-screen">
                <LiveTracking
                ride={ride}
                />
            </div>
            <div className="fixed z-10 flex flex-col justify-end absolute w-full top-0 h-screen">
                <div className="bg-white p-6 h-[35%]">
                    <h5 ref={panelCloseRef} onClick={() => {
                        setPanel(false);
                    }} className="absolute opacity-0 right-6 top-6 text-2xl" >
                       <i className="ri-arrow-down-wide-line"></i>
                    </h5>
                    <h4 className="text-2xl font-semibold">Find a trip</h4>
                <form onSubmit={(e) => {
                    handleSubmit(e)
                }}>
                    <input 
                    onClick={() => {
                        setPanel(true);
                        setActiveField('pickup');
                    }}
                    value={pickup}
                    onChange={(e) => {
                        handleLocationInput(e.target.value, 'pickup');
                    }}
                    className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3" 
                    type="text" 
                    placeholder="Add a pick up location"
                    />
                    <br />
                    <input 
                    onClick={() => {
                        setPanel(true);
                        setActiveField('destination');
                    }}
                    value={destination}
                    onChange={(e) => {
                        handleLocationInput(e.target.value, 'destination');
                    }}
                    className="bg-[#eee] px-12 py-2 text-base rounded-lg w-full mt-3" 
                    type="text" 
                    placeholder="Enter your destination"
                    />
                </form>
                <button 
                onClick={findTrip}
                className="w-full mt-3 bg-yellow-400 text-black font-bold px-4 py-2 rounded-lg">Find Trip</button>
                </div>
                <div ref={panelRef} className="opacity-0 h-0 bg-white">
                     <LocationSearchPanel 
                        setPanel={setPanel} 
                        setVehiclePanel={setVehiclePanel}
                        suggestions={suggestions}
                        activeField={activeField}
                        setPickup={setPickup}
                        setDestination={setDestination}
                     />
                </div>
            </div>
            <div ref={vehiclePanelRef} 
            className="translate-y-full fixed z-10 bottom-0 px-3 py-10 bg-white w-full">
                 <VehiclePanel 
                 setConfirmRidePanel={setConfirmRidePanel} 
                 setVehiclePanel={setVehiclePanel} 
                 fares={fare} 
                 setVehicleType={setVehicleType} 
                 />
            </div>
            <div ref={confirmRidePanelRef} 
            className="translate-y-full fixed z-10 bottom-0 px-3 py-5 pt-10 bg-white w-full">
                 <ConfirmRide 
                 vehicleType={vehicleType}
                 fares={fare} 
                 pickup={pickup} 
                 destination={destination} 
                 createRide={createRide} 
                 setConfirmRidePanel={setConfirmRidePanel} 
                 setVehicleFound={setVehicleFound}
                 />
            </div>
              <div ref={vehicleFoundRef} className="translate-y-full fixed z-10 bottom-0 px-3 py-5 pt-10 bg-white w-full">
                  <LookingForDriver 
                  vehicleType={vehicleType}
                  fares={fare} 
                  pickup={pickup} 
                  destination={destination}  
                  setVehicleFound={setVehicleFound} 
                  setVehiclePanel={setVehiclePanel} 
                  />
              </div>
              <div ref={waitingForDriverRef} className="translate-y-full fixed z-10 bottom-0 px-3 py-5 pt-10 bg-white w-full">
                  <WaitForDriver
                  ride={ride} 
                  waitingForDriver={waitingForDriver} 
                  setWaitingForDriver={setWaitingForDriver} 
                  />
              </div>
        </div>
    )
};

export default Home;