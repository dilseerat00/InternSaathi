import axios from 'axios';

const API_URL = 'http://localhost:3000/api/upload/';

// Helper function to get the user token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

/**
 * Uploads an image file to the backend.
 * @param {File} imageFile - The image file selected by the user.
 * @returns {Promise<string>} A promise that resolves to the secure URL of the uploaded image.
 */
const uploadImage = async (imageFile) => {
  const token = getToken();
  if (!token) {
    return Promise.reject(new Error('No token found, user is not authenticated.'));
  }

  // We need to send the file as 'multipart/form-data'
  const formData = new FormData();
  formData.append('image', imageFile); // The key 'image' must match the backend upload.single('image')

  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.post(API_URL, formData, config);
    // The backend sends back an object like { imageUrl: '...' }
    return response.data.imageUrl;
  } catch (error) {
    console.error('Failed to upload image:', error.response?.data?.message || error.message);
    throw error;
  }
};

const uploadService = {
  uploadImage,
};

export default uploadService;
