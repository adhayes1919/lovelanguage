// src/utils/user.js

export async function fetchUserDetails(userId) {
    try {
        const response = await fetch('/api/user-getDetails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
        });

        if (!response.ok) throw new Error('Failed to fetch user details');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export async function fetchPartnerDetails(userId) {
    try {
        const response = await fetch('/api/user-getPartner', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }),
        });

    if (!response.ok) {
        throw new Error('Failed to fetch partner details');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

