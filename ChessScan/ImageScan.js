import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';

export default function ImageScan() {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
    const cameraRef = useRef(null);
    const navigation = useNavigation(); // Hook for navigation

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        })();
    }, []);

    const takePicture = async () => {
        if (cameraRef.current) {
            const photo = await cameraRef.current.takePictureAsync();
            const orientedPhoto = await ensureCorrectOrientation(photo.uri);
            const base64Image = await convertImageToBase64(orientedPhoto.uri);
            sendImageToAPI(base64Image);
        }
    };

    const ensureCorrectOrientation = async (uri) => {
        const result = await ImageManipulator.manipulateAsync(uri, [], {
            compress: 1,
            format: ImageManipulator.SaveFormat.JPEG,
            base64: false,
        });
        return result;
    };

    const convertImageToBase64 = async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        return `data:image/jpeg;base64,${base64}`;
    };

    const sendImageToAPI = async (base64Image) => {
        const apiURL = 'https://aa3b-77-77-217-101.ngrok-free.app/process-image'; // Replace with your actual API endpoint
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ image: base64Image }),
        });
        if (response.ok) {
            const result = await response.json();
            const { FEN } = result;
            // Navigate to PlayableBoard with FEN
            navigation.navigate('PlayableBoard', { FEN });
        } else {
            console.log('Image upload failed');
        }
    };

    if (hasPermission === null) {
        return <View />;
    }
    if (hasPermission === false) {
        return <Text>No access to camera</Text>;
    }

    return (
        <View style={styles.container}>
            <Camera ref={cameraRef} style={styles.camera} type={cameraType}>
                <View style={styles.overlayContainer}>
                    <View style={styles.topLeftCorner} />
                    <View style={styles.topRightCorner} />
                    <View style={styles.bottomLeftCorner} />
                    <View style={styles.bottomRightCorner} />
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.buttonText}>Take Image</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

const cornerSize = 30;
const cornerWidth = 4;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    overlayContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    topLeftCorner: {
        position: 'absolute',
        top: '30%',
        left: '15%',
        borderTopWidth: cornerWidth,
        borderLeftWidth: cornerWidth,
        borderColor: 'white',
        width: cornerSize,
        height: cornerSize,
    },
    topRightCorner: {
        position: 'absolute',
        top: '30%',
        right: '15%',
        borderTopWidth: cornerWidth,
        borderRightWidth: cornerWidth,
        borderColor: 'white',
        width: cornerSize,
        height: cornerSize,
    },
    bottomLeftCorner: {
        position: 'absolute',
        bottom: '30%',
        left: '15%',
        borderBottomWidth: cornerWidth,
        borderLeftWidth: cornerWidth,
        borderColor: 'white',
        width: cornerSize,
        height: cornerSize,
    },
    bottomRightCorner: {
        position: 'absolute',
        bottom: '30%',
        right: '15%',
        borderBottomWidth: cornerWidth,
        borderRightWidth: cornerWidth,
        borderColor: 'white',
        width: cornerSize,
        height: cornerSize,
    },
    button: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
