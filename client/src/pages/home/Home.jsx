import './Home.css';
import { useState, useEffect } from 'react';
import { getCookie, deleteCookie } from 'utils/cookies'; 
import AuthForm from 'components/AuthForm';
import Navbar from 'components/Navbar';
import { AddPartner } from './Pair.jsx'; 
import { fetchPartnerDetails } from 'utils/user'; 
import Study from './Study.jsx';

const Home = () => {
    const [isLoggedIn, setLoggedIn] = useState(true);
    const [isPairedPartner, setPairedPartner] = useState(true);

    useEffect(() => {
        const id = getCookie('userId');
        setLoggedIn(!!id); // true if exists, false otherwise
            if (id) {
                checkPartnerStatus(id);
        }
    }, []);

    //dummy function since can't set partner yet
    async function checkPartnerStatus(userId) {
        return true;
    }
    /* handles checking if user has a partner yet
    async function checkPartnerStatus(userId) {
        try {
            const partnerDetails = await fetchPartnerDetails(userId);
            if (partnerDetails) {
                setPairedPartner(true); // Partner found
            } else {
                setPairedPartner(false); // No partner
            }
        } catch (error) {
            console.error('Error checking partner status:', error);
            setPairedPartner(false);
        }
    }
    */

    function handleLogout() {
        deleteCookie('userId');  
        console.log('Logged out.');
        setLoggedIn(false);
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
            <button onClick={handleLogout}>Logout</button>
            <Study />
            <Navbar />
        </div>
    );
};

export default Home;

