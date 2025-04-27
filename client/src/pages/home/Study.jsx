import Navbar from 'components/Navbar';
import { useState } from 'react';

// where currentEF is the existing ease factor
// based off SM-2 ease factor for spaced repetition
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
    const [showFeedback, setShowFeedback] = useState(false);
    const [showUndo, setShowUndo] = useState(false);
    const [cardSide, setCardSide] = useState("front"); //TODO: these are temp. they will have to change based on the card

    function flipCard() {
	    setCardSide(prev => (prev === "front" ? "back" : "front"));
    }
    function undo() {
        // card = currentCard -1 
        flipCard();
    }

    const Feedback = () => {
        return (
            <div>
                <div className="feedbackButtons">
                    <span>Rate this card</span>
                    <button onClick={() => handleFeedback(FEEDBACK.AGAIN)}>1: Again</button>
                    <button onClick={() => handleFeedback(FEEDBACK.HARD)}>2: Hard</button>
                    <button onClick={() => handleFeedback(FEEDBACK.GOOD)}>3: Good</button>
                    <button onClick={() => handleFeedback(FEEDBACK.EASY)}>4: Easy</button>
                    {showUndo && <button onClick={undo}> Undo? </button>}
                </div>
            </div>
        );
    }
    
	const handleFeedback = (feedbackValue) => {
        if (!showUndo) {
            setShowUndo(true); //undo should not be visible on first card
        }
        flipCard();

		let easeFactor = 2.5; // TODO: initialize this for each card
		let newEase = calculateEase(easeFactor, feedbackValue);
		console.log(`new ease factor = ${newEase}`);
		// TODO: put this somewhere
	};

	return (
		<div>
            <button onClick={flipCard}>
                {cardSide === "front" ? "Front of card" : "back of card"}
            </button>
                {cardSide === "back" && <Feedback /> }
			<button> listen </button>
		</div>
	);
};

// Create the front side of the card ("request" from partner in your native language)
const StartCard = ({ partner }) => {
	const [front, setFront] = useState('');
	const [audioFile, setAudioFile] = useState(null);
	const [image, setImageFile] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: actually send to db
		setFront('');
		setAudioFile(null);
		setImageFile(null);
	};

	return (
		<form onSubmit={handleSubmit}>
			<div>
				<input
					type="text"
					placeholder="front"
					required
					onChange={(e) => setFront(e.target.value)}
					value={front}
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
			<button type="submit">send to {partner}</button>
		</form>
	);
};

//Create back side of card ("Return" to partner in your native language)
const FinishCard = ({ partner }) => {
	const phrasesToComplete = ["first", "second"]; // TODO: DB query
	const currentPhrase = phrasesToComplete?.[0];
	const cardsToFinish = phrasesToComplete?.length || 0;

	const [back, setBack] = useState('');
	const [audioFile, setAudioFile] = useState(null);
	const [image, setImageFile] = useState(null);

	const handleSubmit = (e) => {
		e.preventDefault();
		// TODO: database save
	};

	return (
		<div>
			<span>you have {cardsToFinish} cards to finish from {partner}</span>
			<div>
				<span>Current word: {currentPhrase}</span>
			</div>
			<form onSubmit={handleSubmit}>
				<div>
					<textarea onChange={(e) => setBack(e.target.value)} value={back} />
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
				<button type="submit">return to {partner}</button>
			</form>
		</div>
	);
};

const Study = () => {
	const partner = "partners-name"; // TODO: DB query
	const [activeView, setActiveView] = useState(null);

	const handleStartClick = () => setActiveView('start');
	const handleFinishClick = () => setActiveView('finish');
	const handleCurrentClick = () => setActiveView('current');

	return (
		<div>
			<div>
				<button onClick={handleStartClick}>Start</button>
				<button onClick={handleFinishClick}>Finish</button>
				<button onClick={handleCurrentClick}>Current Cards</button>
			</div>

			<div>
				{activeView === 'start' && <StartCard partner={partner} />}
				{activeView === 'finish' && <FinishCard partner={partner} />}
			    {activeView === 'current' && <CurrentCards />}
			</div>
		</div>
	);
};

export default Study;

