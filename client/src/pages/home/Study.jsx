import { useState } from 'react';
import Navbar from 'components/Navbar';
import './Finish.css';

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
        <div>
            <span>your word</span>
            <button>Listen</button> {/* TODO: hook up audio */}

            <button onClick={flipCard}>
                {cardSide === 'front' ? 'Front of card' : 'Back of card'}
            </button>

            {cardSide === 'back' && (
                <div className="feedbackButtons">
                    <span>Rate this card</span>
                    <button onClick={() => handleFeedback(FEEDBACK.AGAIN)}>1: Again</button>
                    <button onClick={() => handleFeedback(FEEDBACK.HARD)}>2: Hard</button>
                    <button onClick={() => handleFeedback(FEEDBACK.GOOD)}>3: Good</button>
                    <button onClick={() => handleFeedback(FEEDBACK.EASY)}>4: Easy</button>
                    {showUndo && <button onClick={undo}>Undo</button>}
                </div>
            )}
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
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="text"
                    placeholder="Front"
                    required
                    value={front}
                    onChange={(e) => setFront(e.target.value)}
                />
            </div>
            <div>
                Attach audio?
                <input
                    type="file"
                    accept="audio/*"
                    onChange={(e) => setAudioFile(e.target.files[0])}
                />
            </div>
            <div>
                Attach image?
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files[0])}
                />
            </div>
            <button type="submit">Send to {partner}</button>
        </form>
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

const Study = () => {
    const partner = 'partners-name'; // TODO: DB query
    const [activeView, setActiveView] = useState(null);

    const handleStartClick = () => setActiveView('start');
    const handleFinishClick = () => setActiveView('finish');
    const handleCurrentClick = () => setActiveView('current');
    const handleBackClick = () => setActiveView(null);

    return (
        <div className='study-page'>
            {activeView && (
                <button className="back-button" onClick={handleBackClick}>
                    <img src="/img/return.svg" alt="Back" />
                </button>
            )}
            {!activeView && (
                <div className="study-buttons">
                    <button className="study-button" onClick={handleStartClick}>Start</button>
                    <button className="finish-button" onClick={handleFinishClick}>Finish</button>
                    <button className="study-button" onClick={handleCurrentClick}>Current Cards</button>
                </div>
            )}

            {activeView === 'start' && <StartCard partner={partner} />}
            {activeView === 'finish' && <FinishCard partner={partner} />}
            {activeView === 'current' && <CurrentCards />}
        </div>
    );
};

export default Study;

