import React, { useEffect, useState, useContext } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

import { UserDataContext } from "../context/userContext";
import { CaptainDataContext } from "../context/captainContext";

// Fix Leaflet icons (required)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Helper to recenter map when position updates
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center);
  }, [center, map]);
  return null;
};

const LiveTracking = ({ ride }) => {
  const { user } = useContext(UserDataContext);
  const { captain } = useContext(CaptainDataContext);

  const [userPos, setUserPos] = useState(null);
  const [captainPos, setCaptainPos] = useState(null);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);

  const token = localStorage.getItem("token");

  // ---------------- USER LIVE LOCATION ----------------
  useEffect(() => {
    if (!user?.user?._id) return;

    const userId = user.user._id;
    let interval;

    const fetchUserLocation = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/users/${userId}/location`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const loc = res.data?.location;
        if (loc?.lat && loc?.lon) {
          setUserPos([loc.lat, loc.lon]);
        }
      } catch (err) {
        console.error("User location error:", err.message);
      }
    };

    fetchUserLocation();
    interval = setInterval(fetchUserLocation, 10000);

    return () => clearInterval(interval);
  }, [user, token]);

  // ---------------- CAPTAIN LIVE LOCATION ----------------
  useEffect(() => {
    const captainId = ride?.captain?._id || captain?._id;
    if (!captainId) return;

    let interval;

    const fetchCaptainLocation = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/captains/${captainId}/location`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const loc = res.data?.location;
        if (loc?.lat && loc?.lon) {
          setCaptainPos([loc.lat, loc.lon]);
        }
      } catch (err) {
        console.error("Captain location error:", err.message);
      }
    };

    fetchCaptainLocation();
    interval = setInterval(fetchCaptainLocation, 10000);

    return () => clearInterval(interval);
  }, [ride, captain, token]);

  // ---------------- PICKUP & DROP COORDS ----------------
  useEffect(() => {
    if (!ride) return;
    let cancelled = false;

    const fetchCoords = async () => {
      try {
        if (ride.pickupLocation) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
            {
              params: { address: ride.pickupLocation },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!cancelled) setOrigin([res.data.lat, res.data.lon]);
        }

        if (ride.dropLocation) {
          const res = await axios.get(
            `${import.meta.env.VITE_BASE_URL}/maps/get-coordinates`,
            {
              params: { address: ride.dropLocation },
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!cancelled) setDestination([res.data.lat, res.data.lon]);
        }
      } catch (err) {
        console.error("Coords error:", err.message);
      }
    };

    fetchCoords();
    return () => (cancelled = true);
  }, [ride, token]);

  const center = captainPos || userPos || origin;

  if (!center) {
    return (
      <div className="h-[450px] flex items-center justify-center">
        Loading map…
      </div>
    );
  }

    return (
    <div className="fixed h-screen w-screen">
      <MapContainer
      center={center}
      zoom={13}
      zoomControl={false}
      style={{ height: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User origin */}
      {origin && (
        <Marker position={origin}>
          <Popup>Pickup</Popup>
        </Marker>
      )}

      {/* Destination */}
      {destination && (
        <Marker position={destination}>
          <Popup>Destination</Popup>
        </Marker>
      )}

      {/* Captain live position */}
      {captainPos && (
        <Marker position={captainPos}>
          <Popup>Captain</Popup>
        </Marker>
      )}
      {/* User live position (device) */}
      {userPos && (
        <Marker position={userPos}>
          <Popup>You</Popup>
        </Marker>
      )}
    </MapContainer>
    </div>
  );
}

export default LiveTracking;