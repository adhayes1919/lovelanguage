import { useState } from 'react';
import { loginUser, registerUser } from 'utils/auth.js';
import { useNavigate } from 'react-router-dom';
import { setCookie } from 'utils/cookies'; 

const AuthForm = ({ setLoggedIn }) => {
	const [isLoginView, setIsLoginView] = useState(true);

	return (
		<div>
			{isLoginView ? (
				<Login switchToRegister={() => setIsLoginView(false)} setLoggedIn={setLoggedIn} />
			) : (
				<Register switchToLogin={() => setIsLoginView(true)} setLoggedIn={setLoggedIn} />
			)}
		</div>
	);
};

const Login = ({ switchToRegister, setLoggedIn }) => {
	const [credentials, setCredentials] = useState({ username: '', password: '' });
	const navigate = useNavigate();

	const handleChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value });
	};

	const handleLogin = async (username, password) => {
		const result = await loginUser({ username, password });
		if (result.success) {
			console.log('Login successful!');
			setCookie('userId', result.userId); 
			setLoggedIn(true);
			navigate('/'); 
		} else {
			console.error(result.message);
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await handleLogin(credentials.username, credentials.password);
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input name="username" onChange={handleChange} placeholder="Username" />
				<input name="password" type="password" onChange={handleChange} placeholder="Password" />
				<button type="submit">Login</button>
			</form>
			<p>
				Don't have an account?{' '}
				<button onClick={switchToRegister}>Register here</button>
			</p>
		</div>
	);
};

const Register = ({ switchToLogin, setLoggedIn }) => {
	const [formData, setFormData] = useState({
		name: '',
		language: '',
		username: '',
		password: '',
		confirmPassword: '',
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	const handleLogin = async (username, password) => {
		const result = await loginUser({ username, password });
		if (result.success) {
			console.log('Auto-login successful!');
			setCookie('userId', result.userId); 
			setLoggedIn(true);
			navigate('/'); 
		} else {
			console.error('Auto-login failed unexpectedly.');
			switchToLogin();
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await registerUser(formData);

		if (result.success) {
			console.log('User registered');
			await handleLogin(formData.username, formData.password);
		} else {
			alert(`Registration failed: ${result.message}`);
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<input name="username" onChange={handleChange} placeholder="Username" />
				<input name="name" onChange={handleChange} placeholder="Your name" />
				<input name="password" type="password" onChange={handleChange} placeholder="Password" />
				<input name="confirmPassword" type="password" onChange={handleChange} placeholder="Confirm Password" />
				<input name="language" onChange={handleChange} placeholder="Language" />
				<button type="submit">Register</button>
			</form>
			<p>
				Already have an account?{' '}
				<button onClick={switchToLogin}>Login here</button>
			</p>
		</div>
	);
};

export default AuthForm;

