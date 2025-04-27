export const AddPartner = () => {
    const Temp = (e) => {
        e.preventDefault();
    }
    
    return (
        <div>
            <span> your code is </span>
            <form onSubmit={Temp} > 
                <input type="text" placeholder="enter partner code" />
                <button type="submit"> submit </button>
            </form>
        </div>
    )

}
