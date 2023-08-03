import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Dimensions, Platform } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';

import Ring from '../ChatRoom/Ring';

const Services = ({ navigation }) => {
    const [profile, setProfile] = useState({})

    useEffect(async () => {
        const id = await AsyncStorage.getItem('id')
        console.log(id)
        const Token = await AsyncStorage.getItem('token')
        console.log("your token", Token)

        const userQuery = `{
        user(id:${JSON.stringify(id)}){
            firstName,lastName,qrcodeData,title,avatar,occupation,category,showNoc
          }
    }`
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: userQuery })
        }).then(response => response.json())
            .then(data => setProfile(data.data.user))
    }, [])


    const NOC = true
    return (
        <View styles={styles.container}>
            <StatusBar
                backgroundColor="#0A2133"
                barStyle='light-content'
                translucent={false}
            />
            <View style={{ width: '100%', backgroundColor: '#0A2133', height: '40%', flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={26} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Services</Text>
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

            <View style={{ height: '8%' }}>

                <View style={{ flexDirection: 'row', height: "580%" }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Programs') }} style={{ width: '50%', height: '100%', backgroundColor: '#E0A100', justifyContent: 'center', alignItems: 'center' }} >
                        <Entypo name='briefcase' size={70} color="#fff" />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16 }}>Programs</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('KeyVenue')} style={{ width: '50%', height: '100%', backgroundColor: '#0A2133', justifyContent: 'center', alignItems: 'center' }}>
                        <Entypo name='location-pin' size={50} color="#fff" />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16, textAlign: "center" }}>Key Venues</Text>
                    </TouchableOpacity>
                </View>


                <View style={{ flexDirection: 'row', height: "580%" }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Transport')} style={{ width: '50%', height: '100%', backgroundColor: '#71A215', justifyContent: 'center', alignItems: 'center' }}>
                        <FontAwesome5 name='bus' color="#FFF" size={60} />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16, textAlign: "center" }}>Transport</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Media')} style={{ width: '50%', height: '100%', backgroundColor: '#F72785', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../../images/media.png')} resizeMode='contain' />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16, textAlign: "center" }}>Media</Text>
                    </TouchableOpacity>
                </View>



                <View style={{ flexDirection: 'row', height: "580%", marginTop: -1 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Rooms')} style={{ width: '50%', height: '100%', backgroundColor: '#0F57A9', justifyContent: 'center', alignItems: 'center' }} >
                        <MaterialCommunityIcons name="calendar-clock" size={60} color="white" resizeMode='contain' />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16 }}>Room Booking</Text>
                    </TouchableOpacity>
                    {profile.showNoc ? (

                        <TouchableOpacity onPress={() => navigation.navigate('NOC')} style={{ width: '50%', height: '100%', backgroundColor: '#12A58F', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../../images/NOC.png')} style={{ width: '30%', height: "60%" }} resizeMode='contain' />
                            <Text style={{ color: 'white', fontSize: 16 }}>NOC</Text>
                        </TouchableOpacity>

                    ) : (
                        <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{ width: '50%', height: '100%', backgroundColor: '#12A58F', justifyContent: 'center', alignItems: 'center' }}>
                            <Image source={require('../../images/NOC.png')} style={{ width: '30%', height: "60%" }} resizeMode='contain' />
                            <Text style={{ color: 'white', fontSize: 16 }}>Communications</Text>
                        </TouchableOpacity>

                    )}

                </View>


                <Text style={{ color: '#0F94BD', textAlign: "center" }}>Hosted by</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                    <Image source={require('../../images/CaR.png')} style={{ width: 65, height: 70 }} />
                    <Image source={require('../../images/CW.png')} style={{ width: 120, height: 80, marginLeft: 20 }} />
                </View>
            </View>

        </View>
    )
}

export default Services;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})