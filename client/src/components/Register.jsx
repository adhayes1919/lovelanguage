import { useState, useEffect } from "react";

const Register = () => {
    const [name, setName] = useState('');
    const [language, setLanguage] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const handleSubmitRegister = () => {
        //TODO: handle api component here
    }

    return (
        <div>
            <form onSubmit={handleSubmitRegister}> 
                <input type="text" placeholder = "username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <input type="text" placeholder = "name"
                    onChange={(e) => setName(e.target.value)}
                />
                <input type="text" placeholder = "language"
                    onChange={(e) => setLanguage(e.target.value)}
                />
                <input type="password" placeholder = "password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input type="password" placeholder = "confirm password"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="submit"> register </button>
            </form>
        </div>
    )
}

export default Register;
