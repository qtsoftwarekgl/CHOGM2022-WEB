import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, TextInput, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ring from '../ChatRoom/Ring';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Dining = ({ navigation }) => {

    const [tab, setTab] = useState("restaurant");
    const [Dining, setDining] = useState({});
    const [Dining_, setDining_] = useState({});
    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);


    const changeForum = async (name) => {
        const Token = await AsyncStorage.getItem('token')
        const Location = `
    {
        venuesByCategoy(VenueCategoryInput:{
            category:${name}
        }
        ){
            id,
            name,
            thumbnail,
            shortDescription,
            venueInfo{
                venueWebsite,
                venueLocationName,
                contactPhone,
                locationLink
            },
            rating{
                rate,
                rating{user{id}}
            }

        }
    }
    `
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: Location })
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setDining(data.data.venuesByCategoy); setDining_(data.data.venuesByCategoy)
            })
    }

    useEffect(async () => {
        changeForum("RESTAURANT_VENUE")


    }, [])
    const searchContact = (value) => {
        const filteredlocations = Dining_.filter(
            locations => {
                let locationsLowercase = (locations.name).toLowerCase()
                let searchTermLowercase = value.toLowerCase()
                return locationsLowercase.indexOf(searchTermLowercase) > -1
            }
        )
        setDining(filteredlocations);
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Dine Around Rwanda</Text>
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


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, height: 50, width: "100%" }}>

                <TouchableOpacity onPress={() => { changeForum("RESTAURANT_VENUE"); setTab('restaurant') }}
                    style={{ width: "25%", height: '100%', backgroundColor: tab === "restaurant" ? '#0A2133' : '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="restaurant" size={24} style={{ color: tab === "restaurant" ? '#fff' : '#000' }} />
                    <Text style={{ color: tab === "restaurant" ? '#fff' : '#000' }}>Restaurants</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { changeForum("BAR_VENUE"); setTab('bar') }}
                    style={{ width: "25%", height: '100%', backgroundColor: tab === "bar" ? '#0A2133' : '#ebebeb', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="ios-beer-outline" size={24} style={{ color: tab === "bar" ? '#fff' : '#000' }} />
                    <Text style={{ color: tab === "bar" ? '#fff' : '#000' }}>Bars</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { changeForum("NIGHT_CLUB_VENUE"); setTab('club') }}
                    style={{ width: "25%", height: '100%', backgroundColor: tab === "club" ? '#0A2133' : '#ebebeb', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialIcons name="nightlife" size={24} style={{ color: tab === "club" ? '#fff' : '#000' }} />
                    <Text style={{ color: tab === "club" ? '#fff' : '#000' }}>Night Clubs</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { changeForum("COFFEE_SHOP_VENUE"); setTab('coffee shop') }}
                    style={{ width: "25%", height: '100%', backgroundColor: tab === "coffee shop" ? '#0A2133' : '#ebebeb', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Feather name="coffee" size={24} style={{ color: tab === "coffee shop" ? '#fff' : '#000' }} />
                    <Text style={{ color: tab === "coffee shop" ? '#fff' : '#000' }}>Coffee Shops</Text>
                </TouchableOpacity>

            </View>


            <ScrollView style={{ height: (windowHeight * 7 / 8) - 100 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {
                    JSON.stringify(Dining) != "{}" ?
                        (
                            Dining.length > 0 ? (
                                Dining.length > 0 && Dining.map(resto => {

                                    return (

                                        <View style={{ flexDirection: 'row' }}>
                                            <View key={resto.id} style={{ width: '30%', alignItems: 'center', marginTop: '6%', marginBottom: "5%" }}>
                                                <Image source={{ uri: resto.thumbnail }}
                                                    resizeMode="cover"
                                                    style={{ width: windowWidth / 4, height: 110, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, overflow: "hidden" }}
                                                />
                                            </View>

                                            <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.3, width: "70%" }}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <View style={{ marginTop: '5%', marginBottom: "3%" }}>
                                                        <Text style={{ color: "#000", fontWeight: "bold", fontSize: 15, marginBottom: 5 }}>
                                                            {resto.name}
                                                        </Text>
                                                        {resto.venueInfo.venueLocationName !== null ? (

                                                            <Text style={{ color: "#4d4d4d", marginTop: 2 }}><Text style={{ fontWeight: "bold" }}>Location</Text> : {resto.venueInfo.venueLocationName}</Text>
                                                        ) : (
                                                            <></>

                                                        )}

                                                        {resto.venueInfo.contactPhone !== "" ? (

                                                            <Text style={{ color: "#4d4d4d", marginTop: 2 }}><Text style={{ fontWeight: "bold" }}>Contact</Text> : {resto.venueInfo.contactPhone}</Text>
                                                        ) : (<></>)}


                                                    </View>
                                                </View>
                                                {resto.venueInfo.locationLink !== null ? (

                                                    <TouchableOpacity style={{ justifyContent: 'center', marginBottom: 10 }}
                                                        onPress={() => { navigation.navigate('Map', { 'link': resto.venueInfo.locationLink, 'name': resto.name }) }}>
                                                        <View style={{ backgroundColor: "#12a58f", width: "50%", alignContent: "center", justifyContent: "center", flexDirection: "row", alignItems: "center", height: 50, borderRadius: 20 }} >
                                                            <Text style={{ color: "#fff", fontSize: 17, textAlign: "center" }}>Get Directions</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <></>

                                                )}
                                            </View>
                                        </View>

                                    )
                                }
                                )
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No {tab} yet...</Text>
                                </View>
                            )) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                <ActivityIndicator size='large' color='#0771b8' />
                            </View>
                        )

                }


            </ScrollView >

        </View >
    )
}

export default Dining;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})