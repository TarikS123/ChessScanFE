import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Button } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { useNavigation } from '@react-navigation/native';

export default function ImageScan() {
    const [cameraType, setCameraType] = useState('back');
    const cameraRef = useRef(null);
    const navigation = useNavigation();
    const [permission, requestPermission] = useCameraPermissions();

    const takePicture = async () => {
        if (cameraRef.current && permission.granted) {
            const photo = await cameraRef.current.takePictureAsync();
            const orientedPhoto = await ensureCorrectOrientation(photo.uri);
            const base64Image = await convertImageToBase64(orientedPhoto.uri);
            sendImageToAPI(base64Image);
        }
    };

    const ensureCorrectOrientation = async (uri) => {
        const result = await ImageManipulator.manipulateAsync(
            uri,
            [],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );
        return result;
    };

    const convertImageToBase64 = async (uri) => {
        const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
        return `data:image/jpeg;base64,${base64}`;
    };

    const sendImageToAPI = async (base64Image) => {
        const apiURL = 'https://44dd-77-238-198-52.ngrok-free.app/process-image';
        try {
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: base64Image })
            });
            if (response.ok) {
                const { FEN } = await response.json();
                navigation.navigate('PlayableBoard', { FEN });
            } else {
                console.error('Image upload failed', await response.text());
            }
        } catch (error) {
            console.error('Failed to connect to API', error);
        }
    };

    if (!permission) {
        return <View style={styles.container}>
            <Text>Requesting camera permission...</Text>
        </View>;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Button onPress={requestPermission} title="Grant Camera Permission" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={styles.camera} facing={'back'}>
                <View style={styles.overlay}>
                    <View style={styles.cornerTopLeft}></View>
                    <View style={styles.cornerTopRight}></View>
                    <View style={styles.cornerBottomLeft}></View>
                    <View style={styles.cornerBottomRight}></View>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity style={styles.button} onPress={takePicture}>
                        <Text style={styles.buttonText}>Scan Board</Text>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    camera: {
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 50,
        backgroundColor: 'transparent',
    },
    cornerTopLeft: {
        position: 'absolute',
        top: 150,
        left: 30,
        width: 50,
        height: 50,
        borderTopWidth: 4,
        borderLeftWidth: 4,
        borderColor: 'white',
    },
    cornerTopRight: {
        position: 'absolute',
        top: 150,
        right: 30,
        width: 50,
        height: 50,
        borderTopWidth: 4,
        borderRightWidth: 4,
        borderColor: 'white',
    },
    cornerBottomLeft: {
        position: 'absolute',
        bottom: 250,
        left: 30,
        width: 50,
        height: 50,
        borderBottomWidth: 4,
        borderLeftWidth: 4,
        borderColor: 'white',
    },
    cornerBottomRight: {
        position: 'absolute',
        bottom: 250,
        right: 30,
        width: 50,
        height: 50,
        borderBottomWidth: 4,
        borderRightWidth: 4,
        borderColor: 'white',
    },
    text: {
        color: 'white',
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    button: {
        padding: 20,
        backgroundColor:  'rgb(96,219,132)',
        borderRadius: 30,
        marginBottom: 50,
    },
    buttonText: {
        fontSize: 18,
        color: 'black',
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
    },
});