import axios from 'axios';

const API_URL = 'http://localhost:3000/api/companies/';

// Helper function to get the user token from local storage
const getToken = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user ? user.token : null;
};

/**
 * Fetches companies from the backend with optional filtering.
 * @param {object} [filterParams] - An object containing filter criteria.
 * @param {string} [filterParams.keyword] - Search by company name or description.
 * @returns {Promise<Array>} A promise that resolves to an array of company objects.
 */
const getCompanies = async (filterParams = {}) => {
  const token = getToken();
  if (!token) {
    return Promise.reject(new Error('No token found, user is not authenticated.'));
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    // Axios will automatically convert this to a URL query string
    // e.g., /api/companies?keyword=Tech
    params: filterParams,
  };

  try {
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch companies:', error.response?.data?.message || error.message);
    throw error;
  }
};

const companyService = {
  getCompanies,
};

export default companyService;
