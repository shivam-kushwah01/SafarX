import React, { useContext } from "react";
import { CaptainDataContext } from "../context/captainContext";

const CaptainDetails = () => {

    const { captain } = useContext(CaptainDataContext);

    return (
        <div className="bg-white w-full">
            <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center justify-start gap-2 min-w-0">
                        <img className="h-10 w-10 rounded-full object-cover" src="https://www.pngplay.com/wp-content/uploads/12/User-Avatar-Profile-PNG-Pic-Clip-Art-Background.png" alt="" />
                        <h4 className="text-lg font-semibold capitalize truncate">{captain.fullname.firstname + " " + captain.fullname.lastname}</h4>
                    </div>
                    <div>
                        <h4 className="text-xl font-semibold">₹295.30</h4>
                        <p className="text-sm text-gray-600">Earned</p>
                    </div>
                </div>
                <div className="flex p-3 mt-6 bg-gray-100 rounded-xl justify-around items-start">
                    <div className="text-center">
                        <i className="text-3xl mb-2 font-thin ri-time-line"></i>
                        <h5 className="text-lg font-medium">10.2</h5>
                        <p className="text-sm text-gray-600">Hours Online</p>
                    </div>
                    <div className="text-center">
                        <i className="text-3xl mb-2 font-thin ri-dashboard-3-line"></i>
                        <h5 className="text-lg font-medium">10.2</h5>
                        <p className="text-sm text-gray-600">Hours Online</p>
                    </div>
                    <div className="text-center">
                        <i className="text-3xl mb-2 font-thin ri-booklet-line"></i>
                        <h5 className="text-lg font-medium">10.2</h5>
                        <p className="text-sm text-gray-600">Hours Online</p>
                    </div>
                </div>
        </div>
    )
};

export default CaptainDetails;