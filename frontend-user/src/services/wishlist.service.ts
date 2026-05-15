import axios from '../api/axios';

export const wishlistService = {
  getWishlist: async () => {
    const response = await axios.get('/wishlist');
    return response.data.data;
  },
  addToWishlist: async (bookId: number) => {
    const response = await axios.post(`/wishlist/add/${bookId}`);
    return response.data.data;
  },
  removeFromWishlist: async (bookId: number) => {
    const response = await axios.delete(`/wishlist/remove/${bookId}`);
    return response.data.data;
  },
  checkInWishlist: async (bookId: number) => {
    const response = await axios.get(`/wishlist/check/${bookId}`);
    return response.data.data;
  }
};
