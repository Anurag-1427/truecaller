import axios from "axios";
import { BASE_URL } from "./config";
import { storage } from "../state/storage";
import { resetAndNavigate } from "../utils/NavigationUtils";
import { Alert } from "react-native";

export const appAxios = axios.create({
    baseURL: BASE_URL
})

appAxios.interceptors.request.use(async config => {
    const accessToken = storage.getString('accessToken');
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config;
})

appAxios.interceptors.response.use(
    response => response,
    async error => {
        if (error.response && error.response.status === 401) {
            resetAndNavigate('AuthScreen')
            Alert.alert('Token Expired')
            storage.clearAll();
        }
    }
)