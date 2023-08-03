import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ActivityIndicator, Dimensions, ScrollView, Platform, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ring from '../ChatRoom/Ring';


import { FontAwesome, FontAwesome5, Ionicons, Foundation, Entypo, MaterialIcons } from '@expo/vector-icons';
const Forums = (props) => {
    const [Forums, setForums] = useState({});
    const windowHeight = Dimensions.get('window').height;
    const windowWidth = Dimensions.get('window').width;

    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const query = `
    {
        forums{
            id,
            name,
            thumbnail,
            startDate,
            endDate,
            venue{
                id,
                name
            }

        }
    }
    `
    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: query })
        }).then(response => response.json())
            .then(data => {
                const srt = data.data.forums.sort((a,b) => a.startDate.localeCompare(b.startDate))
                setForums(data.data.forums)
            })
    }, [])
    return (
        <View styles={styles.container}>
            <StatusBar
                backgroundColor="#0A2133"
                barStyle='light-content'
                translucent={false}
            />
            <View style={{ width: '100%', backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Events</Text>
                </View>
                <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('Notifications') }} style={{ marginRight: '5%' }}>
                        <Ring />
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                        <></>

                    ) : (

                        <TouchableOpacity onPress={() => { props.navigation.navigate('Profile') }} style={{ marginLeft: '5%' }}>
                            <MaterialIcons name="coronavirus" size={24} color="white" />
                        </TouchableOpacity>

                    )}
                </View>

            </View>

            <ScrollView style={{ height: (windowHeight * 7 / 8) - 120, backgroundColor: "#fff" }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {JSON.stringify(Forums) != "{}" ?
                    (
                        Forums.length > 0 ? (
                            Forums.length > 0 && Forums.map(forum => {

                                return (
                                    <>
                                        <View key={forum.id} style={{ flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 0.3, marginTop: 20 }}>
                                            <TouchableOpacity onPress={() => { props.navigation.navigate('Aboutforum', { 'id': forum.id }) }} style={{ width: '50%', justifyContent: 'center', alignItems: 'center', marginBottom: 25 }}>
                                                <Image source={{ uri: forum.thumbnail }} resizeMode='contain' style={{ width: windowWidth, height: windowHeight / 10 }} />
                                            </TouchableOpacity>

                                            <View style={{ width: '50%', paddingRight: '5%' }}>
                                                <TouchableOpacity onPress={() => { props.navigation.navigate('Aboutforum', { 'id': forum.id }) }} style={{ flexDirection: 'row', }}>
                                                    <Foundation name="clipboard-notes" size={18} color="grey" />
                                                    <Text style={{ color: "#6A7A8A", marginLeft: 10 }}>{forum.name}</Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => { props.navigation.navigate('Programs', { 'forumId': forum.id, 'forumName': forum.name }) }} style={{ flexDirection: 'row', marginTop: '6%' }}>
                                                    <Entypo name='briefcase' size={18} color="grey" />
                                                    <Text style={{ color: "#6A7A8A", marginLeft: 5 }}>Programs</Text>
                                                </TouchableOpacity>
                                                {forum.venue.id ? (
                                                    <TouchableOpacity onPress={() => props.navigation.navigate('VenueDetails', { 'id': forum.venue.id })} style={{ flexDirection: 'row', marginTop: '6%' }}>
                                                        <Entypo name='location-pin' size={18} color="grey" />
                                                        <Text style={{ color: "#6A7A8A", marginLeft: 5 }}>Venue</Text>
                                                    </TouchableOpacity>

                                                ) : (

                                                    <View style={{ flexDirection: 'row', marginTop: '6%' }}>
                                                        <Entypo name='location-pin' size={18} color="grey" />
                                                        <Text style={{ color: "#6A7A8A", marginLeft: 5 }}>No Venue</Text>
                                                    </View>

                                                )}
                                            </View>
                                        </View>

                                    </>
                                )
                            }
                            )
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No Event yet...</Text>
                            </View>
                        )) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <ActivityIndicator size='large' color='#0771b8' />
                        </View>
                    )

                }

            </ScrollView>

            <Text style={{ color: '#0F94BD', textAlign: "center", backgroundColor: "#fff" }}>Hosted by</Text>
            <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: "row", backgroundColor: "#fff" }}>
                <Image source={require('../../images/CaR.png')} style={{ width: 65, height: 70 }} />
                <Image source={require('../../images/CW.png')} style={{ width: 120, height: 75, marginLeft: 20 }} />
            </View>




        </View>
    )
}

export default Forums;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})