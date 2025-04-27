import './About.css';
import Navbar from 'components/Navbar';

const About = () => {
    return (
        <div>
            <div className="page-wrap">
                <div className="outer-container">
                    <div className="users">
                        <div className="user-one-container">
                            <div className="profile-pic"></div>
                            <h2>USER 1</h2>
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
                                <img src="img/my-streak-fire.svg" alt="" />
                                <h3>19</h3>
                            </div>
                            <div className="our-streak">
                                <h4>Our Streak</h4>
                                <img src="img/our-streak-heart.svg" alt="" />
                                <h3>19</h3>
                            </div>
                            <div className="our-points">
                                <h4>Our Points</h4>
                                <img src="img/points-star.svg" alt="" />
                                <h3>220</h3>
                            </div>

                        </div>

                        <div className="cards">
                            <div className="card-one">
                                <div className="white-container">
                                    <h1>43</h1>
                                    <img src="img/deck-of-cards-icon.svg" alt="" />
                                </div>
                                <h4>My Cards</h4>
                            </div>

                            <div className="card-two">
                            <div className="white-container">
                                    <h1>19</h1>
                                    <img src="img/deck-of-cards-icon.svg" alt="" />
                                </div>
                                <h4>Ayden's Cards</h4>
                            </div>

                        </div>
                    </div>

                </div>
        <Navbar />

            </div>
        </div>
    );
}

export default About;
