import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, Platform, TextInput, ActivityIndicator, RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Use } from 'react-native-svg';
import Modal from 'react-native-modal';
import Ring from '../ChatRoom/Ring';
const Sessions = (props) => {
    const [User, setUser] = useState({})
    const [userId, setUserId] = useState('')
    const [userid, setuserid] = useState('')
    const { width } = useWindowDimensions()
    const [defaultRating, setDefaultRating] = useState(0)
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5])
    const [comment, setComment] = useState('')
    const [isVisible, setisVisible] = useState(false)
    const [refreshing, setRefreshing] = useState(false);
    const [Program, setProgram] = useState(false);

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
              user:${JSON.stringify(userId)}
            },userId:${JSON.stringify(userid)}){
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
                            user(id:${JSON.stringify(props.route.params.userid)}){
                                firstName,lastName,title,avatar,occupation,category,biography,rating{rate,rating{user{id}}}
                            }
                        }`
                    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                        body: JSON.stringify({ query: userQuery })
                    }).then(response => response.json())
                        .then(data => setUser(data.data.user))
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
        const userid = await props.route.params.userid
        const Token = await AsyncStorage.getItem('token')
        const my_id = await AsyncStorage.getItem('id')
        setUserId(my_id)
        setuserid(userid)
        const userQuery = `
    {
        user(id:${JSON.stringify(userid)}){
            firstName,lastName,title,avatar,occupation,category,biography,rating{rate,rating{user{id}}}
          }
    }`

        const programbyuser = `{
        programmesByUser(userId:"${userid}"){
          id,title,description,startDate,endDate,broadcastLink,room{name},rating{rate,rating{user{id}}}
          
        }
        
      }`
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: userQuery })
        }).then(response => response.json())
            .then(data => setUser(data.data.user))

        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: programbyuser })
        }).then(response => response.json())
            .then(data => setProgram(data.data.programmesByUser))

    }, [])

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

                <TouchableOpacity onPress={() => { props.navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>{User.occupation}</Text>
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
                {JSON.stringify(User) !== "{}" ? (
                    <>
                        {/* <View style={{ width: '30%', alignItems: 'center', marginTop: 20, marginHorizontal: 30 }}>
                            {User.avatar !== "" ? (
                                <Image source={{ uri: User.avatar }} style={{ width: windowHeight / 12, height: windowHeight / 12, borderRadius: 100 }} resizeMode="contain" />
                            ) : (
                                <FontAwesome5 name="user-circle" size={60} color="#fff" />

                            )}
                        </View> */}
                        <View style={{ width: '70%', alignItems: 'center', marginHorizontal: 20, marginTop: 20 }}>
                            <View>
                                <Text style={{ color: "#E0A100", fontWeight: "bold", }}>
                                    {User.firstName} {User.lastName}
                                </Text>
                                 
                                {/* {User.rating.rate > 0 ? (

                                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                        {Array(Math.floor(User.rating.rate)).fill().map(element => <Ionicons name="star" size={16} color='#E0A100' />)}
                                        <Text>{parseFloat(User.rating.rate) - Math.floor(User.rating.rate) > 0 && <Ionicons name="star-half-sharp" size={16} color='#118AB2' />}</Text>
                                        <Text style={{ marginLeft: 5, color: "#fff" }}>{User.rating.rate} stars</Text>
                                    </View>
                                ) : (
                                    <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                        <Text style={{ marginLeft: 5, color: "#fff" }}>{User.rating.rate} stars</Text>
                                    </View>
                                )}
                                {checkRating(User.rating.rating, userId) ? (
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
                {/* <TouchableOpacity onPress={() => { props.navigation.navigate('Bio') }} style={{ width: "50%", height: '100%', backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#4d4d4d', }}>Biography</Text>
                </TouchableOpacity> */}
                <View style={{ width: "95%", height: '100%', backgroundColor: '#0A2133', alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }}>
                    <Text style={{ color: '#fff', textDecorationLine: 'underline' }}>Sessions
                        <View style={{ backgroundColor: "#E0A100", borderRadius: 20, width: 20, alignItems: "center", justifyContent: "center" }}>
                            <Text style={{ justifyContent: "center" }}>{Program.length}</Text>
                        </View>
                    </Text>
                </View>
            </View>

            <ScrollView style={{ height: (windowHeight * 7 / 8) - 230 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                {JSON.stringify(Program) != "{}" ?
                    (
                        Program.length > 0 ? (
                            Program.length > 0 && Program.map(programme => {
                                return (
                                    <View key={programme.id} style={{ flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 0.3 }}>
                                        <View style={{ width: '25%', alignItems: 'center', marginTop: '5%' }}>
                                            <Text style={{ fontSize: 18 }}> <Text style={{ textDecorationLine: 'underline' }}>{addDigit(new Date(programme.startDate).getUTCHours() + 2)}</Text>:{addDigit(new Date(programme.startDate).getMinutes())} </Text>
                                            <Text style={{ fontSize: 18, color: '#b4b4b4' }}>{addDigit(new Date(programme.endDate).getUTCHours() + 2)}:{addDigit(new Date(programme.endDate).getMinutes())}</Text>
                                        </View>
                                        <View style={{ width: '75%', paddingHorizontal: '5%' }}>
                                            <View style={{ marginTop: '5%' }}>
                                                <Text style={{ color: "#000", fontWeight: "bold" }}>{programme.title}</Text>
                                                {JSON.stringify(Program) != "{}" ? (<RenderHtml
                                                    contentWidth={width}
                                                    source={{
                                                        html: `
                                                            ${programme.description.slice(0, 110)}`
                                                    }}
                                                />) : (<Text style={{ marginTop: 40 }}>No  Info yet...</Text>)}
                                                <TouchableOpacity onPress={() => { props.navigation.navigate('ProgramDetails', { 'id': programme.id }) }}><Text style={{ color: "#3a86ff" }}>Read more</Text></TouchableOpacity>

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
                                                        <Text style={{ marginLeft: 5 }}>{programme.rating.rate} stars</Text>
                                                    </View>
                                                )} */}

                                                <View style={{ marginBottom: 8 }}>
                                                    <View style={{ flexDirection: 'row', marginRight: '10%', marginTop: '4%', }}>
                                                        <Ionicons name="location" size={15} color="#118AB2" />
                                                        <Text style={{ color: "#6A7A8A" }}>{programme.room.name}</Text>
                                                    </View>

                                                    {programme.broadcastLink !== null ? (

                                                        <TouchableOpacity onPress={() => { props.navigation.navigate('Broadcast', { 'link': programme.broadcastLink }) }} style={{ flexDirection: 'row', marginTop: '4%' }}>
                                                            <Feather name="airplay" size={15} color="#118AB2" style={{ marginRight: 5 }} />
                                                            <Text style={{ color: "#6A7A8A" }}>Broadcast</Text>
                                                        </TouchableOpacity>
                                                    ) : (
                                                        <></>
                                                    )}

                                                </View>

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

                                    </View>

                                )
                            }
                            )
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No program yet...</Text>
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

export default Sessions;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})