export async function addPoints(user_id, count) {
	const response = await fetch('http://localhost:5000/api/scoring/add-points', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user_id, count })
	});
	return response.ok;
}

export async function incrementStreak(user_id) {
	const response = await fetch('http://localhost:5000/api/scoring/increment-streak', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user_id })
	});
	return response.ok;
}

export async function getLeaderboard(mode, limit) {
	const response = await fetch('http://localhost:5000/api/leaderboard', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ mode, limit })
	});
	const data = await response.json();
	return data;
}

