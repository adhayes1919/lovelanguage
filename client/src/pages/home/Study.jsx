import { useState, useEffect } from 'react';
import Navbar from 'components/Navbar';
import './Finish.css';
import './Start.css';
import './Study.css';
import { getCookie } from 'utils/cookies';
import { fetchPartnerDetails } from 'utils/user';
import { 
sendRequestToPartner,
fetchRequestsAssignedToMe,
submitAnswerToRequest,
fetchUserDeck,
fetchCardInfo,
deleteCardRequest,
updateCardEaseScore,
} from 'utils/deck';

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
    const [deck, setDeck] = useState([]);
    const [currentCardIndex, setCurrentCardIndex] = useState(0);

    function flipCard() {
        setCardSide(prev => (prev === 'front' ? 'back' : 'front'));
    }

    function undo() {
        flipCard();
    }

    useEffect(() => {
        async function loadDeck() {
            const userId = getCookie('userId');
            if (!userId) return;

            try {
                const fetchedDeck = await fetchUserDeck(userId);
                if (fetchedDeck) {
                    setDeck(fetchedDeck || []);
                    setCurrentCardIndex(0);
                }
            } catch (error) {
                console.error('Error fetching deck:', error);
            }
        }
        loadDeck();
    }, []);

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
                            {deck[currentCardIndex]?.txt_front || "No card available"}
                        </div>

                    <div className="flip-card-back">
                        {/* Back of Card Content */}
                        <div className="backcard-word">Translation</div>
                        <img src="/img/playrecording.svg" alt="Play Recording" className="play-audio-button" />
                        <div className="backcard-word">
                            {deck[currentCardIndex]?.txt_back || "No translation available"}
                        </div>


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
                        {showUndo && <button onClick={undo}>Undo</button>}
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
    const [requests, setRequests] = useState([]); 
    const [prevRequest, setPrevRequest] = useState(null); 
    const [numRequests, setNumRequests] = useState(0);

    useEffect(() => {
        async function loadRequests() {
            const userId = getCookie('userId');
            if (!userId) return;
            const received = await fetchRequestsAssignedToMe(userId);
            setRequests(received);
        }
        loadRequests();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userId = getCookie('userId');
        if (!userId || !front) return;

        try {
            const success = await sendRequestToPartner(userId, front.trim());
            if (success) {
                console.log('Request sent!');
                setFront('');
                setAudioFile(null);
                setImageFile(null);
                // Reload requested cards
                const updatedRequests = await fetchRequestsAssignedToMe(userId);
                setRequests(updatedRequests);
                setNumRequests(numRequests + 1);
                setPrevRequest(front.trim());
            } else {
                console.error('Failed to send request');
            }
        } catch (error) {
            console.error(error);
        }
    };

    async function handleUnsend() {
        const userId = getCookie('userId');
        if (!userId || !prevRequest) return;

        try {
            const success = await deleteCardRequest(userId, prevRequest);
            if (success) {
                console.log('Request unsent!');
                // Update UI accordingly
                const updatedRequests = await fetchRequestsAssignedToMe(userId);
                setRequests(updatedRequests);
                setNumRequests(numRequests - 1);
                setPrevRequest(''); // clear the prevRequest after unsending
            } else {
                console.error('Failed to unsend request');
            }
        } catch (error) {
            console.error('Error unsending request:', error);
        }
    }


    return (
        <div className="start-card-row">
            {/* Left side: requested card */}
        <div className="requestedcard-container">
              <div className="requestedcard-inner">
                {numRequests > 0 ? (
                <div>
                  <div>
                    <span className="requestedcard-text"> 
                      You've sent {numRequests} {numRequests === 1 ? 'request' : 'requests'} to {partner}
                    </span>
                    </div>
                    <div>
                    <span className="requestedcard-text">
                      Last request: {prevRequest}
                    </span>
                  </div>
                </div>
                ) : (
                  <span className="requestedcard-text"> 
                    No requests yet
                  </span>
                )}
              </div>
                <button onClick={handleUnsend} className="startcard-unsend-button">Unsend</button>
            </div>


            {/* Right side: start card */}
            <div className="startcard-container">
                <form onSubmit={handleSubmit} className="startcard-inner" style={{ width: '100%' }}>
                    <div className="startcard-header">How do you say...</div>
                    <input
                        type="text"
                        className="startcard-textarea"
                        placeholder="Word"
                        required
                        value={front}
                        onChange={(e) => setFront(e.target.value)}
                    />
                    <div className="startcard-footer">in your language?</div>

                    {/* Send Button (inside form!) */}
                    <button type="submit" className="startcard-send-button">Send</button>

                    <div className='bottom-container'>
                        <div className="startcard-partner">{partner}</div>
                        <div className="startcard-badge"></div>
                    </div>
                </form>
            </div>
        </div>
    );
};



