
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8686/api/v1';

export const aiApi = {
    chat: async (prompt: string): Promise<string> => {
        const response = await axios.post(`${API_URL}/ai/chat`, { prompt });
        return response.data.response;
    }
};
