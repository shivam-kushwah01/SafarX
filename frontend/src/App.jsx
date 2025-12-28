import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Start from './pages/start.jsx';
import Captainlogin from './pages/captainLogin.jsx';
import Userlogin from './pages/userLogin.jsx';
import Captainsignup from './pages/captainSignup.jsx';
import Usersignup from './pages/userSignup.jsx';
import Home from './pages/home.jsx';
import UserProtectedWrapper from './pages/userProtectedWrapper.jsx';
import UserLogout from './pages/UserLogout.jsx';
import CaptainHome from './pages/captainHome.jsx';
import CaptainProtectedWrapper from './pages/captainProtectedWrapper.jsx';
import Riding from './pages/Riding.jsx';
import CaptainRiding from './pages/CaptainRiding.jsx';

const App = () => {
    return (
        <div>
            <Routes>
                <Route path='/home' element={<UserProtectedWrapper> <Home /> </UserProtectedWrapper>} />
                <Route path="/" element={<Start />} />
                <Route path="/captain-login" element={<Captainlogin />} />
                <Route path="/user-login" element={<Userlogin />} />
                <Route path="/captain-signup" element={<Captainsignup />} />
                <Route path="/user-signup" element={<Usersignup />} />
                <Route path='/user-logout' element={<UserProtectedWrapper> <UserLogout /> </UserProtectedWrapper>} />
                <Route path='/captain-home' element={<CaptainProtectedWrapper> <CaptainHome /> </CaptainProtectedWrapper>} />
                <Route path='/riding' element={<Riding />} />
                <Route path='/captain-riding' element={<CaptainRiding />} />
            </Routes>
        </div>
    );
}

export default App;