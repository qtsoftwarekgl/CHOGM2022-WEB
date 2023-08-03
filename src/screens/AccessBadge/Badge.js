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
    Platform
} from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons'
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ring from '../ChatRoom/Ring';

const Badge = ({ navigation }) => {
    const [profile, setProfile] = useState({})

    useEffect(async () => {
        const id = await AsyncStorage.getItem('id')
        console.log(id)
        const Token = await AsyncStorage.getItem('token')
        console.log("your token",Token)
        const userQuery = `
    {
        user(id:${JSON.stringify(id)}){
            firstName,lastName,qrcodeData,title,avatar,occupation,category
          }
    }
    `
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: userQuery })
        }).then(response => response.json())
            .then(data => setProfile(data.data.user))
    }, [])
    return (
        <View>
            <View style={{ width: '100%', height: windowHeight / 8, backgroundColor: '#0A2133', flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Access Badge</Text>
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

            <ScrollView sty={{ height: windowHeight * 7 / 8 }}>


                {JSON.stringify(profile) != "{}" ? (

                    profile.qrcodeData !== null ?
                        (

                            <View style={{
                                backgroundColor: "#e9ecef",
                                width: windowWidth - 20,
                                marginTop: 10,
                                alignContent: "center",
                                alignItems: "center",
                                alignSelf: "center",
                                borderRadius: 10,
                                ...styles.shadow
                            }}>
                                <Image source={require('../../images/CHOGM.png')} resizeMode="contain" style={styles.imagetop} />

                                <Text style={{ fontSize: 18, fontWeight: "bold", letterSpacing: 3, color: "#0A2133" }}>{profile.title} {profile.firstName} {profile.lastName}</Text>
                                {profile.avatar !== "" ? (

                                    <Image source={{ uri: profile.avatar }} style={{ width: windowHeight / 5.4, height: windowHeight / 5.4, borderRadius: 100 }} resizeMode="contain" />
                                ) : (

                                    <View style={{ backgroundColor: "#0F57A9", height: 100, width: 100, borderRadius: 100, justifyContent: "center" }}>
                                        <Text style={{ textAlign: "center", textTransform: "capitalize", fontSize: 30, color: "#fff" }}>{profile.firstName.slice(0, 1)}{profile.lastName.slice(0, 1)}</Text>
                                    </View>


                                )}
                                <View style={{ marginTop: windowHeight / 60, marginBottom: windowHeight / 60 }}>
                                    <QRCode
                                        value={profile.qrcodeData}
                                        size={windowHeight / 3.4} />
                                </View>
                                <View style={{ backgroundColor: "#12a58f", width: "100%", alignContent: "center", justifyContent: "center", flexDirection: "row", alignItems: "center", height: 50, borderBottomLeftRadius: 10, borderBottomRightRadius: 10 }} >
                                    <Text style={{ color: "#fff", fontSize: 20, textAlign: "center" }}>{profile.category}</Text>
                                </View>


                            </View>
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                <Text style={{ marginTop: 40, fontWeight: "bold", fontSize: 20, color: "#7d7d7d" }}>No Badge linked yet...</Text>
                            </View>
                        )
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                        <ActivityIndicator size='large' color='#0771b8' />
                    </View>
                )}

            </ScrollView>


        </View>
    )
}

export default Badge

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
    }
})