// src/services/api.js
import axios from 'axios';
import { GOLANG_API_BASE_URL } from '../config/constants';

const API_BASE_URL = GOLANG_API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL, // Corrected property name
  timeout: 45000,
});

export const fetchPosts = async () => {
  try {
    const response = await api.get('/admin/get-post');
    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error;
  }
};

export const fetchAdvertisements = async () => {
  try {
    const response = await api.get('/admin/get-advertise');
    return response.data;
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    throw error;
  }
};

export const fetchPostCategories = async () => {
  try {
    const response = await api.get('/admin/get-post-category');
    return response.data;
  } catch (error) {
    console.error('Error fetching advertisements:', error);
    throw error;
  }
};