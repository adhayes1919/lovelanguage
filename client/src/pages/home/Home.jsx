import './Home.css';
import { useState, useEffect } from 'react';
import { getCookie, deleteCookie } from 'utils/cookies'; 
import AuthForm from 'components/AuthForm';
import Navbar from 'components/Navbar';
import { AddPartner } from './Pair.jsx'; 
import { fetchPartnerDetails, fetchUserDetails } from 'utils/user'; 
import Study from './Study.jsx';

const Home = () => {
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [isPairedPartner, setPairedPartner] = useState(false);

    useEffect(() => {
        async function initialize() {
            const id = getCookie('userId');

            if (id) {
                const userData = await fetchUserDetails(id);
                if (userData) {
                    setLoggedIn(true);
                    await checkPartnerStatus(id);
                } else {
                    console.log("Invalid session or cookie missing user.");
                    forceLogout();
                }
            } else {
                console.log("No cookie found.");
                forceLogout();
            }
        }
        initialize();
    }, []);
    async function checkPartnerStatus(userId) {
        try {
            const partnerCheck = await fetchPartnerDetails(userId);
            if (partnerCheck && partnerCheck.success && partnerCheck.partnerDetails) {
                setPairedPartner(true);
            } else {
                setPairedPartner(false);
            }
        } catch (error) {
            console.error('Error checking partner status:', error);
            setPairedPartner(false);
        }
    }
    function forceLogout() {
        deleteCookie('userId');
        setLoggedIn(false);
        setPairedPartner(false);
    }
    function handleLogout() {
        console.log('User manually logged out.');
        forceLogout();
    }
    if (!isLoggedIn) {
        return (
            <div>
                <AuthForm setLoggedIn={setLoggedIn} />
            </div>
        );
    }
    if (!isPairedPartner) {
        return (
            <AddPartner />
        );
    }
    return (
        <div>
            <div className='home-page-wrap'>
                <Study />
            </div>
            <Navbar />
        </div>
    );
};
export default Home;

