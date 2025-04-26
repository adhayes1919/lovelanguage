import './Home.css';
import AuthForm from 'components/AuthForm';
import Navbar from 'components/Navbar';
import { AddPartner, AddCouple } from './Pair.jsx';
import Study from './Study.jsx';

const Home = () => {
    let isLoggedIn = true; //TODO: placeholder to check for user status
    let isPairedPartner = true; //TODO: another placeholder to check if user has a paired partner

    if (!isLoggedIn) {
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

    //Actual main home page here
    return (
        <div>
            <div> 
                <Study />
            </div>
            <Navbar />
        </div>
    )
}

export default Home;
