import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity, StatusBar, ScrollView, Dimensions, RefreshControl, ActivityIndicator, Platform } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';

const Notifications = ({ navigation }) => {
    const [Notifications, setNotifications] = useState('')
    const [userId, setUserId] = useState('')

    const [refreshing, setRefreshing] = useState(false);
    const checkHours=(hours)=>{
        if (hours>=24){
            return hours-24
        }
        else{
            return hours
        }
    }
    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);


    useEffect(async () => {

        const id = await AsyncStorage.getItem('id')
        console.log(id)
        const Token = await AsyncStorage.getItem('token')
        const query = `
    {
        notificationsByUser(userId:${JSON.stringify(id)}){
          id,
          content,
          type,
          createdDate,
          seen
        }
      }`
        setUserId(id)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: query })
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setNotifications(data.data.notificationsByUser)
            })
    }, [])


    const Markasread = async (notid) => {
        const Token = await AsyncStorage.getItem('token')
        const id = await AsyncStorage.getItem('id')
        console.log("IOS user")
        const updatingseen = `
          mutation updateseens{updateNotification(UpdateSeenNotificationInput:{
            notificationIds:[${JSON.stringify(notid)}],
          })}`

        console.log(updatingseen)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: updatingseen })
        }).then(response => response.json())
            .then(data => {
                console.log("Logs data")
                console.log(data)
                if (data.errors) {
                    alert(data.errors[0].message)
                }
                else {
                    const query = `
                    {
                        notificationsByUser(userId:${JSON.stringify(id)}){
                        id,
                        content,
                        type,
                        createdDate,
                        seen
                        }
                    }`
                    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                        body: JSON.stringify({ query: query })
                    }).then(response => response.json())
                        .then(data => {
                            console.log(data)
                            setNotifications(data.data.notificationsByUser)
                            navigation.navigate('Chat')
                        })
                }
            })
    }


    const markread = async (notid, content) => {
        const Token = await AsyncStorage.getItem('token')
        const id = await AsyncStorage.getItem('id')
        console.log("IOS user")
        const updatingseen = `
          mutation updateseens{updateNotification(UpdateSeenNotificationInput:{
            notificationIds:[${JSON.stringify(notid)}],
          })}`

        console.log(updatingseen)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: updatingseen })
        }).then(response => response.json())
            .then(data => {
                console.log("Logs data")
                console.log(data)
                if (data.errors) {
                    alert(data.errors[0].message)
                }
                else {
                    const query = `
                                    {
                                        notificationsByUser(userId:${JSON.stringify(id)}){
                                        id,
                                        content,
                                        type,
                                        createdDate,
                                        seen
                                        }
                                    }`
                    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                        body: JSON.stringify({ query: query })
                    }).then(response => response.json())
                        .then(data => {
                            console.log(data)
                            setNotifications(data.data.notificationsByUser)
                            Alert.alert('Broadcast', `${content}`, [
                                {
                                    text: 'OK',
                                    onPress: () => null,
                                    style: 'cancel',
                                },
                            ]);
                        })
                }
            })
    }

    const addDigit = (num) => {
        if (JSON.stringify(num).length > 1) {
            return JSON.stringify(num)
        }
        else {
            return '0' + num
        }
    }

    return (
        <View>
            <StatusBar
                backgroundColor="#0A2133"
                barStyle='light-content'
                translucent={false}
            />
            <View style={{ width: windowWidth, backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Notifications</Text>
                </View>
                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>
                    {Platform.OS === 'ios' ? (
                        <></>

                    ) : (

                        <TouchableOpacity onPress={() => { navigation.navigate('Profile') }} style={{ marginLeft: '5%' }}>
                            <MaterialIcons name="coronavirus" size={24} color="white" />
                        </TouchableOpacity>

                    )}
                </View>

            </View>
            <ScrollView style={{ height: windowHeight * 7 / 8}} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {JSON.stringify(Notifications) != "{}" ?
                    (
                        Notifications.length > 0 ? (
                            Notifications.length > 0 && Notifications.map(notification => {

                                return (
                                    <View
                                        style={{
                                            borderRadius: 8,
                                            marginTop: 20,
                                            width: "97%",
                                            marginHorizontal: 5,
                                            backgroundColor: "#fff",
                                            ...styles.shadow
                                        }} >

                                        {
                                            notification.type === "NEW_CHAT_PARTICIPANT" ? (
                                                <TouchableOpacity onPress={() => { Markasread(notification.id) }} style={{ flexDirection: 'row', marginBottom: 20, padding:10 }}>

                                                    <View style={{ marginBottom: 5, width: "85%" }}>
                                                        <Text style={{ fontSize: 16, color: '#707070' }}>{notification.content}</Text>
                                                        <Text style={{ fontSize: 16, color: '#707070' }}>{new Date(notification.createdDate).getDate()}/{new Date(notification.createdDate).getMonth() + 1}/{new Date(notification.createdDate).getFullYear()} - {addDigit(checkHours(new Date(notification.createdDate).getUTCHours() +2))}:{addDigit(new Date(notification.createdDate).getMinutes())}</Text>
                                                    </View>

                                                    {notification.seen === false ? (
                                                        <View style={{ marginBottom: 5, width: "15%" }}>
                                                            <View style={{ height: 14, borderRadius: 5, backgroundColor: '#d00000', justifyContent: "center", alignItems: "center" }}>
                                                                <Text style={{ fontSize: 8, fontWeight: "900", color: "#fff", marginHorizontal: 3 }}>NEW</Text>
                                                            </View>
                                                        </View>

                                                    ) : (<></>)}

                                                </TouchableOpacity>

                                            ) : (
                                                <TouchableOpacity onPress={() => { markread(notification.id, notification.content) }} style={{ flexDirection: 'row', marginBottom: 20,padding:10 }}>

                                                    <View style={{ marginBottom: 5, width: "85%" }}>
                                                        <Text style={{ fontSize: 16, color: '#707070' }}>{notification.content}</Text>
                                                        <Text style={{ fontSize: 16, color: '#707070' }}>{new Date(notification.createdDate).getDate()}/{new Date(notification.createdDate).getMonth() + 1}/{new Date(notification.createdDate).getFullYear()} - {addDigit(checkHours(new Date(notification.createdDate).getUTCHours() +2))}:{addDigit(new Date(notification.createdDate).getMinutes())}</Text>
                                                    </View>

                                                    {notification.seen === false ? (
                                                        <View style={{ marginBottom: 5, width: "15%" }}>
                                                            <View style={{ height: 14, borderRadius: 5, backgroundColor: '#d00000', justifyContent: "center", alignItems: "center" }}>
                                                                <Text style={{ fontSize: 8, fontWeight: "900", color: "#fff", marginHorizontal: 3 }}>NEW</Text>
                                                            </View>
                                                        </View>

                                                    ) : (<></>)}


                                                </TouchableOpacity>
                                            )
                                        }

                                    </View>

                                )
                            }
                            )
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No notifications...</Text>
                            </View>
                        )) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <ActivityIndicator size='large' color='#0771b8' />
                        </View>
                    )

                }

            </ScrollView>

        </View>
    )
}

export default Notifications;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
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
        marginTop: -15
    }
})