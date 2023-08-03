import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, TextInput, ActivityIndicator, Platform,RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Ring from '../ChatRoom/Ring';
const Bio = (props) => {
    const [Speaker, setSpeaker] = useState({})
    const [Program, setProgram] = useState({})
    const [userid, setuserid] = useState({})
    const [userId, setUserId] = useState({})
    const [defaultRating, setDefaultRating] = useState(0)
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5])
    const [comment, setComment] = useState('')
    const [isVisible, setisVisible] = useState(false)
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
        mutation rateUser{
            rateUser(RatingInput:{
              comment:${JSON.stringify(comment)},
              createdDate:${JSON.stringify(new Date())},
              rate:${defaultRating},
              user:${JSON.stringify(userid)}
            },userId:${JSON.stringify(userId)}){
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
                    const userQuery = `
                        {
                            user(id:${JSON.stringify(props.route.params.id)}){
                                firstName,lastName,title,avatar,occupation,category,biography,rating{rate,rating{user{id}}}
                            }
                        }
                        `
                    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                        body: JSON.stringify({ query: userQuery })
                    }).then(response => response.json())
                        .then(data => setSpeaker(data.data.user))
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
        const userId = props.route.params.id
        setuserid(my_id)
        setUserId(userId)
        const userQuery = `
    {
        user(id:${JSON.stringify(props.route.params.id)}){
            firstName,lastName,title,avatar,occupation,category,biography,rating{rate,rating{user{id}}}
          }
    }
    `
        const programbyuser = `{
        programmesByUser(userId:"${props.route.params.id}"){
          id,title,description,startDate,endDate,broadcastLink,room{name},rating{rate,rating{user{id}}}
          
        }
        
      }`
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: userQuery })
        }).then(response => response.json())
            .then(data => setSpeaker(data.data.user))
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: programbyuser })
        }).then(response => response.json())
            .then(data => setProgram(data.data.programmesByUser))
    }, [])
    return (
        <View>
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

                    <Text style={{ color: 'white', fontSize: 18 }}>{Speaker.occupation}</Text>
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

            <View style={{ flexDirection: 'row', backgroundColor: '#0A2133', height: 100 }}>
                {JSON.stringify(Speaker) !== "{}" ? (
                    <>
                        <View style={{ width: '30%', alignItems: 'center', marginTop: 20, marginHorizontal: 30 }}>
                            {Speaker.avatar !== "" ? (
                                <Image source={{ uri: Speaker.avatar }} style={{ width: windowHeight / 12, height: windowHeight / 12, borderRadius: 100 }} resizeMode="contain" />
                            ) : (
                                <FontAwesome5 name="user-circle" size={60} color="#fff" />

                            )}
                        </View>
                        <View style={{ width: '70%', alignItems: 'center', marginHorizontal: -80, marginTop: 20 }}>
                            <View>
                                <Text style={{ color: "#E0A100", fontWeight: "bold", }}>
                                    {Speaker.firstName} {Speaker.lastName}
                                </Text>

                                {/* {Speaker.rating.rate > 0 ? (

                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        {Array(Math.floor(Speaker.rating.rate)).fill().map(element => <Ionicons name="star" size={16} color='#E0A100' />)}
                                        <Text>{parseFloat(Speaker.rating.rate) - Math.floor(Speaker.rating.rate) > 0 && <Ionicons name="star-half-sharp" size={16} color='#E0A100' />}</Text>
                                        <Text style={{ marginLeft: 5, color: 'white' }}>{Speaker.rating.rate} stars</Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Text style={{ marginLeft: 5, color: 'white' }}>{Speaker.rating.rate} stars</Text>
                                    </View>
                                )}
                                {checkRating(Speaker.rating.rating, userid) ? (
                                    <Text style={{ marginTop: 5, color: "#fff" }}>You've rated this Speaker</Text>
                                ) : (
                                    <TouchableOpacity onPress={() => { setisVisible(true) }}>
                                        <Text style={{ marginTop: 5, textDecorationLine: 'underline', color: "#fff" }}>Rate this Speaker</Text>
                                    </TouchableOpacity>
                                )} */}

                            </View>
                        </View>
                    </>

                ) : (
                    <View style={{ width: windowWidth, justifyContent: 'center', alignItems: 'center' }}>
                        <ActivityIndicator size='large' color='white' />
                    </View>
                )}

            </View>

            <View style={{ flexDirection: "row", justifyContent: 'space-between', marginTop: 2, height: 50, width: "100%" }}>
                <View style={{ width: "50%", height: '100%', backgroundColor: '#0A2133', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>Biography</Text>
                </View>
                <TouchableOpacity onPress={() => { props.navigation.navigate('Sessions', { 'userprogram': Program, 'userid': userId }) }} style={{ width: "50%", height: '100%', backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center', marginLeft: 5 }}>
                    <Text style={{ color: '#4d4d4d' }}>Sessions
                        <View style={{ backgroundColor: "#E0A100", borderRadius: 20, width: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ justifyContent: "center" }}>{Program.length}</Text>
                        </View>
                    </Text>
                </TouchableOpacity>
            </View>



            <ScrollView style={{ height: (windowHeight * 7 / 8) - 160 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <View style={{ marginTop: '5%', width: '85%', alignItems: 'center', marginHorizontal: 20, marginBottom: 20 }}>
                    <View style={{ marginTop: '10%' }}>
                        {JSON.stringify(Speaker.biography) != "{}" && Speaker.biography !== undefined ?
                            (
                                Speaker.biography !== null ? (
                                    <Text>
                                        {Speaker.biography}
                                    </Text>
                                ) : (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No Biography yet...</Text>
                                    </View>
                                )) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                    <ActivityIndicator size='large' color='#0771b8' />
                                </View>
                            )

                        }
                    </View>
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

export default Bio;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})