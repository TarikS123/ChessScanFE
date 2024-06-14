import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Alert, Image, FlatList, TouchableOpacity, TextInput } from 'react-native';

export default function FindFriends() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');

    const avatarMap = {
        avatar1: require('../assets/avatars/avatari1.jpg'),
        avatar2: require('../assets/avatars/avatari2.jpg'),
        avatar3: require('../assets/avatars/avatari3.jpg'),
        avatar4: require('../assets/avatars/avatari4.jpg'),
    };

    useEffect(() => {
        fetchUsers();
    }, [search]);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`https://44dd-77-238-198-52.ngrok-free.app/users?username=${search}`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            Alert.alert("Error", "Unable to fetch users. Please try again later.");
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by username..."
                value={search}
                onChangeText={setSearch}
            />
            <FlatList
                data={users}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                <View style={styles.box}>
            {/* Ensure that item.picture is mapped correctly */}
                <Image style={styles.image} source={avatarMap[item.picture]} />
                <View style={styles.boxContent}>
                <Text style={styles.title}>{item.username}</Text>
                <Text style={styles.description}>Lorem ipsum dolor sit amet</Text>
                <View style={styles.buttons}>
                    <TouchableOpacity style={[styles.button, styles.view]} onPress={() => Alert.alert('Liked', `You liked ${item.username}`)}>
                        <Image style={styles.icon} source={{ uri: 'https://img.icons8.com/color/70/000000/filled-like.png' }} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )}
/>

        </View>
    );
}

const styles = StyleSheet.create({
    searchBar: {
        height: 40,
        borderWidth: 1,
        borderColor: '#ccc',
        paddingLeft: 10,
        margin: 10,
        borderRadius: 5,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 35, 
        marginRight: 20
    },
    box: {
        padding: 20,
        marginTop: 5,
        marginBottom: 5,
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    boxContent: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginLeft: 10,
    },
    title: {
        fontSize: 18,
        color: '#151515',
    },
    description: {
        fontSize: 15,
        color: '#646464',
    },
    buttons: {
        flexDirection: 'row',
    },
    button: {
        height: 35,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width: 50,
        marginRight: 5,
        marginTop: 5,
    },
    icon: {
        width: 20,
        height: 20,
    },
    view: {
        backgroundColor: '#eee',
    },
});
