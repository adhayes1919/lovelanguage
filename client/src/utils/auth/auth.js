
export async function registerUser(userData) {
  const response = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
    
  const data = await response.json();
  return data;
}

export async function loginUser(userData) {
    const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
    });

    const data = await response.json();
    if (data.success) {
        document.cookie = `username=${userData.username}; path=/;`;  
        window.location.reload(); 
    }

    return data;
}

