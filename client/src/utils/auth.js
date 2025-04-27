import { setCookie } from 'utils/cookies'; // ✅ import your new utility

export async function registerUser(userData) {
	const response = await fetch('/api/auth/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(userData),
	});

	const data = await response.json();
	return data; // we don't set a cookie on registration, because we want to login afterward
}

export async function loginUser(userData) {
	const response = await fetch('/api/auth/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(userData),
	});

	const data = await response.json();
	if (data.success) {
		console.log('Login success, setting cookie!');
		setCookie('userId', data.userId); // ✅ now using your setCookie()
	}

	return data;
}

