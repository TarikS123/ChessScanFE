import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TextInput, FlatList, Image, Linking } from 'react-native';
import Chessboard from '../components/Board'; 
import URL from '../utils/connection';


export default function PlayableBoard({ route }) {
    const [fen, setFen] = useState(route.params?.FEN || 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
    const [videos, setVideos] = useState([]);
    const [filteredVideos, setFilteredVideos] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
   
    
    useEffect(() => {
        const encodedFen = encodeURIComponent(fen);
        setVideos([]);
        fetch(`${URL}/proxy?fen=${encodedFen}`)
            .then(response => response.json())
            .then(data => {
                const alwaysArray = [].concat(data); 
                const limitedData = alwaysArray.slice(0, 300); // SKONTAJ KAKO DA NE BUDE OGRANICENO NA 300 VIDEA
                setVideos(limitedData);
                setFilteredVideos(limitedData); 
                setSearchQuery('');
            })
            .catch(error => console.error('Error fetching video data:', error));
    }, [fen]);

    useEffect(() => {
        const lowercasedQuery = searchQuery;
        let filtered = []; 

        videos.forEach(video => {
            if (video.title && video.uploader)
                if (video.title.includes(lowercasedQuery) ||
                    video.uploader.includes(lowercasedQuery)) {
                    filtered.push(video);
                }
        });

        setFilteredVideos(filtered);
    }, [searchQuery, videos]);

    return (
        <SafeAreaView style={styles.container}>
            <Chessboard
                initialFen={fen}
                onFenChange={setFen}
            />

            <TextInput
                style={styles.searchBar}
                placeholder="Search by title or uploader..."
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            <FlatList
                style={styles.list}
                data={filteredVideos}
                renderItem={({ item }) => (
                    <View style={styles.videoDetails}>
                        <Image
                            style={styles.thumbnail}
                            source={{ uri: `https://img.youtube.com/vi/${item.yt_id}/hqdefault.jpg` }}
                        />
                        <Text style={styles.title}>{item.title}</Text>
                        <Text>Duration: {item.duration}</Text>
                        <Text>Uploaded by: {item.uploader}</Text>
                        <Text style={styles.watchYt} onPress={() => Linking.openURL(item.position_url)}>Watch on YouTube</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        marginTop: 15,
    },
    searchBar: {
        fontSize: 18,
        margin: 10,
        padding: 10,
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    videoDetails: {
        padding: 10,
        marginTop: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
        marginBottom: 10,
        width: 350,
        height: 'auto',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    watchYt: {
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        color: 'white',
        marginTop: 20,
        backgroundColor: 'red',
        padding: 15,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
    },
    thumbnail: {
        width: '100%',
        height: 180,
        borderRadius: 5,
    },
});
