import { useState } from 'react';
import { userService } from '../services/api'; // Ensure this path is correct

const useUsersModals = () => {
  const [showUserModal, setShowUserModal] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    password2: '',
  });
  const [selectedUser, setSelectedUser] = useState(null);

  // Open the Add User modal
  const handleAddUserModal = () => {
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      password2: '',
    });
    setSelectedUser(null); // Reset selected user when adding new user
    setShowUserModal(true);
  };

  // Open the Edit User modal and populate formData with the selected user data
  const handleEditUserModal = (user) => {
    setFormData({
      username: user.username || '',
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      password: '', // You might want to keep these empty to force the user to input a new password
      password2: '',
    });
    setSelectedUser(user); // Store the selected user for editing
    setShowUserModal(true);
  };

  // Close the modal
  const handleCloseUserModal = () => {
    setShowUserModal(false);
    setSelectedUser(null);
  };

  // Save the user data (either creating a new user or updating an existing user)
  const handleSaveUser = async () => {
    const { username, email, first_name, last_name, password, password2 } = formData;

    // Validate form data
    if (!username || !email || !first_name || !last_name || !password || !password2) {
      alert('Please fill out all fields.');
      return;
    }

    // Check if passwords match
    if (password !== password2) {
      alert('Passwords do not match.');
      return;
    }

    try {
      if (selectedUser) {
        console.log('Updating user:', formData);
        // Call your update method (to be implemented)
      } else {
        // New user, handle user creation logic (e.g., API call to save the new user)
        const newUser = {
          username,
          email,
          first_name,
          last_name,
          password,
        };

        // Call the create method in userService
        await userService.create(newUser);
        console.log('User saved:', newUser);
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Failed to save user.');
      return;
    }

    // After saving the user, refetch the user list or update the local state
    // Assuming you have a method like fetchUsers() in UserManagement component
    fetchUsers();  // Replace with your actual method to fetch users
    handleCloseUserModal();  // Close the modal after saving
  };

  return {
    showUserModal,
    formData,
    setFormData,
    handleAddUserModal,
    handleEditUserModal, // Return the handleEditUserModal function
    handleCloseUserModal,
    handleSaveUser,
  };
};

export default useUsersModals;
