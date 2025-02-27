import axios from "axios";
import { APIResponse } from "./types";

const API_URL = "https://dev-api.eot.lumian.energy/v3/data/apps/osos/methods/getOsosListTable";
const username = "_key_570887605177481709";
const password = "21e1c216c139466b827e258c2ed261d2";

export const fetchData = async (): Promise<APIResponse | null> => {
    try {
        const requestBody = {
            locale: "en",
            value: {},  
            queryParameters: {}  
        };

        const response = await axios.post<APIResponse>(
            API_URL,
            requestBody,  
            {
                auth: { username, password },
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                }
            }
        );

        console.log("API Full Response:", response.data);
        return response.data;
    } catch (error: any) {
        console.error("API Fetch Error:", error.response ? JSON.stringify(error.response.data, null, 2) : error.message);
        return null;
    }
};
