import axios from 'axios';

const userService = {
  // Create a new user
  create: async (userData) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage (or cookies/sessionStorage)

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await axios.post(
        'http://localhost:8000/api/users/',  // Change to your correct API endpoint
        userData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      return response.data;  // Assuming the response contains the created user data
    } catch (error) {
      console.error("Error saving user:", error);
      throw new Error("Failed to save user.");
    }
  },

  // Fetch all users
  getAll: async () => {
    const token = localStorage.getItem('authToken'); // Retrieve token from localStorage

    if (!token) {
      throw new Error("No authentication token found");
    }

    try {
      const response = await axios.get('http://localhost:8000/api/users/', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.data;  // Assuming the response contains the list of users
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Failed to fetch users.");
    }
  },
};

export { userService };
