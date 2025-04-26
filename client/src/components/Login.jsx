import { useState, useEffect } from "react";
import { loginUser } from "utils/auth/auth.js"; 

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) => {
    setCredentials({...credentials, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await loginUser(credentials);

    if (result.success) {
      console.log('Login successful!');
      // Set auth token, redirect, etc.
    } else {
      console.error(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="username" onChange={handleChange} placeholder="Username" />
      <input name="password" type="password" onChange={handleChange} placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
