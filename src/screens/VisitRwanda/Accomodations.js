import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, TextInput, ActivityIndicator, Linking, Platform,RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Ring from '../ChatRoom/Ring';
import ReadMore from '@fawazahmed/react-native-read-more';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Accomodations = ({ navigation }) => {
    const [Venues, setVenues] = useState({});
    const [Venues_, setVenues_] = useState({});
    const [comment, setComment] = useState('')
    const [VenueId, setVenueId] = useState('')
    const [userId, setUserId] = useState('')
    const [defaultRating, setDefaultRating] = useState(0)
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5])
    const [isVisible, setisVisible] = useState(false)

    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
      };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);


    const CustomRatingBar = () => {
        return (
            <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                {maxRating.map((item, key) => {
                    return (
                        <TouchableOpacity key={key} onPress={() => { setDefaultRating(item) }}>
                            <Ionicons color={item <= defaultRating ? '#ffd087' : '#1d2534'} size={40} name="star" />
                        </TouchableOpacity>
                    )
                })}
            </View>
        )
    }

    const checkRating = (array, user_id) => {
        var status = false;
        array.map(item => {
            if (item.user.id === user_id) {
                status = true
            }
        })
        console.log(status)
        return status
    }

    const query = `
    {
        venuesByCategoy(VenueCategoryInput:{
            category:HOTEL_APARTMENT_VENUE
        }
        ){
            id,
            name,
            thumbnail,
            shortDescription,
            venueInfo{
                venueWebsite,
                venueLocationName,
                locationLink
            },
            rating{
                rate,
                rating{user{id}}
            }

        }
    }
    `
    const rate = async () => {
        const Token = await AsyncStorage.getItem('token')
        var rateQuery = `
        mutation RateVenue{
            rateVenue(RatingInput:{
              comment:${JSON.stringify(comment)},
              createdDate:${JSON.stringify(new Date())},
              rate:${defaultRating},
              user:${JSON.stringify(userId)}
            },venueId:${JSON.stringify(VenueId)}){
              id,
              rating{
                rate
              }
            }
          }
        `
        console.log(rateQuery)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: rateQuery })
        }).then(response => response.json())
            .then(async (data) => {
                setVenueId('')
                setComment('')
                console.log(data)
                setisVisible(false)
                if (data.errors) {
                    alert('Something went wrong')
                }
                else {
                    alert('Your rate is recorded successfully!')

                    const Token = await AsyncStorage.getItem('token')
                    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                        body: JSON.stringify({ query: query })
                    }).then(response => response.json())
                        .then(data => { setVenues(data.data.venuesByCategoy); setVenues_(data.data.venuesByCategoy) })
                }
            })
    }

    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        const id = await AsyncStorage.getItem('id')
        setUserId(id)
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Hotel & Apartments</Text>
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


            <ScrollView style={{ height: (windowHeight * 7 / 8) - 50 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {JSON.stringify(Venues) != "{}" ?
                    (
                        Venues.length > 0 ? (
                            Venues.length > 0 && Venues.map(venue => {

                                return (

                                    <View key={venue.id} style={{ flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 0.3 }}>
                                        <View style={{ width: '30%', alignItems: 'center', marginTop: '6%', marginBottom: "5%" }}>
                                            <Image source={{ uri: venue.thumbnail }}
                                                resizeMode="cover"
                                                style={{ width: windowWidth / 4, height: 110, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: "hidden" }}
                                            />
                                        </View>
                                        <View style={{ width: '70%', justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 10 }}>
                                            <View style={{ marginTop: '9%',marginHorizontal:10 }}>
                                                <Text style={{ color: "#000", fontWeight: "bold" }}>
                                                    {venue.name}
                                                </Text>
                                                <View style={{paddingRight:10}}>
                                                    <ReadMore seeMoreContainerStyleSecondary={{ position: 'relative' }} seeMoreStyle={{ color: '#0771b8' }} seeLessStyle={{ color: '#0771b8' }} numberOfLines={3} style={styles.textStyle}>
                                                        {
                                                            venue.shortDescription
                                                        }
                                                    </ReadMore>
                                                    </View>

                                                {/* {venue.rating.rate > 0 ? (

                                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                        {Array(Math.floor(venue.rating.rate)).fill().map(element => <Ionicons name="star" size={16} color='#E0A100' />)}
                                                        <Text>{parseFloat(venue.rating.rate) - Math.floor(venue.rating.rate) > 0 && <Ionicons name="star-half-sharp" size={16} color='#E0A100' />}</Text>
                                                        <Text style={{ marginLeft: 5 }}>{venue.rating.rate} stars</Text>
                                                    </View>
                                                ) : (
                                                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                        <Text style={{ marginLeft: 5 }}>{venue.rating.rate} stars</Text>
                                                    </View>
                                                )} */}
                                                {checkRating(venue.rating.rating, userId) ? (
                                                    <Text style={{ marginTop: 5, color: "#0771b8" }}>You've rated this Venue</Text>
                                                ) : (
                                                    <TouchableOpacity onPress={() => { setisVisible(true); setVenueId(venue.id) }}>
                                                        <Text style={{ marginBottom: 5, textDecorationLine: 'underline', color: "#0771b8" }}>Rate this Venue</Text>
                                                    </TouchableOpacity>
                                                )}
                                                <View style={{ marginBottom: 8 }}>
                                                    {venue.venueInfo.locationLink !== null ? (

                                                        <TouchableOpacity style={{ flexDirection: 'row', marginRight: '10%', marginTop: '5%' }}
                                                            onPress={() => { navigation.navigate('Map', { 'link': venue.venueInfo.locationLink, 'name': venue.name }) }}
                                                        >
                                                            <Ionicons name="location" size={15} color="#118AB2" />
                                                            <Text style={{ color: "#6A7A8A" }}>{venue.venueInfo.venueLocationName}</Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <></>

                                                    )}

                                                    {venue.venueInfo.venueWebsite !== null ? (

                                                        <TouchableOpacity style={{ flexDirection: 'row', marginTop: '5%', alignItems: 'center', width: "90%" }}
                                                            onPress={() => { Linking.openURL(venue.venueInfo.venueWebsite) }}>
                                                            <Entypo name="mouse-pointer" size={15} color="#118AB2" style={{ marginRight: 5 }} />
                                                            <Text style={{ color: "#6A7A8A" }}>{venue.venueInfo.venueWebsite}</Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <></>

                                                    )}

                                                </View>

                                            </View>
                                        </View>


                                    </View>

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

                <Modal
                    isVisible={isVisible}
                    transparent={true}
                    animationType={'slide'}
                    hasBackdrop={true}
                    backdropColor={"#000"}
                    backdropOpacity={0.80}
                >


                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <>
                            <View style={{ width: '90%', backgroundColor: '#2b303b', borderRadius: 20 }}>
                                <View style={{ backgroundColor: "#1d2534", width: '100%', borderTopRightRadius: 20, borderTopLeftRadius: 20, marginLeft: 0, height: 60, justifyContent: "center", alignItems: "center" }}>
                                    <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Your opinion matters to us!</Text>
                                </View>
                                <Text style={{ color: "#7d7d7d", fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>Rate this venue</Text>
                                <View style={{ paddingHorizontal: 20 }}>
                                    <CustomRatingBar />
                                </View>

                                <View style={{ marginTop: 10, paddingHorizontal: 20, justifyContent: "center", alignItems: "center" }}>
                                    <TextInput
                                        numberOfLines={5}
                                        value={comment}
                                        multiline={true}
                                        placeholder="Leave us a message, if you want"
                                        placeholderTextColor="#7d7d7d"

                                        style={{ borderRadius: 10, width: '90%', height: 100, margin: 20, padding: 20, color: "white", backgroundColor: "#1d2534" }} onChangeText={(val) => { setComment(val) }} />
                                </View>

                                <View style={{ flexDirection: "row", borderTopColor: 'grey', borderTopWidth: 0.6, marginTop: 20, backgroundColor: "#1d2534", borderBottomRightRadius: 20, borderBottomLeftRadius: 20, }}>
                                    {/* Cancel */}
                                    <View style={{ width: "50%" }}>
                                        <TouchableOpacity onPress={() => { setisVisible(!isVisible); setDefaultRating(0) }}>
                                            <View style={{ height: 50, width: 100, width: '100%', alignItems: 'center', justifyContent: 'center', borderRightColor: 'grey', borderRightWidth: 0.5 }}>

                                                <Text style={{ color: 'white', fontSize: 20 }}>Maybe later</Text>

                                            </View>
                                        </TouchableOpacity>


                                    </View>
                                    {/* submit */}
                                    <View style={{ width: "50%" }}>
                                        <TouchableOpacity onPress={() => { rate() }}>
                                            <View style={{ height: 50, width: 100, width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                                                <Text style={{ color: 'white', fontSize: 20 }}>submit</Text>
                                            </View>
                                        </TouchableOpacity>


                                    </View>


                                </View>
                            </View>
                        </>
                    </View>




                </Modal>

            </ScrollView>

        </View>
    )
}

export default Accomodations;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})