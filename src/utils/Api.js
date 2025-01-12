import axios from 'axios';

const API_URL = 'https://backend-s1x4.onrender.com';

export const handleSubmit = async (formData, partType) => {
  const filteredData = {};

  if (formData.name) filteredData.name = formData.name;
  if (formData.brand) filteredData.brand = formData.brand;

  
  if (partType === 'cpus') {
    if (formData.cores) filteredData.cores = formData.cores;
  } else if (partType === 'gpus') {
    if (formData.memory) filteredData.memory = formData.memory;
  } else if (partType === 'rams') {
    if (formData.capacity) filteredData.capacity = formData.capacity;
    if (formData.speed) filteredData.speed = formData.speed;
  }

  // Fiyat her parça türünde bulunmalı
  if (formData.price) filteredData.price = formData.price;

  try {
    await axios.post(`${API_URL}/api/${partType}`, {
      data: filteredData,
    });
    return { success: true };
  } catch (error) {
    console.error('API hatası:', error);
    return { success: false, error: 'Parça eklenirken bir hata oluştu. Lütfen tekrar deneyin.' };
  }
};
