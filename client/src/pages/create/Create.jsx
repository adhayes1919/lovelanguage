import './Create.css';
import Navbar from 'components/Navbar';
import { useState } from 'react';


const Create = () => {
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
            </div>
                <Navbar />
        </div>
    );
};

export default Create;
