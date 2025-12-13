import { createContext, useState, useContext, useCallback } from 'react';
import { sweetsAPI } from '../utils/api';

const SweetContext = createContext();

export const useSweet = () => {
  const context = useContext(SweetContext);
  if (!context) {
    throw new Error('useSweet must be used within SweetProvider');
  }
  return context;
};

export const SweetProvider = ({ children }) => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSweets = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await sweetsAPI.getAll();
      setSweets(response.data.data.sweets);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to fetch sweets';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const searchSweets = useCallback(async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      const response = await sweetsAPI.search(searchParams);
      setSweets(response.data.data.sweets);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Search failed';
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  }, []);

  const createSweet = async (sweetData) => {
    try {
      setError(null);
      const response = await sweetsAPI.create(sweetData);
      setSweets((prev) => [response.data.data.sweet, ...prev]);
      return { success: true, sweet: response.data.data.sweet };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to create sweet';
      setError(message);
      return { success: false, error: message };
    }
  };

  const updateSweet = async (id, sweetData) => {
    try {
      setError(null);
      const response = await sweetsAPI.update(id, sweetData);
      setSweets((prev) =>
        prev.map((sweet) =>
          sweet._id === id ? response.data.data.sweet : sweet
        )
      );
      return { success: true, sweet: response.data.data.sweet };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update sweet';
      setError(message);
      return { success: false, error: message };
    }
  };

  const deleteSweet = async (id) => {
    try {
      setError(null);
      await sweetsAPI.delete(id);
      setSweets((prev) => prev.filter((sweet) => sweet._id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete sweet';
      setError(message);
      return { success: false, error: message };
    }
  };

  const purchaseSweet = async (id, quantity) => {
    try {
      setError(null);
      const response = await sweetsAPI.purchase(id, quantity);
      setSweets((prev) =>
        prev.map((sweet) =>
          sweet._id === id ? response.data.data.sweet : sweet
        )
      );
      return { 
        success: true, 
        sweet: response.data.data.sweet,
        totalPrice: response.data.data.totalPrice 
      };
    } catch (err) {
      const message = err.response?.data?.message || 'Purchase failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const restockSweet = async (id, quantity) => {
    try {
      setError(null);
      const response = await sweetsAPI.restock(id, quantity);
      setSweets((prev) =>
        prev.map((sweet) =>
          sweet._id === id ? response.data.data.sweet : sweet
        )
      );
      return { success: true, sweet: response.data.data.sweet };
    } catch (err) {
      const message = err.response?.data?.message || 'Restock failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const value = {
    sweets,
    loading,
    error,
    fetchSweets,
    searchSweets,
    createSweet,
    updateSweet,
    deleteSweet,
    purchaseSweet,
    restockSweet
  };

  return <SweetContext.Provider value={value}>{children}</SweetContext.Provider>;
};
