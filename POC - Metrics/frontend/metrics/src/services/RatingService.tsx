import axios from "axios";

const API_URL = "http://localhost:8084/api/ratings";


axios.interceptors.response.use(
  (response) => {
    console.log('API Success:', response.config.method?.toUpperCase(), response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.config?.method?.toUpperCase(), error.config?.url, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const getRatings = () => {
  console.log('Fetching ratings from:', API_URL);
  return axios.get(API_URL);
};

export const addRating = (ratingData: any) => {
  console.log('Adding rating:', ratingData);
  return axios.post(API_URL, ratingData, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export const updateRating = (id: number, ratingData: any) => {
  console.log('Updating rating:', id, ratingData);
  return axios.put(`${API_URL}/${id}`, ratingData, {
    headers: {
      'Content-Type': 'application/json',
    }
  });
};

export const deleteRating = (id: number) => {
  console.log('Deleting rating:', id);
  return axios.delete(`${API_URL}/${id}`);
};