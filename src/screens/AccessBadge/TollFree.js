import React, { useState, useEffect } from 'react'
import QRCode from 'react-native-qrcode-svg'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    Platform,
    useWindowDimensions
} from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ring from '../ChatRoom/Ring';
import RenderHtml from 'react-native-render-html'
import { WebView } from "react-native-webview";


const TollFree = ({ navigation }) => {
    const [About, setAbout] = useState({})
    const { width } = useWindowDimensions()


    useEffect(async () => {
        const id = await AsyncStorage.getItem('id')
        console.log(id)
        const Token = await AsyncStorage.getItem('token')
        console.log("your token", Token)
        const query = `
    {
        cmsByCategory(CmsCategoryInput:
            {category:TOLL_NUMBER
            })
            {
                description,
            }
        }`

        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: query })
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setAbout(data.data.cmsByCategory);
                console.log(data.data.cmsByCategory);
            })
    }, [])
    return (
        <View renderToHardwareTextureAndroid={true}>
            <View style={{ width: '100%', height: windowHeight / 8, backgroundColor: '#0A2133', flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Toll Free</Text>
                </View>
                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Notifications') }} style={{ marginRight: '5%' }}>
                        <Ring />
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                        <></>

                    ) : (

                        <TouchableOpacity onPress={() => { navigation.navigate('Profile') }} style={{ marginLeft: '5%' }}>
                            <MaterialIcons name="coronavirus" size={24} color="white" />
                        </TouchableOpacity>

                    )}
                </View>

            </View>


            <View
                style={{
                    width: windowWidth - 20,
                    marginTop: 10,
                    marginHorizontal: 50,
                    borderRadius: 10,
                    height: windowHeight * 7 / 8,
                }}>
                {JSON.stringify(About) != "{}" ? (
                    About.length > 0 ? (

                        <RenderHtml contentWidth={width} source={{ html: `${About[0].description}` }} />
                    ) : (

                        <Text style={{ marginTop: 40 }}>No Info yet...</Text>
                    )
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                        <ActivityIndicator size='large' color='#0771b8' />
                    </View>
                )}
            </View>
        </View>
    )
}

export default TollFree

const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#707070",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4.65,

        elevation: 8,
    },
    imagetop: {
        width: windowWidth,
    }
})