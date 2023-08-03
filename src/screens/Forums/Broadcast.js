import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Feather, FontAwesome, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { WebView } from "react-native-webview";
import Ring from '../ChatRoom/Ring';


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Broadcast = (props) => {
    const [videoId, setVideoId] = useState('')
    useEffect(() => {
        console.log(props.route.params.link)
        const link = props.route.params.link
        setVideoId(link)
    }, [])
    return (
        <View>
            <View style={{ width: windowWidth, backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Broadcast</Text>
                </View>


            </View>

            {JSON.stringify(videoId) != "{}" && videoId !== undefined ?
                (
                    videoId.length > 0 ? (

                        <View style={{ height: windowHeight * 7 / 8 }}>
                            <WebView
                                source={{ uri: videoId }}
                            />
                        </View>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>This programme is not broadcasted yet...</Text>
                        </View>
                    )) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                        <ActivityIndicator size='large' color='#0771b8' />
                    </View>
                )

            }

        </View>
    )
}
export default Broadcast;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center'

    }
})