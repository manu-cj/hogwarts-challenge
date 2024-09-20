import axios from 'axios';


export async function apiRequest({ token = null, endpoint, method = "GET", data = null }) {
    const baseURL = import.meta.env.VITE_API_BASE_URL;

    const url = `${baseURL}${endpoint}`;
 
    const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` })
    };

    try {
        const response = await axios({
            withCredentials: true,
            url,
            method,
            headers,
            data 
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error(`Error: ${error.response.status} - ${error.response.data.message}`);
            throw new Error(error.response.data.message || "An error occurred while fetching the data.");
        } else if (error.request) {
            console.error("No response received from the server.");
            throw new Error("No response received from the server.");
        } else {
            console.error("Error creating the request: ", error.message);
            throw new Error(error.message || "An error occurred.");
        }
    }
}
