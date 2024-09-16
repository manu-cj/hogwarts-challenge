import axios from 'axios';

export async function UserDataApi(token, endpoint) {
    
    const url = `http://localhost:5000/api${endpoint}`;
    const method = "GET";
    const headers = {
        Authorization: `Bearer ${token}`
    };

    try {
        const response = await axios({
            url,
            method,
            headers
        });
        return response.data; 
    } catch (error) {
        throw error; 
    }
}