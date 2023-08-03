import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, Platform, ActivityIndicator,RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html'
import Ring from '../../ChatRoom/Ring';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const ProgramDetails = (props) => {
    const [programme, setProgramme] = useState({})
    const { width } = useWindowDimensions()
    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const programmeQuery =
        `{
        programme(id:${JSON.stringify(props.route.params.id)})
    {
        title,
        description,
        rating{rate},
        room{name},
        endDate,
        startDate,
        broadcastLink,
        speakers{id,firstName,lastName,category,avatar,biography,title,rating{rate}},
        moderator{id,firstName,lastName,category,avatar,biography,title,rating{rate}}
    }
    }`
    const addDigit = (num) => {
        if (JSON.stringify(num).length > 1) {
            return JSON.stringify(num)
        }
        else {
            return '0' + num
        }
    }

    const findDay = (num) => {
        if (num == 0) {
            return 'Sunday'
        }
        else if (num == 1) {
            return 'Monday'
        }
        else if (num == 2) {
            return 'Tuesday'
        }
        else if (num == 3) {
            return 'Wednesday'
        }
        else if (num == 4) {
            return 'Thursday'
        }
        else if (num == 5) {
            return 'Friday'
        }
        else if (num == 6) {
            return 'Saturday'
        }
    }

    const findMonth = (num) => {
        if (num == 0) {
            return 'January'
        }
        else if (num == 1) {
            return 'February'
        }
        else if (num == 2) {
            return 'March'
        }
        else if (num == 3) {
            return 'April'
        }
        else if (num == 4) {
            return 'May'
        }
        else if (num == 5) {
            return 'June'
        }
        else if (num == 6) {
            return 'July'
        }
        else if (num == 7) {
            return 'August'
        }
        else if (num == 8) {
            return 'September'
        }
        else if (num == 9) {
            return 'October'
        }
        else if (num == 10) {
            return 'November'
        }
        else if (num == 11) {
            return 'December'
        }

    }

    useEffect(async () => {
        console.log(programmeQuery)
        const Token = await AsyncStorage.getItem('token')
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: programmeQuery })
        }).then(response => response.json())
            .then(data => setProgramme(data.data.programme))
    }, [])
    return (
        <View style={{backgroundColor:'white'}}>
            <StatusBar
                backgroundColor="#0A2133"
                barStyle='light-content'
                translucent={false}
            />
            <View style={{ width: windowWidth, backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Program Details</Text>
                </View>
                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('Notifications') }} style={{ marginRight: '5%' }}>
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

            {JSON.stringify(programme) != "{}" ? (
                <View>
                    {(programme.broadcastLink !== null && programme.broadcastLink !== undefined && programme.broadcastLink !== "") && (

                        <View style={{ justifyContent: 'space-between', marginTop: 0.5, height: 50, width: "100%" }}>
                            <TouchableOpacity onPress={() => { props.navigation.navigate('Broadcast', { 'link': programme.broadcastLink }) }} style={{ width: "100%", height: '100%', backgroundColor: '#EBEBEB', alignItems: 'center', justifyContent: 'center' }}>
                                <Feather name="airplay" size={24} color="#4d4d4d" />
                                <Text style={{ color: '#4d4d4d' }}>Broadcast</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                    <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: 2, height: 50, width: "100%" }}>
                        <TouchableOpacity  style={{ width: "50%", height: '100%', backgroundColor: '#0A2133', alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>Descriptions</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { props.navigation.navigate('ProgramSpeaker', { 'speakerid': programme.speakers, 'moderatorid': programme.moderator }) }} style={{ width: "50%", height: '100%', backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
                            <Text style={{ color: '#4d4d4d' }}>Speakers</Text>
                        </TouchableOpacity>
                    </View>



                    <ScrollView style={{ height: (windowHeight * 7 / 8) - 62, marginTop: 10 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                        <Text style={{ fontSize: 15, fontWeight: "bold", marginHorizontal: 20, letterSpacing: 2, color: "#4d4d4d" }}>{programme.title}</Text>
                        <View style={{ marginHorizontal: 20 }}>

                            <Text style={{ color: "#6A7A8A", fontWeight: "bold" }}>{findDay(new Date(programme.startDate).getDay())} {new Date(programme.startDate).getDate()} {findMonth(new Date(programme.startDate).getMonth())} {new Date(programme.startDate).getUTCHours() +2 }:{addDigit(new Date(programme.startDate).getMinutes())}-{new Date(programme.endDate).getUTCHours()+2}:{addDigit(new Date(programme.endDate).getMinutes())}</Text>
                            {/* {programme.rating.rate > 0 ? (

                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    {Array(Math.floor(programme.rating.rate)).fill().map(element => <Ionicons name="star" size={16} color='#E0A100' />)}
                                    <Text>{parseFloat(programme.rating.rate) - Math.floor(programme.rating.rate) > 0 && <Ionicons name="star-half-sharp" size={16} color='#E0A100' />}</Text>
                                    <Text style={{ marginLeft: 5 }}>{programme.rating.rate} stars</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Text style={{ marginLeft: 5}}>{programme.rating.rate} stars</Text>
                                </View>
                            )} */}
                            <View style={{ flexDirection: "row" }}>
                                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                    
                                    <Ionicons name="location" size={15} color="#118AB2" />
                                    <Text style={{ color: "#118AB2" }}>{programme.room.name}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: '5%', width: '85%', justifyContent: 'center', marginHorizontal: 20 }}>
                            <View>
                                {JSON.stringify(programme) != "{}" ? (<RenderHtml
                                    contentWidth={width}
                                    source={{
                                        html: `
                            ${programme.description}`
                                    }}
                                />) : (<Text style={{ marginTop: 40 }}>No Info yet...</Text>)}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                    <ActivityIndicator size='large' color='#0771b8' />
                </View>
            )}


        </View>
    )
}

export default ProgramDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})