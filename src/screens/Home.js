import React, { useEffect, useState, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Dimensions, Linking, RefreshControl, Platform } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, MaterialCommunityIcons, MaterialIcons,Entypo } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import Constants from 'expo-constants';
import * as Notifications_ from 'expo-notifications';
import * as Permissions from 'expo-permissions';
import Ring from './ChatRoom/Ring';
import { AuthContext } from '../context/context';
import { useFocusEffect } from '@react-navigation/native';
import * as Updates from 'expo-updates';

Notifications_.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});


async function registerForPushNotificationsAsync() {
    let token;
    console.log('token at start', token);
    if (Constants.isDevice) {
        const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
        }
        if (finalStatus !== "granted") {
            Alert.alert(
                "No Notification Permission",
                "please goto setting and on notification permission manual",
                [
                    { text: "cancel", onPress: () => console.log("cancel") },
                    { text: "Allow", onPress: () => Linking.openURL("app-settings:") },
                ],
                { cancelable: false }
            );
            return;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications_.getExpoPushTokenAsync()).data;
        console.log("ur token", token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
        Notifications_.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications_.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    return token;
}


const updateforce  = async () => {
    Updates.addListener((Event) => {
        if (Event.type === Updates.UpdateEventType.UPDATE_AVAILABLE) {
            alert("An update is available. Restart your app to update")
            // Updates.reloadAsync();    
        }
    })
}





const Home = ({ navigation }) => {

    const context = React.useContext(AuthContext)
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);


    const notificationListener = useRef();
    const responseListener = useRef();

    const senddeviceID = async (devId) => {
        const Token = await AsyncStorage.getItem('token')
        const user_id = await AsyncStorage.getItem('id')
        console.log("IOS user")
        const sendToken = `
          mutation senddevice{
            deviceRegistrationToken(registrationId:${JSON.stringify(devId)},userId:${JSON.stringify(user_id)}){
                id,
                deviceRegistrationId
            }
        }`
        console.log(sendToken)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: sendToken })
        }).then(response => response.json())
            .then(data => {
                console.log("Logs data")
                console.log(data)
                if (data.errors) {
                    alert(data.errors[0].message)
                    if (data.errors[0].message === "Invalid token") {
                        context.signOut()
                    }
                }
                else {
                    console.log('ok')
                }
            })
    }
    useFocusEffect(
        React.useCallback(async () => {
            const token = await registerForPushNotificationsAsync()
            senddeviceID(token)
            notificationListener.current = Notifications_.addNotificationReceivedListener(notification => {
                console.log(notification);
                navigation.navigate('Notifications')
            });
            updateforce();
        }, [])
    );
    return (
        <View styles={styles.container}>
            <StatusBar
                backgroundColor="#0A2133"
                barStyle='light-content'
                translucent={false}
            />
            <View style={{ width: '100%', backgroundColor: '#0A2133', height: '40%', flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { navigation.navigate('Drawer') }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Feather name="menu" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>CHOGM2022</Text>
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

            <View style={{ height: '8%' }} >
                <View style={{ flexDirection: 'row', height: "580%" }}>
                    <TouchableOpacity style={{ width: '50%', height: '100%', backgroundColor: '#0F57A9', justifyContent: 'center', alignItems: 'center' }} onPress={() => { navigation.navigate('About') }}>
                        <Image source={require('../images/chogmlogo.png')} style={{ width: windowWidth / 7, height: windowHeight / 12 }} resizeMode='contain' />
                        <Text style={{ color: 'white', marginTop: "5%", fontSize: 16 }}>About CHOGM</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => navigation.navigate('Forums')} style={{ width: '50%', height: '100%', backgroundColor: '#12A58F', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../images/chogmlogo.png')} style={{ width: windowWidth / 7, height: windowHeight / 12 }} resizeMode='contain' />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16 }}>Events</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', height: "580%" }}>
                    <TouchableOpacity onPress={() => navigation.navigate('Services')} style={{ width: '50%', height: '100%', backgroundColor: '#71A215', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="library-books" size={50} color="white" />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16 }}>Services</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.navigate('Information')} style={{ width: '50%', height: '100%', backgroundColor: '#B85900', justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialCommunityIcons name="book-information-variant" size={50} color="white" />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16 }}>Information Centre</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', height: "580%", marginTop: -1 }}>
                    <TouchableOpacity style={{ width: '50%', height: '100%', backgroundColor: '#E0A100', justifyContent: 'center', alignItems: 'center' }} onPress={() => navigation.navigate('TollFree')} >
                        <Entypo name="old-phone" size={50} color="white" />
                        <Text style={{ color: 'white', marginTop: '5%', fontSize: 16 }}>Toll Free</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('VisitRwanda') }} style={{ width: '50%', height: '100%', backgroundColor: '#0A2133', justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={require('../images/visitrwanda.png')} style={{ width: '50%', marginTop: '10%' }} resizeMode='contain' />

                    </TouchableOpacity>
                </View>

                {/* <View style={{borderLeftWidth: 10,borderLeftColor: "#0F57A9",}}> */}
                <Text style={{ color: '#0F94BD', textAlign: "center" }}>Hosted by</Text>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row" }}>
                    <Image source={require('../images/CaR.png')} style={{ width: 65, height: 70 }} />
                    <Image source={require('../images/CW.png')} style={{ width: 120, height: 80, marginLeft: 20 }} />
                </View>
                {/* </View> */}
            </View>

        </View>
    )
}

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})