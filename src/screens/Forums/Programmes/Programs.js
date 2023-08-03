import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, TextInput, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import { AntDesign, Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html'
import Modal from 'react-native-modal';
import Ring from '../../ChatRoom/Ring';
import { WebView } from "react-native-webview";


const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Programs = (props) => {
    const [comment, setComment] = useState('')
    const [userId, setUserId] = useState('')
    const [programmerId, setProgrammerId] = useState('')
    const [forumId, setForumId] = useState('')
    const [programmes, setProgrammes] = useState({})
    const [programmes_, setProgrammes_] = useState({})
    const [forums, setForums] = useState([])
    const [days, setDays] = useState([])
    const [user, setuser] = useState([])
    const [hasRated, setHasRated] = useState(true)
    const [forumTab, setForumTab] = useState('CHOGM')
    const [dayTab, setDayTab] = useState(new Date())
    const [defaultRating, setDefaultRating] = useState(0)
    const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5])
    const { width } = useWindowDimensions()
    const [isVisible, setisVisible] = useState(false)
    
    const [refreshing, setRefreshing] = useState(false);


    const checkHours=(hours)=>{
        if (hours>=24){
            return hours-24
        }
        else{
            return hours
        }
    }

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const rate = async () => {
        const Token = await AsyncStorage.getItem('token')
        var rateQuery = `
        mutation RateProgramme{
            rateProgramme(RatingInput:{
              comment:${JSON.stringify(comment)},
              createdDate:${JSON.stringify(new Date())},
              rate:${defaultRating},
              user:${JSON.stringify(userId)}
            },programmeId:${JSON.stringify(programmerId)}){
              id,
              rating{
                rate
              }
            }
          }
        `
        // console.log(rateQuery)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: rateQuery })
        }).then(response => response.json())
            .then(data => {
                setProgrammerId('')
                setComment('')
                // console.log(data)
                setisVisible(false)
                if (data.errors) {
                    alert('Something went wrong')
                }
                else {
                    alert('Your rate was recorded successfully!')
                    changeForum(forumId)
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

    const forumsQuery = `
    {forums{id,name,startDate}}
    `
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
    const changeForum = async (id) => {
        const Token = await AsyncStorage.getItem('token')
        const programmesByForum = `
    {programmesByForum(forumId:"${id}"){id,title,description,startDate,rating{rate,rating{user{id}}},endDate,forum{id},broadcastLink,room{name}}}
    `
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: programmesByForum })
        }).then(response => response.json())
            .then(data => {
                // console.log(data)
                const srt = data.data.programmesByForum.sort((a, b) => a.startDate.localeCompare(b.startDate))
                setProgrammes(srt); setProgrammes_(srt)
            })
    }

    const addDigit = (num) => {
        if (JSON.stringify(num).length > 1) {
            return JSON.stringify(num)
        }
        else {
            return '0' + num
        }
    }

    const checkDates = (date1, date2) => {

        if (date1.getDate() == date2.getDate() && date1.getMonth() == date2.getMonth() && date1.getFullYear() == date2.getFullYear()) {
            return true
        }
        else {
            return false
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
    useEffect(async () => {
        const userid = await AsyncStorage.getItem('id')
        const Token = await AsyncStorage.getItem('token')
        const id = await AsyncStorage.getItem('id')
        setUserId(id)
        var days_ = []
        // var days = []
        var date = new Date(2022, 5, 19)
        // var date_ = new Date()
        for (var i = 0; i <= 6; i++) {
            if (i == 0) {
                var new_date = new Date(date.setDate(date.getDate() + 0))
            }
            else {
                var new_date = new Date(date.setDate(date.getDate() + 1))

            }
            days_.push(new_date)
        }
        // for (var i = 0; i < 3; i++) {
        //     if (i > 0) {

        //         var new_date_ = new Date(date_.setDate(date_.getDate() - 1))

        //         days.push(new_date_)
        //     }
        // }
        setDays(days_)
        setuser(userid)


        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: forumsQuery })
        }).then(response => response.json())
            .then(data => {
                const srt = data.data.forums.sort((a, b) => a.startDate.localeCompare(b.startDate))
                setForums(srt)
                if (props.route.params) {
                    const forumId = props.route.params.forumId
                    const forumName = props.route.params.forumName
                    changeForum(forumId)
                    setForumId(forumId)
                    setForumTab(forumName)
                }
                else {
                    changeForum(srt[0].id)
                    setForumId(srt[0].id)
                    setForumTab(srt[0].name)
                }
            })

    }, [])
    
    const searchContact = (value) => {
        const filteredProgram = programmes_.filter(
            program => {
                let programLowercase = (program.title).toLowerCase()
                let searchTermLowercase = value.toLowerCase()
                return programLowercase.indexOf(searchTermLowercase) > -1
            }
        )
        setProgrammes(filteredProgram);
    }
    return (
        <View styles={styles.container}>
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Programs</Text>
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

            <View>
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
                            placeholder="Search by title"
                            placeholderTextColor={'#4d4d4d'}
                        >


                        </TextInput>
                    </View>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                    {forums.map(forum => {
                        return (
                            <>
                                <TouchableOpacity onPress={() => { changeForum(forum.id); setForumTab(forum.name); setForumId(forum.id) }} style={{ minWidth: windowWidth / 4, height: 50, backgroundColor: forumTab === forum.name ? '#0771B8' : '#D8D8D8', alignItems: 'center', justifyContent: 'center', marginRight: 1, paddingHorizontal: 10 }}>
                                    <Text style={{ color: forumTab === forum.name ? '#fff' : '#0771B8' }}>{forum.name}</Text>
                                </TouchableOpacity>
                            </>
                        )
                    })}

                </ScrollView>


                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 80, alignItems: "center" }}>
                        {days.map(day => {
                            return (

                                <TouchableOpacity onPress={() => { setDayTab(day) }} style={{ width: windowWidth / 3.2, height: '100%', backgroundColor: checkDates(dayTab, day) ? '#0A2133' : '#D8D8D8', marginRight: 5, alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                                    <Text style={{ color: checkDates(dayTab, day) ? '#fff' : '#0771B8' }}>
                                        {`${new Date().getDate()}-${new Date().getMonth()}-${new Date().getFullYear()}` === `${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`
                                            ? (<Text>Today</Text>) : (findDay(day.getDay())
                                            )} </Text>
                                    <Text style={{ color: checkDates(dayTab, day) ? '#fff' : '#0771B8' }}>{day.getDate()} - {day.getMonth() + 1} - {day.getFullYear()}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </ScrollView>


                <ScrollView style={{ height: (windowHeight * 8 / 9) - 190,backgroundColor:"#fff" }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                    {JSON.stringify(programmes) != "{}" ? (
                        <>
                            {programmes.filter(programme => (checkDates(dayTab, new Date(programme.startDate)) || checkDates(dayTab, new Date(programme.endDate)))).length > 0 ? (
                                <>
                                    {programmes.filter(programme => (checkDates(dayTab, new Date(programme.startDate)) || checkDates(dayTab, new Date(programme.endDate)))).map(programme => {
                                        return (
                                            <View key={programme.id} style={{ flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 0.3 }}>
                                                <View style={{ width: '25%', alignItems: 'center', marginTop: '5%' }}>
                                                    <Text style={{ fontSize: 18 }}> <Text style={{ textDecorationLine: 'underline' }}>{addDigit(checkHours(new Date(programme.startDate).getUTCHours() + 2))}</Text>:{addDigit(new Date(programme.startDate).getMinutes())} </Text>
                                                    <Text style={{ fontSize: 18, color: '#b4b4b4' }}>{addDigit(checkHours(new Date(programme.endDate).getUTCHours() + 2))}:{addDigit(new Date(programme.endDate).getMinutes())}</Text>
                                                </View>
                                                <View style={{ width: '75%', paddingHorizontal: '5%' }}>
                                                    <View renderToHardwareTextureAndroid={true} style={{ marginTop: '5%',height:windowHeight/3.5}}>
                                                        <Text style={{ color: "#000", fontWeight: "bold" }}>{programme.title}</Text>
                                                        {programme.description != "" ? (
                                                            <WebView  source={{
                                                                html: `<span style="font-size:55px;">${programme.description}</span>`
                                                            }} />
                                                        ) : (
                                                            <Text style={{ marginTop: 5, marginBottom: 5 }}>No Description yet...</Text>
                                                        )} 
                                                        <TouchableOpacity onPress={() => { props.navigation.navigate('ProgramDetails', { 'id': programme.id }) }}><Text style={{ color: "#3a86ff" }}>View Details</Text></TouchableOpacity>
                                                        {/*{programme.rating.rate > 0 ? (
                                                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                                                                {Array(Math.floor(programme.rating.rate)).fill().map(element => <Ionicons name="star" size={16} color='#E0A100' />)}
                                                                <Text>{parseFloat(programme.rating.rate) - Math.floor(programme.rating.rate) > 0 && <Ionicons name="star-half-sharp" size={16} color='#E0A100' />}</Text>
                                                                <Text style={{ marginLeft: 5 }}>{programme.rating.rate} stars</Text>
                                                            </View>
                                                        ) : (
                                                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 5 }}>
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Text style={{ marginLeft: 5, marginTop: 4 }}>{programme.rating.rate} stars</Text>
                                                            </View>
                                                        )} */}



                                                        {checkRating(programme.rating.rating, user) ? (
                                                            <Text style={{ marginTop: 7, color: "#0771b8" }}>You've rated this program</Text>
                                                        ) : (
                                                            <TouchableOpacity onPress={() => { setisVisible(true); setProgrammerId(programme.id) }}>
                                                                <Text style={{ marginLeft: 2, marginTop: 7, textDecorationLine: 'underline', color: "#0771b8" }}>Rate this program</Text>
                                                            </TouchableOpacity>
                                                        )}


                                                        <View style={{ marginBottom: 8 }}>

                                                            {programme.room && programme.room.name !== null || programme.room && programme.room.name !== "" ? (
                                                                <View style={{ flexDirection: 'row', marginTop: '2%' }}>

                                                                    <Ionicons name="location" size={15} color="#118AB2" />
                                                                    <Text style={{ color: "#6A7A8A" }}>{programme.room.name}</Text>

                                                                </View>

                                                            ) : (<></>)}




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

                                            </View>
                                        )
                                    })}
                                </>
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
                                    <Text>No Programs in {forumTab} on {findDay(dayTab.getDay())}...</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <ActivityIndicator size='large' color='#0771b8' />
                        </View>
                    )}






                </ScrollView>





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

export default Programs;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white'
    }
})
