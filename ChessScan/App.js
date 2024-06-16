import React from 'react';
import { Button, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { reactNativeReanimate } from 'react-native-reanimated';
import ImageScan from './pages/ImageScan';
import PlayableBoard from './pages/PlayableBoard';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'; 
import SignupScreen from './pages/SignupScreen';
import LoginScreen from './pages/login';
import Profile from './pages/Profile';
import MultiPlayerGame from './pages/MultiPlayerGame';
import FindFriends from './pages/FindFriends';



const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
    return (
    <View style={styles.container}>
      <Image style={styles.image} source={require('./assets/final_logo-removebg-preview.png')} />
      <View style={styles.container_buttons}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ImageScan')}>
          <Text style={styles.buttonText}>Scan a Board</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('PlayableBoard')}>
          <Text style={styles.buttonText}>Browse Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MultiPlayerGame')}>
          <Text style={styles.buttonText}>Quick Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
          <Text style={styles.buttonText}>My Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Find Friends')}>
          <Text style={styles.buttonText}>Browse People</Text>
        </TouchableOpacity>
      </View>
     </View>
    );
}

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Signup">
                <Stack.Screen name="Signup" component={SignupScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: 'rgb(96, 219, 132)', 
                        },
                        headerTintColor: 'rgb(0, 0, 0)',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                        title: 'Sign Up' 
                    }} />

                <Stack.Screen name="Log In" component={LoginScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: 'rgb(96, 219, 132)',
                        },
                        headerTintColor: 'rgb(0, 0, 0)',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                    }} />
                <Stack.Screen name="Home" component={HomeScreen}
                    options={{
                        headerStyle: {
                            backgroundColor: 'rgb(96, 219, 132)',
                            height: 300
                        },
                        headerTintColor: 'rgb(0, 0, 0)',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                    }} />
                <Stack.Screen name="ImageScan" component={ImageScan}
                    options={{
                        headerStyle: {
                            backgroundColor: 'rgb(96, 219, 132)',
                        },
                        headerTintColor: 'rgb(0, 0, 0)',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                    }} />
                <Stack.Screen name="PlayableBoard" component={PlayableBoard}
                    options={{
                        headerStyle: {
                            backgroundColor: 'rgb(96, 219, 132)',
                        },
                        headerTintColor: 'rgb(0, 0, 0)',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                    }} />
                <Stack.Screen name="Profile" component={Profile}
                    options={{
                        headerStyle: {
                            backgroundColor: 'rgb(96, 219, 132)',
                        },
                        headerTintColor: 'rgb(0, 0, 0)',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                    }} />
                <Stack.Screen name="MultiPlayerGame" component={MultiPlayerGame}
                    options={{
                        headerStyle: {
                            backgroundColor: 'rgb(96, 219, 132)',
                        },
                        headerTintColor: 'rgb(0, 0, 0)',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                    }} />
                <Stack.Screen name="Find Friends" component={FindFriends}
                    options={{
                        headerStyle: {
                            backgroundColor: 'rgb(96, 219, 132)',
                        },
                        headerTintColor: 'rgb(0, 0, 0)',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                            fontSize: 20
                        },
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        
        gap: 15
    },
    title: {
        fontSize: 18,
        marginBottom: 20,
    },
    boardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginRight: 415
    },
    image: {
        height:350,
        width:350,
        marginRight: 'auto',
        marginLeft: 'auto',
        position: 'relative',
        top: 20
    },
    button_container: {
        marginTop: 50
    },
    button: {
        marginTop:0 ,
        backgroundColor: '#fff'
    },
    container_buttons :{
        marginTop: 20
    }
   
});
