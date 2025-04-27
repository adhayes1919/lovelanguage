import './Navbar.css'
import { useState } from 'react';
import { loginUser, registerUser } from 'utils/auth.js';
import { useNavigate } from 'react-router-dom';

const AuthForm = () => {
	const [isLoginView, setIsLoginView] = useState(false);

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
				<input name="name" onChange={handleChange} placeholder="Your name" />
				<input name="password" type="password" onChange={handleChange} placeholder="Password" />
				<input name="confirmPassword" type="password" onChange={handleChange} placeholder="Confirm Password" />
				<input name="language" onChange={handleChange} placeholder="Language" />
				<button type="submit">Register</button>
			</form>
			<p>
				Already have an account?{' '}
				<button onClick={switchToRegister}>Login here</button>
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
<div className="auth-page-wrap">
	<div className="auth-main-container">
		<div className="auth-name-and-form">
			<h1 className="auth-h1" >Sign Up</h1>
			<form className="auth-form" onSubmit={handleSubmit}>
				<input name="name" onChange={handleChange} placeholder="Your Name" />
				<input name="username" onChange={handleChange} placeholder="Username" />
				<input name="password" type="password" onChange={handleChange} placeholder="Password" />
			</form>
			<button className="auth-CTA-button">Register</button>
		</div>


		<div className="auth-bottom-text">
				<p>Already have an account?</p>
				<p id="go-to-logIn" onClick={switchToLogin} >Log In Here</p>
		</div>
	</div>

</div>
	);
};

export default AuthForm;
