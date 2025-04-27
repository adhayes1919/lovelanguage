export async function deck_upsertCardBack(user_id, txt_front, txt_back) {
	const response = await fetch('http://localhost:5000/api/deck/upsert-card-back', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user_id, txt_front, txt_back })
	});
	return response.ok;
}

export async function deck_updateCardEase(user_id, txt_front, score) {
	const response = await fetch('http://localhost:5000/api/deck/update-card-ease', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user_id, txt_front, score })
	});
	return response.ok;
}

export async function deck_requestCard(userA_id, txt_request) {
	const response = await fetch('http://localhost:5000/api/deck/request-card', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ userA_id, txt_request })
	});
	return response.ok;
}

export async function deck_getRequestsReceived(user_id) {
	const response = await fetch('http://localhost:5000/api/deck/requests-received', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user_id })
	});
	const data = await response.json();
	return data;
}

export async function deck_getFullDeck(user_id) {
	const response = await fetch('http://localhost:5000/api/deck/full-deck', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user_id })
	});
	const data = await response.json();
	return data;
}

export async function deck_getCardInfo(user_id, txt_front) {
	const response = await fetch('http://localhost:5000/api/deck/card-info', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ user_id, txt_front })
	});
	const data = await response.json();
	return data;
}

