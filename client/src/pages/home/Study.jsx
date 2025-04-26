

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


const Study = () => {
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

export default Study;
