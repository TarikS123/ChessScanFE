import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, Modal, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Import different avatar images correctly
import avatar1 from '../assets/avatars/avatari1.jpg';
import avatar2 from '../assets/avatars/avatari2.jpg';
import avatar3 from '../assets/avatars/avatari3.jpg';
import avatar4 from '../assets/avatars/avatari4.jpg';

const ProfileScreen = () => {
    const [userProfile, setUserProfile] = useState({
        username: "Loading...",
        profilePicture: "default",
        id: 0,
        gamesWon: 0,
        gamesPlayed: 0,
        numberOfScans: 0,
        puzzlesSolved: 0,
        gameHistory: [],
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    //const [profilePicture, setUserProfilePicture] = useState(userData);

    const predefinedPictures = [
        { id: 'avatar1', src: require('../assets/avatars/avatari1.jpg') },
        { id: 'avatar2', src: require('../assets/avatars/avatari2.jpg') },
        { id: 'avatar3', src: require('../assets/avatars/avatari3.jpg') },
        { id: 'avatar4', src: require('../assets/avatars/avatari4.jpg') },
    ];
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const jsonValue = await AsyncStorage.getItem('user');
                const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
                if (userData && userData.id) {
                    const response = await fetch(`https://44dd-77-238-198-52.ngrok-free.app/user/${userData.id}`);
                    const data = await response.json();
                    if (response.ok) {
                        setUserProfile({
                            ...userProfile,
                            username: data.username,
                            profilePicture: data.picture || 'https://via.placeholder.com/150',
                            id: data.id,
                            gamesWon: data.games_won,
                            gamesPlayed: data.games_played,
                            numberOfScans: data.numberOfScans,
                            puzzlesSolved: data.puzzles_solved,
                            gameHistory: data.gameHistory || [],
                        });
                    } else {
                        throw new Error(data.error || 'Failed to fetch user data.');
                    }
                }
            } catch (error) {
                console.error("Failed to fetch user data", error);
            }
        };

        fetchUserData();
    }, []);
    
    
    const handlePictureChange = async (avatarId) => {
        try {
            const jsonValue = await AsyncStorage.getItem('user');
            const userData = jsonValue != null ? JSON.parse(jsonValue) : null;
    
            if (userData && userData.id) {
                const pictureUrl = predefinedPictures.find(p => p.id === avatarId).src;
                const apiResponse = await fetch(`https://44dd-77-238-198-52.ngrok-free.app/user/${userData.id}/update_picture`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ picture: avatarId })  
                });
    
                const data = await apiResponse.json();
                if (apiResponse.ok) {
                    await AsyncStorage.setItem('user', JSON.stringify({ ...userData, profilePicture: avatarId }));
                    setUserProfile({ ...userProfile, profilePicture: pictureUrl });
                    Alert.alert('Success', 'Profile picture updated successfully');
                } else {
                    throw new Error(data.error || 'Failed to update profile picture.');
                }
            }
    
            setIsModalVisible(false);
        } catch (error) {
            console.error("Failed to update profile picture", error);
            Alert.alert('Error', 'Failed to update profile picture');
        }
    };

    const getImageSource = (picture) => {        
        const foundImage = predefinedPictures.find(p => p.id === picture);
        return foundImage ? foundImage.src : require('../assets/avatars/default.jpg');
        
    };
    
    

    return (
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
            <TouchableOpacity onPress={() => setIsModalVisible(true)}>
            <Image
                source={getImageSource(userProfile.profilePicture)}
            style={{ width: 150, height: 150, borderRadius: 75, alignSelf: 'center', marginBottom: 20 }}
            />
            </TouchableOpacity>
            <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#333', alignSelf: 'center', marginBottom: 20, marginTop: 15 }}>
                {userProfile.username}
            </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
            <View style={{ alignItems: 'center', width: 80, textAlign: 'center' }}>
                <Icon name="account-card-details" size={30} color="#FFD700" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>{userProfile.id}</Text>
                <Text style={{ fontSize: 16, color: '#555' }}>User ID</Text>
            </View>
            <View style={{ alignItems: 'center', width: 80, textAlign: 'center' }}>
                <Icon name="trophy-award" size={30} color="#FFD700" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>{userProfile.gamesWon}</Text>
                <Text style={{ fontSize: 16, color: '#555' }}>Games Won</Text>
            </View>
            <View style={{ alignItems: 'center', width: 80, textAlign: 'center' }}>
                <Icon name="barcode-scan" size={30} color="#8f8f8f" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>{userProfile.numberOfScans}</Text>
                <Text style={{ fontSize: 16, color: '#555' }}>Scans</Text>
            </View>
            <View style={{ alignItems: 'center', width: 80, textAlign: 'center' }}>
                <Icon name="puzzle" size={30} color="#20c997" />
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>{userProfile.puzzlesSolved}</Text>
                <Text style={{ fontSize: 16, color: '#555' }}>Puzzles Solved</Text>
            </View>
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 20, alignSelf: 'center' }}>
            Win Rate: {userProfile.gamesPlayed > 0 ? ((userProfile.gamesWon / userProfile.gamesPlayed * 100).toFixed(2) + '%') : 'N/A'}
        </Text>


            <Modal
                visible={isModalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <View style={{ width: 300, backgroundColor: '#fff', padding: 20, borderRadius: 10, alignItems: 'center' }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>Choose a Profile Picture</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', marginBottom: 20 }}>
                            {predefinedPictures.map((picture, index) => (
                                <TouchableOpacity key={index} onPress={() => handlePictureChange(picture.id)}>
                                <Image source={picture.src} style={{ width: 70, height: 70, borderRadius: 35 }} />
                            </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={{ backgroundColor: '#20c997', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 }} onPress={() => setIsModalVisible(false)}>
                            <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    profilePic: {
        width: 150,
        height: 150,
        borderRadius: 75,
        alignSelf: 'center',
        marginBottom: 20,
    },
    username: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        alignSelf: 'center',
        marginBottom: 20,
        marginTop: 15,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    statBox: {
        alignItems: 'center',
        width: 80,
        textAlign: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 16,
        color: '#555',
    },
    winRate: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        alignSelf: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    pictureOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    optionPic: {
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    closeButton: {
        backgroundColor: '#20c997',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
