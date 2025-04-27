import React, { useState, useEffect } from 'react';
import './About.css';
import Navbar from 'components/Navbar';

const About = () => {
  const [userDetails, setUserDetails] = useState(null);
  const userId = '680d86b77788138e202e9956'; // Replace with actual logged-in user's ID or prop/context

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const response = await fetch('http//localhost/10.135.168.95:5000/api/user_getDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
        if (!response.ok) throw new Error('Failed to fetch user details');
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
    }

    if (userId) fetchUserDetails();
  }, [userId]);

  // If userDetails is not loaded yet, optionally show loading spinner or placeholder
  if (!userDetails) return <div>Loading...</div>;

  return (
    <div>
      <div className="page-wrap">
        <div className="outer-container">
          <div className="users">
            <div className="user-one-container">
              <div className="profile-pic">
                {/* If your userDetails has a profile image, you can render it here */}
                {/* Example: <img src={userDetails.profilePicUrl} alt="User 1" /> */}
              </div>
              <h2>{userDetails.name || 'USER 1'}</h2>
              {/* Show more user info as needed */}
            </div>
            <div className="user-two-container">
              {/* Example: If you want a second user */}
              <div className="profile-pic"></div>
              <h2>USER 2</h2>
            </div>
          </div>
          <div className="stats-and-cards">
            <div className="stats">
              <div className="my-streak">
                <h4>My Streak</h4>
                <img src="/img/my-streak-fire.svg" alt="" />
                <h3>{userDetails.streak || 0}</h3>
              </div>
              <div className="our-streak">
                <h4>Our Streak</h4>
                <img src="/img/our-streak-heart.svg" alt="" />
                <h3>{userDetails.ourStreak || 0}</h3>
              </div>
              <div className="our-points">
                <h4>Our Points</h4>
                <img src="/img/points-star.svg" alt="" />
                <h3>{userDetails.points || 0}</h3>
              </div>
            </div>
            <div className="cards">
              <div className="card-one"> </div>
              <div className="card-two"> </div>
            </div>
          </div>
        </div>
      </div>
      <Navbar />
    </div>
  );
};

export default About;
