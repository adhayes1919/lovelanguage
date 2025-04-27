import React, { useState, useEffect } from 'react';
import './About.css';
import Navbar from 'components/Navbar';
import { fetchUserDetails, fetchPartnerDetails } from 'utils/user';
import { setCookie, getCookie } from 'utils/cookies'; 


const About = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = getCookie('userId');
    setUserId(id);
  }, []); 

  useEffect(() => {
    async function loadUserDetails() {
      if (userId) {
        const data = await fetchUserDetails(userId);
        setUserDetails(data);
      }
    }
    loadUserDetails(); 
  }, [userId]);

    
    

  return (
    <div>
      <div className="page-wrap">
        <div className="outer-container">
          <div className="users">
            <div className="user-one-container">
              <div className="profile-pic">
                {/* Example: <img src={userDetails?.profilePicUrl} alt="User 1" /> */}
              </div>
              <h2>{userDetails?.name || 'USER 1'}</h2>
            </div>
            <div className="user-two-container">
              <div className="profile-pic"></div>
              <h2>USER 2</h2>
            </div>
          </div>

          <div className="stats-and-cards">
            <div className="stats">
              <div className="my-streak">
                <h4>My Streak</h4>
                <img src="/img/my-streak-fire.svg" alt="" />
                <h3>{userDetails?.streak || 0}</h3>
              </div>
              <div className="our-streak">
                <h4>Our Streak</h4>
                <img src="/img/our-streak-heart.svg" alt="" />
                <h3>{userDetails?.ourStreak || 0}</h3>
              </div>
              <div className="our-points">
                <h4>Our Points</h4>
                <img src="/img/points-star.svg" alt="" />
                <h3>{userDetails?.points || 0}</h3>
              </div>
            </div>

            <div className="cards">
              <div className="card-one"></div>
              <div className="card-two"></div>
            </div>
          </div>
        </div>
      </div>

      <Navbar />
    </div>
  );
};

export default About;

