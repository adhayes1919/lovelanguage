import { useState, useEffect } from "react";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmitLogin = () => {}
    return (
        <div>
            <form onSubmit={handleSubmitLogin}> 
                <input type="text" placeholder = "username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input type="password" placeholder = "password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit"> log in </button>
            </form>
        </div>
    )
}

export default Login;
