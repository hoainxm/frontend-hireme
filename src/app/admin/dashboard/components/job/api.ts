/** @format */
import axios from 'axios';

// Base API URL
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api/v1`;

// Fetch all jobs
export const fetchAllJobs = async (): Promise<any[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobs`);
    return response.data;
  } catch (error) {
    console.error('Error fetching jobs:', error);
    throw error;
  }
};

// Fetch a single job by ID
export const fetchJobById = async (id: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/jobs/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching job with ID ${id}:`, error);
    throw error;
  }
};

// Create a new job
export const createJob = async (jobData: { name: string; salary: number; location: string; skills: string; company: string }): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/jobs`, jobData);
    return response.data;
  } catch (error) {
    console.error('Error creating job:', error);
    throw error;
  }
};

// Update an existing job
export const updateJob = async (
  id: string,
  jobData: {
    name: string;
    salary: number;
    location: string;
    skills: string;
    company: string;
  }
): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/jobs/${id}`, jobData);
    return response.data;
  } catch (error) {
    console.error(`Error updating job with ID ${id}:`, error);
    throw error;
  }
};

// Delete a job
export const deleteJob = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/jobs/${id}`);
  } catch (error) {
    console.error(`Error deleting job with ID ${id}:`, error);
    throw error;
  }
};
