import axios from 'axios';

const API_URL = 'http://localhost:3001'; // Backend URL

export const sendText = async (text: string): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/send-text`, { text });
        return response.data;
    } catch (error) {
        console.error('Error sending text:', error);
        return null;
    }
}
