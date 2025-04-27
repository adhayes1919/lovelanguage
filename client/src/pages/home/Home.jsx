import './Home.css';
import { useState, useEffect } from 'react';
import AuthForm from 'components/AuthForm';
import Navbar from 'components/Navbar';
import { AddPartner, AddCouple } from './Pair.jsx';
import Study from './Study.jsx';

const Home = () => {
    const [isLoggedIn, setLoggedIn] = useState(true);
    const [isPairedPartner, setPairedPartner] = useState(true);
    /*
    useEffect(() => {
        setLoggedIn(document.cookie.includes('username='));
    }, []); // <-- empty array = run once on component mount */

    //let isLoggedIn = true; //TODO: placeholder to check for user status

    if (!isLoggedIn) {
        console.log(isLoggedIn);
        return (
            <div>
                <AuthForm />
            </div>
        );
    }

    if (!isPairedPartner) {
        return (
            <AddPartner />
        )
    }

    //<button onClick={handleLogout}>Logout</button>

    function handleLogout() {
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        console.log('Logged out.');
        window.location.reload();
    }


    //Actual main home page here
    return (
        <div>
            <div className='home-page-wrap'>
                <Study />
            </div>
            <Navbar />
        </div>
    )
}

export default Home;
