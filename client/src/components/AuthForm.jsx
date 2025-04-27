import { useState } from 'react';
import { loginUser, registerUser } from 'utils/auth/auth.js';
import { useNavigate } from 'react-router-dom'; 

const AuthForm = () => {
	const [isLoginView, setIsLoginView] = useState(true);

	return (
		<div>
			{isLoginView ? (
				<Login switchToRegister={() => setIsLoginView(false)} />
			) : (
				<Register switchToLogin={() => setIsLoginView(true)} />
			)}
		</div>
	);
};

const Login = ({ switchToRegister }) => {
	const [credentials, setCredentials] = useState({
		username: '',
		password: ''
	});
	const navigate = useNavigate();

	const handleChange = (e) => {
		setCredentials({ ...credentials, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await loginUser(credentials);

		if (result.success) {
			console.log('Login successful!');
			navigate('/'); // Redirect after login if you want
		} else {
			console.error(result.message);
		}
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

const Register = ({ switchToLogin }) => {
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

	const handleSubmit = async (e) => {
		e.preventDefault();
		const result = await registerUser(formData);

		if (result.success) {
			console.log('User registered');
			const loginResult = await loginUser({ username: formData.username, password: formData.password });

			if (loginResult.success) {
				console.log('Auto-login successful!');
				navigate('/'); // Redirect after auto-login
			} else {
				console.error('Auto-login failed unexpectedly.');
				switchToLogin(); // Go back to login manually
			}
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

