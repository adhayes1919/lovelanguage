// src/utils/cookies.js

// Get a cookie by name
export function getCookie(name) {
	const value = `; ${document.cookie}`;
	const parts = value.split(`; ${name}=`);
	if (parts.length === 2) {
		return parts.pop().split(';').shift();
	}
	return null;
}

// Set a cookie with optional settings
export function setCookie(name, value, days = 7, options = {}) {
	let expires = "";
	if (days) {
		const date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		expires = `; expires=${date.toUTCString()}`;
	}

	let cookieString = `${name}=${value || ""}${expires}; path=/`;

	// Support Secure and SameSite settings
	if (options.secure) {
		cookieString += "; Secure";
	}
	if (options.sameSite) {
		cookieString += `; SameSite=${options.sameSite}`;
	}

	document.cookie = cookieString;
}

// Delete a cookie
export function deleteCookie(name) {
	document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

