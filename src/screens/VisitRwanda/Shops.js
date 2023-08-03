import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, StatusBar, ScrollView, Dimensions, TextInput, ActivityIndicator, Image, RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons, Fontisto } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ring from '../ChatRoom/Ring';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Shops = ({ navigation }) => {
    const [tab, setTab] = useState("art");


    const [Shop, setShop] = useState({});
    const [Shop_, setShop_] = useState({});

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
                setShop(data.data.venuesByCategoy); setShop_(data.data.venuesByCategoy)
            })
    }

    useEffect(async () => {
        changeForum("ART_CRAFT")


    }, [])
    const searchContact = (value) => {
        const filteredlocations = Shop_.filter(
            locations => {
                let locationsLowercase = (locations.name).toLowerCase()
                let searchTermLowercase = value.toLowerCase()
                return locationsLowercase.indexOf(searchTermLowercase) > -1
            }
        )
        setShop(filteredlocations);
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Shop Around Rwanda</Text>
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
                <TouchableOpacity onPress={() => { changeForum("ART_CRAFT"); setTab('art') }}
                    style={{ width: "50%", height: '100%', backgroundColor: tab === "art" ? '#0A2133' : '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                    <FontAwesome name="paint-brush" size={24} style={{ color: tab === "art" ? '#fff' : '#000' }} />
                    <Text style={{ color: tab === "art" ? '#fff' : '#000' }}>Art & Crafts</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { changeForum("SHOPPING_MALL"); setTab('mall') }}
                    style={{ width: "50%", height: '100%', backgroundColor: tab === "mall" ? '#0A2133' : '#ebebeb', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Fontisto name="shopping-store" size={24} style={{ color: tab === "mall" ? '#fff' : '#000' }} />
                    <Text style={{ color: tab === "mall" ? '#fff' : '#000' }}>Shopping Malls</Text>
                </TouchableOpacity>
            </View>


            <ScrollView style={{ height: (windowHeight * 7 / 8) - 100 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {
                    JSON.stringify(Shop) != "{}" ?
                        (
                            Shop.length > 0 ? (
                                Shop.length > 0 && Shop.map(art => {

                                    return (
                                        <View style={{ flexDirection: 'row' }}>
                                            <View key={art.id} style={{ width: '30%', alignItems: 'center', marginTop: '6%', marginBottom: "5%" }}>
                                                <Image source={{ uri: art.thumbnail }}
                                                    resizeMode="cover"
                                                    style={{ width: windowWidth / 4, height: 110, borderBottomLeftRadius: 10, borderTopLeftRadius: 10, overflow: "hidden" }}
                                                />
                                            </View>

                                            <View style={{ borderBottomColor: 'grey', borderBottomWidth: 0.3, width: "70%" }}>
                                                <View style={{ justifyContent: 'center' }}>
                                                    <View style={{ marginTop: '5%', marginBottom: "3%" }}>
                                                        <Text style={{ color: "#000", fontWeight: "bold", fontSize: 15, marginBottom: 5 }}>
                                                            {art.name}
                                                        </Text>
                                                        {art.venueInfo.venueLocationName !== null ? (

                                                            <Text style={{ color: "#4d4d4d", marginTop: 2 }}><Text style={{ fontWeight: "bold" }}>Location</Text> : {art.venueInfo.venueLocationName}</Text>
                                                        ) : (
                                                            <></>

                                                        )}

                                                        {art.venueInfo.contactPhone !== "" ? (

                                                            <Text style={{ color: "#4d4d4d", marginTop: 2 }}><Text style={{ fontWeight: "bold" }}>Contact</Text> : {art.venueInfo.contactPhone}</Text>
                                                        ) : (<></>)}


                                                    </View>
                                                </View>
                                                {art.venueInfo.locationLink !== null ? (

                                                    <TouchableOpacity style={{ justifyContent: 'center', marginBottom: 10 }}
                                                        onPress={() => { navigation.navigate('Map', { 'link': art.venueInfo.locationLink, 'name': art.name }) }}>
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
                                    <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No {tab} shop yet...</Text>
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

export default Shops;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})