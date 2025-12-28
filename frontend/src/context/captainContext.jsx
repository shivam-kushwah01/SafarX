import React, { createContext, useState } from "react";

export const CaptainDataContext = createContext();

const CaptainContext = ({ children }) => {
    const [captain, setCaptain] = useState(null);
    const [ isloading, setIsloading ] = useState(false);
    const [ error, setError ] = useState(null);

    const updateCaptain = (newCaptainData) => {
        setCaptain(newCaptainData);
    };

    const value = {
        captain,
        isloading,
        error,
        setCaptain,
        setIsloading,
        setError,
        updateCaptain
    };

    return (
        <div>
            <CaptainDataContext.Provider value={value}>
                {children}
            </CaptainDataContext.Provider>
        </div>
    );
};

export default CaptainContext;
