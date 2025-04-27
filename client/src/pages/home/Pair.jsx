import React, { useState } from 'react';
//both couplepair and pair friends

export const AddPartner = () => {
  const Temp = (e) => {
    e.preventDefault();
  };

  const [isHovered, setIsHovered] = useState(false);

  // Handlers triggered by hover on heart or button
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="add-pair-page-wrap">
      <div className="top-container-icons">
        <img
          id="faded-settings"
          src="img/gray-setting.svg"
          alt="Leaderboard"
          className="settings-icon faded-icon"
        />
        <div className="streak-top-container pair-faded-icons" id="my">
          <img className="faded-icon" src="img/my-streak-fire.svg" alt="" />
          <p>0</p>
        </div>
        <div className="streak-top-container">
          <img className="faded-icon " src="img/our-streak-heart.svg" alt="" />
          <p>0</p>
        </div>
      </div>

      <div className="pair-main-container">
        <h1>Waiting for my love...</h1>
        <div className="pairing-code">
          <h2>MGF94A</h2>
        </div>

        <form onSubmit={Temp}>
          <input
            type="text"
            placeholder="Insert your partner's code"
            onKeyUp={(e) => (e.target.value = e.target.value.toUpperCase())}
          />
          <button
            className="pair-code-CTA"
            size="20"
            type="submit"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            Link up
          </button>
        </form>
      </div>

      <div className="navbar">
        <div className="nav-links">
          <img
            src="img/leaderboard-faded-icon.svg"
            alt="Leaderboard"
            className="nav-icon"
          />
          <img
            src={isHovered ? 'img/homenavbar.svg' : 'img/brokenheart.svg'}
            alt="Home"
            className="nav-icon"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{ cursor: 'pointer' }}
          />
          <img
            src="img/aboutus-faded-icon.svg"
            alt="About"
            className="nav-icon"
          />
        </div>
      </div>
    </div>
  );
};
export const AddCouple = () => {
  return <div></div>;
};
