import React from "react";

const LocationSearchPanel = (props) => {
    const handleLocationClick = (location) => {
        if (props.activeField === 'pickup') {
            props.setPickup(location);
        } else if (props.activeField === 'destination') {
            props.setDestination(location);
        }
        // props.setVehiclePanel(true);
        // props.setPanel(false);
    };

    return (
        <div>
            {
                props.suggestions && props.suggestions.length > 0 ? (
                    props.suggestions.map((el, idx) => {
                        return <div key={idx} onClick={() => handleLocationClick(el)} className="flex border-2 p-2 border-transparent hover:bg-gray-50 active:border-black rounded-xl items-center justify-between my-2 gap-3 cursor-pointer">
                          <h2 className="bg-[#eee] h-10 w-10 shrink-0 flex items-center justify-center rounded-full"><i className="ri-map-pin-2-fill"></i></h2>
                          <h4 className="font-medium flex-1 min-w-0">{el}</h4>
                        </div>
                    })
                ) : (
                    <div className="text-center py-4 text-gray-500">No suggestions found</div>
                )
            }
        </div>
    );
}

export default LocationSearchPanel;