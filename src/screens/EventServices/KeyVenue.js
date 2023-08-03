import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ImageBackground, ScrollView, Dimensions, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ring from '../ChatRoom/Ring';




const KeyVenue = (props) => {
    const [Venues, setVenues] = useState({});
    const [Venues_, setVenues_] = useState({});

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
        venuesByCategoy(VenueCategoryInput:{
            category:EVENT_VENUE
        }
        ){
            id,
            name,
            thumbnail,
            shortDescription,
            venueInfo{
                venueWebsite,
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
            .then(data => { setVenues(data.data.venuesByCategoy); setVenues_(data.data.venuesByCategoy) })
    }, [])


    const searchContact = (value) => {
        const filteredAccomdations = Venues_.filter(
            Venue => {
                let VenueLowercase = (Venue.name).toLowerCase()
                let searchTermLowercase = value.toLowerCase()
                return VenueLowercase.indexOf(searchTermLowercase) > -1
            }
        )
        setVenues(filteredAccomdations);
    }

    return (
        <View>

            <View style={{ width: '100%', backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={26} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Key Venues</Text>
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


            <View style={{ flexDirection: 'row' }}>
                <View style={{ width: windowWidth / 7, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EBEBEB' }}>
                    <FontAwesome5 name="search" size={24} color='#4d4d4d' />
                </View>
                <View style={{ width: windowWidth * 6 / 7, justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput style={{
                        width: '100%',
                        paddingHorizontal: 16,
                        paddingVertical: 6,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        backgroundColor: "#EBEBEB",
                        alignItems: "center",
                        color: '#6D7A88',
                        height: 50,
                        fontSize: windowWidth / 25
                    }}
                        onChangeText={(value) => { searchContact(value) }}
                        placeholder="Search by name"
                        placeholderTextColor={'#4d4d4d'}
                    >


                    </TextInput>
                </View>
            </View>
            <ScrollView style={{ height: (windowHeight * 7 / 8) - 80 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {JSON.stringify(Venues) != "{}" ?
                    (
                        Venues.length > 0 ? (
                            Venues.length > 0 && Venues.map(venue => {

                                return (

                                    <TouchableOpacity key={venue.id} onPress={() => props.navigation.navigate('VenueDetails', { 'id': venue.id })}>

                                        <ImageBackground source={{ uri: venue.thumbnail }} style={styles.container} imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, }}>

                                            <TouchableOpacity style={styles.locate}
                                                onPress={() => props.navigation.navigate('VenueDetails', { 'id': venue.id })}
                                            >

                                                <Text style={styles.word}> {venue.name}</Text>
                                                <Text style={{ fontSize: 15, color: "#b4b4b4" }}> {venue.venueInfo.venueWebsite}</Text>
                                            </TouchableOpacity>

                                        </ImageBackground>
                                    </TouchableOpacity>


                                )
                            }
                            )
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No Venues yet...</Text>
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

export default KeyVenue

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
        marginTop: 10,
    },
    locate: {
        marginTop: "33%",
        backgroundColor: 'rgba(48, 48, 45, 0.8)'
    },
    word: {
        fontSize: 15,
        color: "#fff",
        fontWeight: "bold"
    }
})