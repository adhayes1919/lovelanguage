import './Home.css';

//both couplepair and pair friends


export const AddPartner = () => {
    const Temp = (e) => {
        e.preventDefault();
    }
    
    return (
        <div>
            <span> your code is 1234  </span>
            <form onSubmit={Temp} > 
                <input type="text" placeholder="enter partner code" />
                <button type="submit"> submit </button>
            </form>
        </div>
    )

}

export const AddCouple = () => {
    return (
        <div>
        </div>
    )
}

