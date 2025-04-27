export async function fetchUserDetails() {
      try {
        const response = await fetch('/api/user-getDetails', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user_id: userId }),
        });
        if (!response.ok) throw new Error('Failed to fetch user details');
        const data = await response.json();
        setUserDetails(data);
      } catch (error) {
        console.error(error);
      }
}

app.post("/api/user_getPartner", async (req, res) => {
	const { user_id } = req.body;

	try {
		// Fetch partner details for the user
		const partnerDetails = await user-getPartner(db, user_id);

		if (partnerDetails.error) {
			// Send an error response if there's an issue
			res.status(404).json({ message: partnerDetails.error });
		} else {
			// Send partner details if found
			res.status(200).json(partnerDetails);
		}
	} catch (error) {
		console.error('Error in /getPartner:', error);
		res.status(500).send('Server error');
	}
});
