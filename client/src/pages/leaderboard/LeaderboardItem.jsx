import React from 'react';
import './LeaderboardItem.css'; // Add styles here

const LeaderboardItem = ({ coupleName, points, streamNumber }) => {
  return (
    <div className="leaderboard-item">
      <div className="leaderboard-item-couples">
        {/* <div className="couples-pic">
        </div> */}
        {coupleName}
        </div>
      <div className="leaderboard-item-points">
        {points}
        <img src="img/points-star.svg" alt="" />
        </div>
      <div className="leaderboard-item-stream">
        {streamNumber}
        <img src="img/our-streak-heart.svg" alt="" />
        </div>
    </div>
  );
};

export default LeaderboardItem;
