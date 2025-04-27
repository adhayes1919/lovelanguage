// --- utils/deck.js (CLEAN VERSION) ---

import { getCookie } from './cookies';

// Send a card request to your partner
export async function sendRequestToPartner(userId, txtRequest) {
  const response = await fetch('/api/deck/request-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userA_id: userId, txt_request: txtRequest })
  });
  return response.ok;
}

// Fetch all requests assigned to the user (they must complete)
export async function fetchRequestsAssignedToMe(userId) {
  const response = await fetch('/api/deck/requests-received', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  if (!response.ok) throw new Error('Failed to fetch assigned requests');
  return await response.json();
}

// Submit a completed request
export async function submitAnswerToRequest(userId, txtFront, txtBack) {
  const response = await fetch('/api/deck/submit-card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, txt_front: txtFront, txt_back: txtBack })
  });
  return response.ok;
}

// Fetch all completed cards
export async function fetchUserDeck(userId) {
  const response = await fetch('/api/deck/full-deck', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId })
  });
  if (!response.ok) throw new Error('Failed to fetch full deck');
  return await response.json();
}

// Fetch a specific card's info
export async function fetchCardInfo(userId, txtFront) {
  const response = await fetch('/api/deck/card-info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, txt_front: txtFront })
  });
  if (!response.ok) throw new Error('Failed to fetch card info');
  return await response.json();
}

// Delete a previously sent card request
export async function deleteCardRequest(userId, txtRequest) {
  const response = await fetch('/api/deck/delete-request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, txt_request: txtRequest })
  });
  return response.ok;
}

// Update the ease score after reviewing a card
export async function updateCardEaseScore(userId, txtFront, score) {
  const response = await fetch('/api/deck/update-card-ease', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user_id: userId, txt_front: txtFront, score })
  });
  return response.ok;
}

