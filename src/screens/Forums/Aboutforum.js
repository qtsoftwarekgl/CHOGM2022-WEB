import React, { useState, useEffect } from 'react'
import { TextInput, View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import RenderHtml from 'react-native-render-html';
import { useWindowDimensions } from 'react-native';
import Ring from '../ChatRoom/Ring';
import { WebView } from "react-native-webview";



const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Aboutforum = (props) => {
    const [comment, setComment] = useState('')
    const [userId, setUserId] = useState('')
    const [isVisible, setisVisible] = useState(false)
    const [Forum, setForum] = useState({});
    const { width } = useWindowDimensions()
    const [defaultRating, setDefaultRating] = useState(0)
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5])

    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

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
        mutation rateForum{
            rateForum(RatingInput:{
              comment:${JSON.stringify(comment)},
              createdDate:${JSON.stringify(new Date())},
              rate:${defaultRating},
              user:${JSON.stringify(userId)}
            },forumId:${JSON.stringify(props.route.params.id)}){
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
                setComment('')
                console.log(data)
                setisVisible(false)
                if (data.errors) {
                    alert('Something went wrong')
                }
                else {
                    alert('Your rate was recorded successfully!')
                    const Token = await AsyncStorage.getItem('token')

                    const getForum = `
        {
            forum(id:${JSON.stringify(props.route.params.id)})
            {
              name,
              description,
              thumbnail,
              rating{rate,rating{user{id}}},
              venue{id}
            }
        }
        `
                    console.log(props.route.params.id)

                    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                        body: JSON.stringify({ query: getForum })
                    }).then(response => response.json())
                        .then(data => setForum(data.data.forum))
                }
            })
    }



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

    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        const my_id = await AsyncStorage.getItem('id')
        setUserId(my_id)
        const getForum = `
        {
            forum(id:${JSON.stringify(props.route.params.id)})
            {
              name,
              description,
              thumbnail,
              rating{rate,rating{user{id}}}
              venue{id}
            }
        }
        `
        console.log(props.route.params.id)

        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: getForum })
        }).then(response => response.json())
            .then(data => setForum(data.data.forum))
    }, [])
    return (
        <View styles={styles.container}>
            <StatusBar
                backgroundColor="#0A2133"
                barStyle='light-content'
                translucent={false}
            />
            <View style={{ width: '100%', backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{ width: '12%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '68%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>About {Forum.name}</Text>
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>
                    <TouchableOpacity onPress={() => { props.navigation.navigate('Notifications') }} style={{ marginRight: '5%' }}>
                        <Ring />
                    </TouchableOpacity>
                    {Platform.OS === 'ios' ? (
                        <></>

                    ) : (

                        <TouchableOpacity onPress={() => { navigation.navigate('Profile') }} style={{ marginLeft: '5%', }}>
                            <MaterialIcons name="coronavirus" size={24} color="white" />
                        </TouchableOpacity>

                    )}
                </View>

            </View>

            <View style={{ alignItems: "center",  backgroundColor: "#fff" }}>

                <Image source={{ uri: Forum.thumbnail }} style={{ width: windowWidth / 1.1, height: windowHeight / 4.2 }} />
            </View>



            <ScrollView showsVerticalScrollIndicator={false} style={{ height: (windowHeight * 7 / 8) -( windowHeight / 4.2)-50, backgroundColor: "#fff" }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                <View style={{ marginTop: '2%', width: '85%', alignSelf: 'center' }}>
                    <View style={{ height: windowHeight / 1.8, marginTop: -10 }}>
                        {JSON.stringify(Forum) != "{}" ? (
                            <>
                                <WebView source={{ html: `<span style="font-size:55px;">${Forum.description}</span>` }}
                                />
                                {/* {Forum.rating.rate > 0 ? (

                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        {Array(Math.floor(Forum.rating.rate)).fill().map(element => <Ionicons name="star" size={16} color='#E0A100' />)}
                                        <Text>{parseFloat(Forum.rating.rate) - Math.floor(Forum.rating.rate) > 0 && <Ionicons name="star-half-sharp" size={16} color='#E0A100' />}</Text>
                                        <Text style={{ marginLeft: 5, color: 'black' }}>{Forum.rating.rate} stars</Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Text style={{ marginLeft: 5, color: 'black' }}>{Forum.rating.rate} stars</Text>
                                    </View>
                                )} */}
                                {checkRating(Forum.rating.rating, userId) ? (
                                    <Text style={{  color: "#0771b8" }}>You've rated this Forum</Text>
                                ) : (
                                    <TouchableOpacity onPress={() => { setisVisible(true) }}>
                                        <Text style={{  textDecorationLine: 'underline', color: "#0771b8" }}>Rate this Forum</Text>
                                    </TouchableOpacity>
                                )}
                            </>

                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                                <ActivityIndicator size='large' color='#0771b8' />
                            </View>
                        )}
                    </View>

                </View>



            </ScrollView>

            <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center", backgroundColor: "#fff",height: 50,paddingTop:0 }}>
                {Forum.venue && Forum.venue.id ? (
                    <TouchableOpacity onPress={() => { props.navigation.navigate('VenueDetails', { 'id': Forum.venue.id }) }} style={{ flexDirection: 'row',  }}>
                        <Entypo name='location-pin' size={18} color="grey" />
                        <Text style={{ color: "#6A7A8A", marginLeft: 5 }}>Venue</Text>
                    </TouchableOpacity>
                ) : (

                    <View style={{ flexDirection: 'row', marginTop: '9%', }}>
                        <Entypo name='location-pin' size={18} color="grey" />
                        <Text style={{ color: "#6A7A8A", marginLeft: 5 }}>No Venue</Text>
                    </View>

                )}

                <TouchableOpacity onPress={() => { props.navigation.navigate('Programs') }} style={{ flexDirection: 'row',  marginLeft: 20 }}>
                    <Entypo name='briefcase' size={18} color="grey" />
                    <Text style={{ color: "#6A7A8A", marginLeft: 5 }}>Programme</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { props.navigation.navigate('AllSpeaker') }} style={{ flexDirection: 'row',  marginLeft: 30 }}>
                    <FontAwesome5 name='microphone-alt' size={18} color="grey" />
                    <Text style={{ color: "#6A7A8A", marginLeft: 5 }}>Speakers</Text>
                </TouchableOpacity>
            </View>

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
                            <Text style={{ color: "#7d7d7d", fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>Rate this Forum</Text>
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

export default Aboutforum;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    }
})