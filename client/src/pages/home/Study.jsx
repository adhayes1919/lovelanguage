import Navbar from 'components/Navbar';
import { useState } from 'react';


//where currentEF is the existing ease factor
//based of SM-2 ease factor for spaced repetition

function calculateEase(currentEF, quality) {
  const newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  return Math.max(newEF, 1.3);
}

const FEEDBACK = {
    AGAIN : 1,
    HARD : 2,
    GOOD : 3,
    EASY : 4,
}


const CurrentCards = () => {
    const handleFeedback = (feedbackValue) => {
        let easeFactor = 2.5; //TODO: initialize this for each card
        let newEase = calculateEase(easeFactor, feedbackValue);
        console.log(`new ease factor = ${newEase}`);
        //TODO: put this somewhere
    }

    return (
        <div>
            <span> your word </span> 
            <button> listen (if applicable) </button>
            <div className="feedbackButtons">
                <span> Rate this card </span>
                <button onClick={() => handleFeedback(FEEDBACK.AGAIN)}> 1: Again </button>
                <button onClick={() => handleFeedback(FEEDBACK.HARD)}> 2: Hard </button>
                <button onClick={() => handleFeedback(FEEDBACK.GOOD)}> 3: Good </button>
                <button onClick={() => handleFeedback(FEEDBACK.EASY)}> 4: Easy </button>
            </div>
        </div>
    )
}

const Study = () => {
    const partner = "partners-name"; //TODO: DB query

    const [showStart, setShowStart] = useState(false);
    const [showFinish, setShowFinish] = useState(false);

    const handleStartClick = () => {
        if (showFinish) {
            setShowFinish(false)
        }
        setShowStart(true);
    }

    const handleFinishClick = () => {
        if (showStart) {
            setShowStart(false)
        }
        setShowFinish(true);
    }

    const StartCard = () => {
        const [front, setFront] = useState('');
        const [audioFile, setAudioFile] = useState(null);
        const [image, setImage] = useState(null);
        
        const handleSubmit = (e) => {
            e.preventDefault();
            //TODO: actually send to db lmao
            setFront('');
            setAudioFile(null);
            setImage(null);
        }
        return (
                        //TODO: make sure DB can handle varying audio/images
                        //TODO: "record?" option
                        //autofill "partner" with partners name
            <div>
                <form onSubmit= {handleSubmit} >
                    <div>
                        <input type="text" 
                        placeholder ="front" required 
                        onChange={(e) => setFront(e.target.value)} 
                    />
                    </div>
                    <div>
                        Attach audio?  
                        <input type="file" 
                            accept="audio/*"
                            onChange={(e) => setAudioFile(e.target.files[0])}
                        />
                    </div>
                    <div>
                        Attach image?
                        <input type="file" 
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>
                    <button type="submit"> send to {partner} </button>
                </form>
            </div>
        )
    }

    const FinishCard = () => {

        let phrasesToComplete = ["first", "second"]; //TODO: DB query (get list of words)
        let currentPhrase;
        let cardsToFinish;
        if (phrasesToComplete){
            currentPhrase = phrasesToComplete[0]; 
            cardsToFinish = phrasesToComplete.length; //TODO: DB query
        }

        const [back, setBack] = useState('');
        const [audioFile, setAudioFile] = useState(null);
        const [image, setImageFile] = useState(null);

        const handleSubmit = (e) =>  {
            e.preventDefault();
            //TODO: database again lmao
        }
        //TODO: load word/image/audio from DB
        return (
            <div>
                <div>
                    <span> you have {cardsToFinish} cards to finish from {partner} </span>
                </div>

                <span> Current word: {currentPhrase} </span>
                <form onSubmit = {handleSubmit}>
                    <div>
                        <textarea onChange={(e)=> setBack(e.target.value)} />
                    </div>
                    <div>
                        Attach audio?  
                        <input type="file" 
                            accept="audio/*"
                            onChange={(e) => setAudioFile(e.target.files[0])}
                        />
                    </div>
                    <div>
                        Attach image?
                        <input type="file" accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>
                    <button type="submit"> return to {partner} </button>
                </form>
            </div>
        )
    }

    return (
        <div>
            Create page
            <div>
                <button onClick = {handleStartClick}> send cards </button>
                <button onClick = {handleFinishClick}> load partner's cards </button>
                {showStart && <StartCard /> }
                {showFinish && <FinishCard /> }
                <CurrentCards />
            </div>
                <Navbar />
        </div>
    );
};

export default Study;
