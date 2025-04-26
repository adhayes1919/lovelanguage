import { useState, useEffect } from "react";
import { registerUser } from "utils/auth/auth.js";

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        language: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const handleChange = (e) => {
        setFormData({...formData, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await registerUser(formData);
        if (result.success) {
            console.log("User registered");
        } else {
            console.error(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input name="username" onChange={handleChange} placeholder="Username" />
            <input name="name" onChange={handleChange} placeholder="Your name" />
            <input name="password" type="password" onChange={handleChange} placeholder="Password" />
            <input name="confirmPassword" type="password" onChange={handleChange} placeholder="Password" />
            <input name="language" onChange={handleChange} placeholder="Language" />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
