import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    StatusBar,
    ScrollView,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons'
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from "react-native-webview";
const About = ({ navigation }) => {
    const [about, setAbout] = useState({});
    const { width } = useWindowDimensions()



    const query = `
    query about{
        aboutConference{description}
      }`
    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        console.log(Token)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: query })
        }).then(response => response.json())
            .then(data => setAbout(data.data.aboutConference))
    }, [])
    return (
        <View style={{backgroundColor:'white'}}>
            <View style={{ width: '100%', height: windowHeight / 9, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'black', fontSize: 18 }}>About</Text>
                </View>
                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>

                </View>

            </View>


            <ScrollView showsVerticalScrollIndicator={false} style={{ height: (windowHeight * 8 / 9) }}>
                <View style={{ alignItems: "center" }}>
                    <Image source={require('../../images/CHOGM.png')} resizeMode="contain" style={{width: windowWidth, height: windowHeight / 4.1}} />
                </View>
                <View style={{marginHorizontal: windowWidth / 12}}>
                    {/* Html */}

                    <View style={{height:windowHeight/1.3, marginTop: 0 }}>
                        {JSON.stringify(about) != "{}" ? (
                            about.description !== null ? (

                                <WebView  source={{ html: `<span style="font-size:50px;">${about.description}</span>` }} />
                            ) : (

                                <Text style={{ marginTop: 40 }}>No Info yet...</Text>
                            )
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                <ActivityIndicator size='large' color='#0771b8' />
                            </View>
                        )}

                    </View>


                    {/* Footer */}


                </View>
            </ScrollView>


        </View>
    )
}

export default About


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
        width: 200,
        marginTop: -25
    }
})