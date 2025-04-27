export async function couple_findMatch(userA_id, searchMatchCode) {
	const response = await fetch('http://localhost:5000/api/partner/find-match', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userA_id, searchMatchCode })
	});
	return response.ok;
}