const FinishCard = ({ partner }) => {
    const [cards, setCards] = useState([]); // <-- ADD THIS
    const [currentCard, setCurrentCard] = useState(null);
    const [back, setBack] = useState('');
    const [audioFile, setAudioFile] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [previousWord, setPreviousWord] = useState("Cards you've translated show up here");
    const [cardsRemaining, setCardsRemaining] = useState(null);

    useEffect(() => {
        async function loadCards() {
            const userId = getCookie('userId');
            if (!userId) return;

            try {
                const receivedCards = await fetchRequestsAssignedToMe(userId);
                setCards(receivedCards);
                if (receivedCards.length > 0) {
                    setCurrentCard(receivedCards[0].txt_request);
                    setCardsRemaining(receivedCards.length);
                }
            } catch (error) {
                console.error(error);
            }
        }
        loadCards();
    }, []);

        const handleSubmit = async (e) => {
            e.preventDefault();
          const userId = getCookie('userId');
          if (!userId || !currentCard) return;

          // Validate input
          if (!back.trim() && !audioFile) {
            //alert('Please enter text or upload audio!');
            return;
          }

          const success = await submitFinishedCard(userId, currentCard, back);
          if (success) {
            console.log('Card submitted!');

            setPreviousWord(currentCard);
            setBack('');
            setAudioFile(null);

            const nextCards = cards.slice(1);
            setCards(nextCards);
            setCardsRemaining(nextCards.length);
            setCurrentCard(nextCards.length > 0 ? nextCards[0].txt_request : null);
        } else {
        console.error('Failed to submit card');
        }
    };

    return (
        <div className='card-row'>
            <div className="finishcard-container">
                <div className="finishcard-badge"></div>
                <div className="finishcard-partner">{partner}</div>
                <div className="finishcard-inner">
                    <div className="finishcard-word"> {currentCard} </div>
                    { cardsRemaining > 0 ? ( 
                    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
                        <textarea
                          className="finishcard-textarea"
                          placeholder="Type your answer here..."
                          value={back}
                          onChange={(e) => setBack(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleSubmit(e);
                            }
                          }}
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
                    </form> ) : <div className="finishcard-word"> no more cards</div> } 


                </div>
            </div>

            <div className="translatedcard-container">
                <div className="translatedcard-inner">
                    <span className="translatedcard-text"> {previousWord} </span>
                </div>
            </div>
        </div>
    );
};

const Study = () => {
    const [activeView, setActiveView] = useState(null);

    const handleStartClick = () => setActiveView('start');
    const handleFinishClick = () => setActiveView('finish');
    const handleCurrentClick = () => setActiveView('current');
    const handleBackClick = () => setActiveView(null);

    const [partnerName, setPartnerName] = useState('');
    useEffect(() => {
        async function loadPartner() {
            const id = getCookie('userId');
            if (id) {
                const result = await fetchPartnerDetails(id);
                if (result?.partnerDetails?.name) {
                    setPartnerName(result.partnerDetails.name);
                }
            }
        }
        loadPartner();
    }, []);


    return (
        <div className='study-page'>
            {activeView && (
                <button className="back-button" onClick={handleBackClick}>
                    <img src="/img/return.svg" alt="Back" />
                </button>
            )}
            {!activeView && (
                <div className="study-buttons">
                    <div className="study-button" onClick={handleCurrentClick}>
                        <div >
                            <p className="user1-points">00000</p>
                            <img src="img/points-star.svg" alt="" />
                        </div>
                        <h2>Study</h2>
                    </div>
                    <div className="side-cards">
                        <div className="finish-button" onClick={handleFinishClick}>
                            <h3> {partnerName}'s Cards</h3>
                        </div>
                        <div className="start-button" onClick={handleStartClick}>
                            <h3>My Cards</h3>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'start' && <StartCard partner={partnerName} />}
            {activeView === 'finish' && <FinishCard />}
            {activeView === 'current' && <CurrentCards />}
        </div>
    );
};

export default Study;
