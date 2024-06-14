import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeUserData = async (userData) => {
    try {
        const jsonValue = JSON.stringify(userData);
        await AsyncStorage.setItem('user', jsonValue);
    } catch (e) {
        console.error("Failed to save user data", e);
    }
};

export const retrieveUserData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('user');
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.error("Failed to fetch user data", e);
        return null;
    }
};
