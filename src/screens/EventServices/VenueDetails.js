import React, { useState, useEffect } from 'react'
import {
    View, Text, StyleSheet, RefreshControl, TouchableOpacity, TextInput, ImageBackground, ScrollView, Dimensions,
    ActivityIndicator, Platform
} from 'react-native';
import { MaterialIcons, Feather, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Ring from '../ChatRoom/Ring';



const VenueDetails = (props) => {
    const [venue, setVenue] = useState({});
    const [User, setUser] = useState({});
    const [UserId, setUserId] = useState({});
    const [EventsOnVenue, setEventsOnVenue] = useState({});
    const { width } = useWindowDimensions()
    const [comment, setComment] = useState('')
    const [VenueId, setVenueId] = useState('')
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


    const rate = async () => {
        const Token = await AsyncStorage.getItem('token')
        var rateQuery = `
        mutation RateVenue{
            rateVenue(RatingInput:{
              comment:${JSON.stringify(comment)},
              createdDate:${JSON.stringify(new Date())},
              rate:${defaultRating},
              user:${JSON.stringify(UserId)}
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
                    const getVenue = `
                    {
                        venue(id:${JSON.stringify(props.route.params.id)})
                        {id,name,thumbnail,description,venueInfo{locationLink},rating{rate,rating{user{id}}}}
                    }
                    `
                    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                        body: JSON.stringify({ query: getVenue })
                    }).then(response => response.json())
                        .then(data => setVenue(data.data.venue))
                }
            })
    }


    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        const userid = await AsyncStorage.getItem('id')
        const id = await AsyncStorage.getItem('id')
        setUserId(id)
        const getForums = `
        {
            forumsByvenue(venueId:${JSON.stringify(props.route.params.id)})
            {
              name,
              description,
            }
        }
        `
        const getVenue = `
        {
            venue(id:${JSON.stringify(props.route.params.id)})
            {id,name,thumbnail,description,venueInfo{locationLink},rating{rate,rating{user{id}}}}
        }
        `
        setUser(userid)
        console.log(getForums)

        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: getForums })
        }).then(response => response.json())
            .then(data => setEventsOnVenue(data.data.forumsByvenue))

        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: getVenue })
        }).then(response => response.json())
            .then(data => setVenue(data.data.venue))
    }, [props.navigation])

    return (

        <View style={{ backgroundColor: 'white' }}>

            <View style={{ width: '100%', backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{ width: '20%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={26} color="white" />
                </TouchableOpacity>
                <View style={{ width: '60%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>{venue.name}</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>
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

            <View style={{ height: windowHeight * 7 / 9 }}>

                <ImageBackground source={{ uri: venue.thumbnail }} style={styles.container} imageStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, height: windowHeight / 5 }}>
                </ImageBackground>

                <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: windowHeight / 5, height: windowHeight, marginHorizontal: 10, }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                    {JSON.stringify(venue) != '{}' ? (
                        <>
                            {/* {venue.rating.rate > 0 ? (

                                <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                    {Array(Math.floor(venue.rating.rate)).fill().map(element => <Ionicons name="star" size={16} color='#E0A100' />)}
                                    <Text>{parseFloat(venue.rating.rate) - Math.floor(venue.rating.rate) > 0 && <Ionicons name="star-half-sharp" size={16} color='#E0A100' />}</Text>
                                    <Text style={{ marginLeft: 5, color: 'black' }}>{venue.rating.rate} stars</Text>
                                </View>
                            ) : (
                                <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                    <Text style={{ marginLeft: 5, color: 'black' }}>{venue.rating.rate} stars</Text>
                                </View>
                            )} */}
                            {checkRating(venue.rating.rating, UserId) ? (
                                <Text style={{ marginTop: 5, color: "#0771b8" }}>You've rated this Venue</Text>
                            ) : (
                                <TouchableOpacity onPress={() => { setisVisible(true); setVenueId(venue.id) }}>
                                    <Text style={{ marginBottom: 10, textDecorationLine: 'underline', color: "#0771b8" }}>Rate this Venue</Text>
                                </TouchableOpacity>
                            )}
                            <RenderHtml
                                contentWidth={width}
                                source={{
                                    html: `
                            ${venue.description}`
                                }}
                            />
                        </>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <ActivityIndicator size='large' color='black' />
                        </View>
                    )}

                </ScrollView>





                <View style={{ backgroundColor: "#b4b4b4", marginTop: 10, marginHorizontal: 10, height: 50, justifyContent: "center" }}>

                    <Text style={{ marginHorizontal: 10, fontSize: 18, fontWeight: "bold", color: "#000" }}> Events</Text>

                </View>
                <ScrollView style={{ marginTop: 15, height: windowHeight, marginHorizontal: 10, }}>
                    {JSON.stringify(EventsOnVenue) != "{}" ?
                        (
                            EventsOnVenue.length > 0 ? (
                                EventsOnVenue.length > 0 && EventsOnVenue.map(event => {

                                    return (

                                        <>

                                            <View key={event.id} >

                                                <Text style={{ fontWeight: "bold" }}>{event.name}</Text>
                                                <View style={{ flexDirection: "row", }}>
                                                    {JSON.stringify(EventsOnVenue) != "{}" ? (<RenderHtml
                                                        contentWidth={width}
                                                        source={{
                                                            html: `
                                                             ${event.description}`
                                                        }}
                                                    />) : (<Text style={{ marginTop: 40 }}>No  Info yet...</Text>)}

                                                </View>

                                            </View>
                                        </>

                                    )
                                }
                                )
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No Event on this venue...</Text>
                                </View>
                            )) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                <ActivityIndicator size='large' color='#0771b8' />
                            </View>
                        )

                    }
                </ScrollView>



            </View>

            <TouchableOpacity style={{
                backgroundColor: "#12a58f",
                width: "100%",
                alignContent: "center",
                justifyContent: "center",
                alignItems: "center",
                height: 50,
                marginTop: "1%"
            }} onPress={() => { props.navigation.navigate('Map', { 'link': venue.venueInfo.locationLink }) }}>
                <Text style={{ color: "#fff", fontSize: 20, textAlign: "center" }}>Get Direction</Text>
            </TouchableOpacity>

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

        </View>


    )
}

export default VenueDetails

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
        marginTop: 10,
        justifyContent: "center",
        alignContent: "center"
    },
    locate: {
        marginTop: "20%",
        backgroundColor: 'rgba(52, 52, 52, 0.6)'
    },
    word: {
        fontSize: 15,
        color: "#fff",
        fontWeight: "bold",
        height: 30
    }
})