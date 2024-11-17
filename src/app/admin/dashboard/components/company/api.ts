/** @format */

import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const fetchData = async (endpoint: string) => {
  const response = await axios.get(`${BASE_URL}/${endpoint}`);
  return response.data;
};

export const createData = async (endpoint: string, data: object) => {
  const response = await axios.post(`${BASE_URL}/${endpoint}`, data);
  return response.data;
};

export const updateData = async (endpoint: string, id: string, data: object) => {
  const response = await axios.put(`${BASE_URL}/${endpoint}/${id}`, data);
  return response.data;
};

export const deleteData = async (endpoint: string, id: string) => {
  const response = await axios.delete(`${BASE_URL}/${endpoint}/${id}`);
  return response.data;
};
