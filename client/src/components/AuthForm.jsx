import './AuthForm.css'
import { useState } from 'react';
import { loginUser, registerUser } from 'utils/auth.js';
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
	<div className="auth-page-wrap">
		<div className="auth-main-container">
			<div className="auth-name-and-form">
					<h1 className="auth-h1" id="h1-login">Welcome Back</h1>
				<form className="auth-form" id="form-login" onSubmit={handleSubmit}>
					<input name="username" onChange={handleChange} placeholder="Username" />
					<input name="password" type="password" onChange={handleChange} placeholder="Password" />
				</form>
				<button className="auth-CTA-button">Log In</button>
			</div>
			<div className="auth-bottom-text">
				<p>Doesn't have an account?</p>
				<p id="switch-page" onClick={switchToRegister} >Register Here</p>
			</div>
	</div>

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


		<div className="auth-bottom-text" id="text-bottom-register">
				<p>Already have an account?</p>
				<p id="switch-page" onClick={switchToLogin} >Log In Here</p>
		</div>
	</div>

</div>
	);
};

export default AuthForm;
