import axios from 'axios';

const API_BASE_URL = '/api/public';

export const getServices = async () => {
  const res = await axios.get(`${API_BASE_URL}/services`);
  return res.data;
};

export const getPackages = async () => {
  const res = await axios.get(`${API_BASE_URL}/packages`);
  return res.data;
};

export const createBooking = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/bookings`, data);
  return res.data;
};

export const getFeedbacks = async () => {
  const res = await axios.get(`${API_BASE_URL}/feedbacks`);
  return res.data;
};

export const createConsultation = async (data) => {
  const res = await axios.post(`${API_BASE_URL}/consultation`, data);
  return res.data;
};
