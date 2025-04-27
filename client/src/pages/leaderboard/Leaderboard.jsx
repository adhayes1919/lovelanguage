import './Leaderboard.css';
import Navbar from 'components/Navbar';
import LeaderboardItem from "./LeaderboardItem";

const sampleLeaderboardData = [
    { coupleName: 'Peipei & Ayden', points: 400, streamNumber: 7 },
    { coupleName: 'Felipe & Griffin', points: 380, streamNumber: 18 },
    { coupleName: 'Oinay and James', points: 161, streamNumber: 10 },
    { coupleName: 'Oinay and James', points: 161, streamNumber: 10 },
    { coupleName: 'Oinay and James', points: 161, streamNumber: 10 },
    { coupleName: 'Oinay and James', points: 161, streamNumber: 10 },
    // add more entries here or fetch from backend
  ];


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

            <div className="leaderboard-bottom-scroll">
            {sampleLeaderboardData.map((entry, idx) => (
          <LeaderboardItem
            key={idx}
            coupleName={entry.coupleName}
            points={entry.points}
            streamNumber={entry.streamNumber}
          />
        ))}
            </div>


            <Navbar />
        </div>
    );
}

export default Leaderboard;
