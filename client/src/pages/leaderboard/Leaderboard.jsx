import './Leaderboard.css';
import Navbar from 'components/Navbar';


const Leaderboard = () => {
    return (
        <div className="leaderboard-page-wrap">
            <div>
                <div className="first-place">
                    <div className="user-left-first">
                    </div>
                    <div className="user-right-first">
                    </div>
                </div>

                <div className="second-and-third-place">
                    <div className="second-place">
                        <div className="user-left-second">
                        </div>
                        <div className="user-right-second">
                        </div>
                    </div>

                    <div className="third-place">
                        <div className="user-left-third">
                        </div>
                        <div className="user-right-third">
                        </div>
                    </div>
                </div>
            </div>
            <img src="img/leaderboard-steps.svg" className="leaderboard-steps"/>

            <Navbar />
        </div>
    );
}

export default Leaderboard;
