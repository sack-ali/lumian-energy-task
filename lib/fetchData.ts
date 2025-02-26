import axios from 'axios';
import { APIResponse } from './types';

const API_URL = 'https://dev-api.eot.lumian.energy/v3/data/apps/osos/methods/getOsosListTable';
const username = '_key_570887605177481709';
const password = '21e1c216c139466b827e258c2ed261d2';

export const fetchData = async (): Promise<APIResponse | null> => {
    try {
        const response = await axios.post<APIResponse>(API_URL, {}, {
            auth: { username, password }
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
};
