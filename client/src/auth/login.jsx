import { useState, useEffect } from "react";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    
    return (
        <div>
            <form> 
                <input type="text" placeholder = "username"/>
                <input type="password" placeholder = "password"/>
                <button type="submit"> </button>
            </form>
        </div>
    )
}

export default Login;
