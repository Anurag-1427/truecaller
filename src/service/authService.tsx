import axios from "axios";
import { storage } from "../state/storage";
import { useUserStore } from "../state/userStore";
import { BASE_URL } from "./config";
import { appAxios } from "./apiInterceptors";
import { Alert } from "react-native";

export const login = async (phoneNumber: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, { phoneNumber });
        const { accessToken, refreshToken, user } = response.data;
        storage.set('accessToken', accessToken);
        storage.set('refreshToken', refreshToken);
        const { setUser } = useUserStore.getState();
        setUser(user);
        return response.data;

    } catch (error) {
        console.error('Login Error', error);
        throw error;
    }
}

export const signup = async (phoneNumber: any, email: string, name: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/signup`, { phoneNumber, email, name });
        const { accessToken, refreshToken, user } = response.data;
        storage.set('accessToken', accessToken);
        storage.set('refreshToken', refreshToken);
        const { setUser } = useUserStore.getState();
        setUser(user);
        return response.data;

    } catch (error) {
        console.error('Signup Error', error);
        throw error;
    }
}

export const findUser = async (phoneNumber: any) => {
    try {
        const response = await appAxios.get(`${BASE_URL}/${phoneNumber}`);
        return response?.data;

    } catch (error) {
        console.error('findUser Error', error);
        throw error;
    }
}

export const addMultipleContacts = async (users: any) => {
    try {
        const response = await appAxios.post(`${BASE_URL}/add-multiple`, { users });
        console.log("CONTACT SEEDED ✅")
        return response.data;

    } catch (error) {
        console.error('Add Multiple contacts Error', error);
        throw error;
    }
}

export const reportSpam = async (phoneNumber: any) => {
    try {
        const response = await appAxios.put(`${BASE_URL}/report/${phoneNumber}`);
        console.log(`res in reportSpam: `, response);
        Alert.alert('User reported as spam')
        return response.data;

    } catch (error) {
        console.error('Spam Error', error);
        throw error;
    }
}