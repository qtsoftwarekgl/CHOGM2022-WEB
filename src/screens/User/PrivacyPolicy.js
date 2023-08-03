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
    ActivityIndicator,
    BackHandler,
    Alert,
    Platform
} from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons'
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import { useWindowDimensions } from 'react-native';
import HTML from 'react-native-render-html';
import { WebView } from "react-native-webview";

import AsyncStorage from '@react-native-async-storage/async-storage';

const PrivacyPolicy = ({ navigation }) => {
    const [about, setAbout] = useState({});
    const { width } = useWindowDimensions()

    const query = `
    query privacy{
        privacyPolicy{description}
      }`
    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        console.log(Token)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify({ query: query })
        }).then(response => response.json())
            .then(data => setAbout(data.data.privacyPolicy))
    }, [])

    const backAction = () => {
        Alert.alert('Privacy policy', 'Do you disagree with the privacy of this application?', [
            {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
            },
            { text: 'YES', onPress: () => alert("You need to agree to privacy policy to continue.") },
        ]);

    };

    return (
        <View style={{backgroundColor:'white'}}>
            <StatusBar backgroundColor='#0A2133' barStyle="dark-content" />
            <View style={{ width: '100%', height: windowHeight / 9, flexDirection: 'row' }}>
                <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'black', fontSize: 18 }}>Privacy policies</Text>
                </View>
                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>

                </View>
            </View>


            <ScrollView showsVerticalScrollIndicator={false} style={{ height: (windowHeight * 3 / 4) + 18 }}>
                <View style={{ justifyContent: "center", marginHorizontal: -10, marginRight: -100 }}>
                    <Image source={require('../../images/CHOGM.png')} resizeMode="contain" style={styles.imagetop} />
                </View>
                <View style={{ marginHorizontal: windowWidth / 12 }}>
                    {/* Html */}

                    <View style={{ height:windowHeight/2, marginTop: 10 }}>
                        {JSON.stringify(about) != "{}" ? (
                            about.description !== null ? (

                                <WebView  source={{ html: `<span style="font-size:55px;">${about.description}</span>` }} />
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
            {true ? (
                <View style={{ flexDirection: "row" }}>

                    <TouchableOpacity onPress={backAction} style={{ width: '50%', alignSelf: 'center', justifyContent: 'center', marginVertical: 20, borderWidth: 1, borderColor: '#fff', backgroundColor: "#7d7d7d", height: 50, flexDirection: "row", alignItems: "center", borderRadius: 10 }}>
                        <Text style={{ color: 'white' }}>DISAGREE</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')} style={{ width: '50%', alignSelf: 'center', justifyContent: 'center', marginVertical: 20, borderWidth: 1, borderColor: '#fff', backgroundColor: "#0771b8", height: 50, flexDirection: "row", alignItems: "center", borderRadius: 10 }}>
                        <Text style={{ color: 'white' }}>AGREE</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <></>

            )}

        </View>
    )
}

export default PrivacyPolicy


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