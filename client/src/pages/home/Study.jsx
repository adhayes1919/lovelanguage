import { useState } from 'react';
// import Navbar from 'components/Navbar';
import {Link } from 'react-router-dom'
import './Finish.css';
import './Start.css';
import './Study.css';

// SM-2 algorithm for spaced repetition
function calculateEase(currentEF, quality) {
    const newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    return Math.max(newEF, 1.3);
}

const FEEDBACK = {
    AGAIN: 1,
    HARD: 2,
    GOOD: 3,
    EASY: 4,
};

const CurrentCards = () => {
    const [showUndo, setShowUndo] = useState(false);
    const [cardSide, setCardSide] = useState('front');

    function flipCard() {
        setCardSide(prev => (prev === 'front' ? 'back' : 'front'));
    }

    function undo() {
        flipCard();
    }

    const handleFeedback = (feedbackValue) => {
        if (!showUndo) setShowUndo(true);

        flipCard();

        const easeFactor = 2.5; // TODO: initialize per card
        const newEase = calculateEase(easeFactor, feedbackValue);
        console.log(`new ease factor = ${newEase}`);
    };

    return (
        <div className="flip-card-wrapper">
            <div className={`flip-card ${cardSide === 'back' ? 'flipped' : ''}`}>
                <div className="flip-card-inner">
                    <div className="flip-card-front" onClick={flipCard}>
                        {/* Front of Card Content */}
                        <div className="frontcard-word">Your Word</div>
                    </div>

                    <div className="flip-card-back">
                        {/* Back of Card Content */}
                        <div className="backcard-word">Translation</div>
                        <img src="/img/playrecording.svg" alt="Play Recording" className="play-audio-button" />

                    </div>
                </div>
            </div>

            {/* Conditional Rendering Below */}
            <div className='studybar'>
                {cardSide === 'front' && (
                    <div className="frontcard-progress-text">1/10</div>
                )}

                {cardSide === 'back' && (
                    <div className="feedbackButtons">
                        <img src="img/Reaction1.svg" onClick={() => handleFeedback(FEEDBACK.AGAIN)}/>
                        <img src="img/Reaction2.svg" onClick={() => handleFeedback(FEEDBACK.HARD)}/>
                        <img src="img/Reaction3.svg" onClick={() => handleFeedback(FEEDBACK.GOOD)}/>
                        <img src="img/Reaction4.svg" onClick={() => handleFeedback(FEEDBACK.EASY)}/>
                        {/* {showUndo && <button onClick={undo}>Undo</button>} */}
                    </div>
                )}
            </div>
        </div>
    );

};

const StartCard = ({ partner }) => {
    const [front, setFront] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: send to DB
        setFront('');
        setAudioFile(null);
        setImageFile(null);
    };

    return (
        <div className="start-card-row">
            {/* Left side: requested card */}
            <div className="requestedcard-container">
                <div className="requestedcard-inner">
                    <span className="requestedcard-text">Your requested cards show up here</span>
                </div>
                <button className="startcard-unsend-button">Unsend</button>
            </div>

            {/* Right side: start card */}
            <div className="startcard-container">
                <div className="startcard-inner">
                    <div className="startcard-header">How do you say...</div>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <input
                            type="text"
                            className="startcard-textarea"
                            placeholder="Word"
                            required
                            value={front}
                            onChange={(e) => setFront(e.target.value)}
                        />
                    </form>
                    <div className="startcard-footer">in your language?</div>
                </div>
                {/* Send and Unsend Buttons floating */}
                <button type="submit" className="startcard-send-button">Send</button>

                <div className='bottom-container'>
                    <div className="startcard-partner">{partner}</div>

                    <div className="startcard-badge"></div>
                </div>
            </div>
        </div>

    );
};

const FinishCard = ({ partner }) => {
    const phrasesToComplete = ['first', 'second']; // TODO: DB query
    const currentPhrase = phrasesToComplete?.[0] || '';
    const cardsToFinish = phrasesToComplete.length;

    const [back, setBack] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        // TODO: send to DB
    };

    return (
        <div className='card-row'>
            <div className="finishcard-container">
                <div className="finishcard-badge"></div>
                <div className="finishcard-partner">{partner}</div>
                <div className="finishcard-inner">
                    <div className="finishcard-word">{currentPhrase}</div>
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <textarea
                            className="finishcard-textarea"
                            placeholder="Type your answer here..."
                            value={back}
                            onChange={(e) => setBack(e.target.value)}
                        />
                        <div className="voice">
                            <label className="file-upload">
                                <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
                                <img src="/img/record.svg" alt="Record Audio" />
                            </label>
                            <label className="file-upload">
                                <input type="file" accept="audio/*" onChange={(e) => setAudioFile(e.target.files[0])} />
                                <img src="/img/record.svg" alt="Play Audio" />
                            </label>
                        </div>
                        <button type="submit" className="finishcard-submit">
                            Answer
                        </button>
                    </form>
                </div>
            </div>

            <div className="translatedcard-container">
                <div className="translatedcard-inner">
                    <span className="translatedcard-text">Cards you translated show up here</span>
                </div>
            </div>
        </div>
    );
};

const Study = ({setNavbarHidden}) => {
    const partner = 'partners-name'; // TODO: DB query
    const [activeView, setActiveView] = useState(null);

    const handleStartClick = () => {
        setActiveView('start');
        if (setNavbarHidden) setNavbarHidden(false);
      };
      const handleFinishClick = () => {
        setActiveView('finish');
        if (setNavbarHidden) setNavbarHidden(false);
      };
      const handleCurrentClick = () => {
        setActiveView('current');
        if (setNavbarHidden) setNavbarHidden(true);  // Hide navbar when 'current'
      };
      const handleBackClick = () => {
        setActiveView(null);
        if (setNavbarHidden) setNavbarHidden(false);
      };

    return (
        <div className='study-page'>
            {activeView && (
                <button className="back-button" onClick={handleBackClick}>
                    <img src="/img/return.svg" alt="Back" />
                </button>
            )}
            {!activeView && (
                <div className="study-buttons">
                    <div className="top-container-icons">
                        <Link to="/settings">
                            <img
                                src='img/setting.svg'
                                alt="Leaderboard"
                                className="settings-icon"
                            />
                        </Link>

                        <div className="streak-top-container" id="my">
                            <img src="img/my-streak-fire.svg" alt="" />
                            <p>1</p>
                        </div>

                        <div className="streak-top-container">
                            <img src="img/our-streak-heart.svg" alt="" />
                            <p>1</p>
                        </div>
                    </div>

                    <div className="study-button" onClick={handleCurrentClick}>
                        <div >
                            <p className="user1-points">000</p>
                            <img src="img/points-star.svg" alt="" />
                        </div>
                        <h2>Study</h2>
                    </div>
                    <div className="side-cards">
                        <div className="finish-button" onClick={handleFinishClick}>
                            <h3>USER2's Cards</h3>
                        </div>
                        <div className="start-button" onClick={handleStartClick}>
                            <h3>My Cards</h3>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'start' && <StartCard partner={partner} />}
            {activeView === 'finish' && <FinishCard partner={partner} />}
            {activeView === 'current' && <CurrentCards />}
        </div>
    );
};

export default Study;
