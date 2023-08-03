import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Alert, ScrollView, Dimensions, TextInput, Platform, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';
import Ring from '../../ChatRoom/Ring';



const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Rooms = ({ navigation }) => {

    const useStateCallbackWrapper = (initilValue, callBack) => {
        const [state, setState] = useState(initilValue);
        useEffect(() => callBack(state), [state]);
        return [state, setState];
    };

    const callBack = async (state) => {
        if (!state.camera && !state.conditioner && !state.wifi && !state.projector && !state.microphone) {
            setRooms(allRooms)
        }
        else {
            const Token = await AsyncStorage.getItem('token')
            const roomsByAmenitiesQuery = `
        {roomByAmenities(AmenitiesInput:{
            camera:${state.camera},
            projector:${state.projector},
            conditioner:${state.conditioner},
            wifi:${state.wifi},
            microphone:${state.microphone},
        }){name,thumbnail,availability,description}}
        `

            fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                body: JSON.stringify({ query: roomsByAmenitiesQuery })
            }).then(response => response.json())
                .then(data => { setRooms(data.data.roomByAmenities); })
        }
    };

    function roundToNearest30(date) {
        const minutes = 30;
        const ms = 1000 * 60 * minutes;

        // 👇️ replace Math.round with Math.ceil to always round UP
        return new Date(Math.round(date.getTime() / ms) * ms);
    }


    const [startDate, setStartDate] = useState(roundToNearest30(new Date()));
    const [startTime, setStartTime] = useState(roundToNearest30(new Date()));
    const [endTime, setEndTime] = useState(new Date());
    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    const [showTime, setShowTime] = useState(false);
    const [showTime2, setShowTime2] = useState(false);
    const [rooms, setRooms] = useState({});
    const [allRooms, setAllRooms] = useState({});
    const [Desc, setDesc] = useState({});
    const [isVisible, setisVisible] = useState(false);
    const [loading, setloading] = useState(false);


    const [amenities, setAmenities] = useStateCallbackWrapper({
        conditioner: false,
        wifi: false,
        camera: false,
        projector: false,
        microphone: false
    }, callBack);

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        setShow(false);
        setStartDate(currentDate);
    };
    const addDigit = (num) => {
        if (JSON.stringify(num).length > 1) {
            return JSON.stringify(num)
        }
        else {
            return '0' + num
        }
    }


    const showModal = (currentMode) => {
        setShow(true)
    }


    const resto_alert = (roomid) => {
        Alert.alert(
            '',
            `Are you sure you want to book this room`,
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                { text: "Confirm", onPress: () => Book(roomid) }
            ]
        );
    }



    const roomsQuery = `
    {availableRooms{id,name,thumbnail,availability,description,capacity}}
    `


    const availonrange = async () => {
        setloading(true)
        const Token = await AsyncStorage.getItem('token')
        const id = await AsyncStorage.getItem('id')
        let availondate
        if (Platform.OS === 'ios') {
            console.log("IOS user")
            availondate = `{
                availableRoomsDateRange(dateRangeInput:{
                  endDate:${JSON.stringify(new Date(new Date(startDate).getTime() + 25 * 60000))},
                  startDate:${JSON.stringify(startDate)}
                }){
                  id,
                  name,
                  description,
                  thumbnail,
                  availability,
                  capacity
                }
              }`
            console.log(availondate)
        }
        else {

            console.log("android user")
            const Sday = JSON.stringify(startDate).slice(1, 11)
            const Stime = JSON.stringify(startTime).slice(11, -1)
            const Sdate = Sday + Stime
            const Etime = JSON.stringify(new Date(new Date(startTime).getTime() + 25 * 60000)).slice(11, -1)
            const Edate = Sday + Etime

            availondate = `{
                availableRoomsDateRange(dateRangeInput:{
                  endDate:${JSON.stringify(Edate)},
                  startDate:${JSON.stringify(Sdate)}
                }){
                    id,
                    name,
                    description,
                    thumbnail,
                    availability,
                    capacity
                }
              }`
            console.log(availondate)
        }
        setAllRooms({}); setRooms({})
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: availondate })
        }).then(response => response.json())
            .then(data => { setAllRooms(data.data.availableRoomsDateRange); setRooms(data.data.availableRoomsDateRange) })
        setloading(false)

    }



    // BookmutationSubmit



    const Book = async (roomid) => {
        const Token = await AsyncStorage.getItem('token')
        const id = await AsyncStorage.getItem('id')
        let Bookingmutation
        if (Platform.OS === 'ios') {
            console.log("IOS user")
            Bookingmutation = `
          mutation Booking{createBooking(CreateBookingInput:{
            endDate:${JSON.stringify(new Date(new Date(startDate).getTime() + 25 * 60000))},
            startDate:${JSON.stringify(startDate)},
            room:${JSON.stringify(roomid)},
            user:${JSON.stringify(id)},
          }){
            startDate,
            endDate
          }}`


        }
        else {

            console.log("android user")
            const Sday = JSON.stringify(startDate).slice(1, 11)
            const Stime = JSON.stringify(startTime).slice(11, -1)
            const Sdate = Sday + Stime
            const Etime = JSON.stringify(new Date(new Date(startTime).getTime() + 25 * 60000)).slice(11, -1)
            const Edate = Sday + Etime

            Bookingmutation = `
            mutation Booking{createBooking(CreateBookingInput:{
              startDate:${JSON.stringify(Sdate)},
              endDate:${JSON.stringify(Edate)},
              room:${JSON.stringify(roomid)},
              user:${JSON.stringify(id)},
            }){
              startDate,
              endDate
            }}
      `
        }
        console.log(Bookingmutation)

        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: Bookingmutation })
        }).then(response => response.json())
            .then(data => {
                console.log("this is simon data")
                console.log(data)
                if (data.errors) {
                    alert(data.errors[0].message)
                }
                else {
                    alert('Your request for booking is well received, we will get back to you.')
                    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                        body: JSON.stringify({ query: roomsQuery })
                    }).then(response => response.json())
                        .then(data => { setAllRooms(data.data.availableRooms); setRooms(data.data.availableRooms) })
                }
            })

    }

    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: roomsQuery })
        }).then(response => response.json())
            .then(data => { console.log(data); setAllRooms('search'); setRooms('search') })
    }, [])


    return (
        <View>




            <View style={{ width: windowWidth, backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Meeting Room Booking</Text>
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
            {Platform.OS === 'ios' && (
                <>
                    <View style={{ flexDirection: 'row', marginTop: 2, height: windowHeight / 16, width: "100%" }}>
                        <View style={{ width: "80%", height: '80%', alignItems: 'flex-start', borderRadius: 10, marginLeft: "3%" }}>
                            <Text style={{ color: '#0771b8', marginTop: '5%', fontSize: 18 }}>Pick Date</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ alignItems: 'flex-start', width: '90%', marginLeft: '3%', backgroundColor: 'gray' }}>
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={startDate}
                                mode='datetime'
                                is24Hour={true}
                                minuteInterval={30}
                                minimumDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
                                themeVariant='dark'
                                onChange={onChange}
                                timeZoneOffsetInMinutes={0}
                                style={{ width: '55%' }}
                            />
                        </View>

                    </View>
                </>

            )}
            {Platform.OS === 'android' && (
                <>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 2, height: windowHeight / 10, width: "100%" }}>
                        <View style={{ width: "90%", height: '60%', alignItems: 'flex-start', borderRadius: 10, }}>
                            <Text style={{ color: '#0771b8', marginTop: '5%', fontSize: 18 }}>Pick Date</Text>
                        </View>

                    </View>
                    <View style={{ flexDirection: 'row', width: '90%', backgroundColor: 'gray', marginLeft: '3%' }}>
                        <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                            <TouchableOpacity onPress={() => { setShow(true) }} style={{ marginRight: 1, height: 30, width: '45%', backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontSize: windowWidth / 28, color: 'white' }}>{JSON.stringify(startDate).slice(1, 11)}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => { setShowTime(true) }} style={{ height: 30, width: '45%', backgroundColor: 'gray', justifyContent: 'center', alignItems: 'center' }}>
                                <View>
                                    <Text style={{ fontSize: windowWidth / 28, color: 'white' }}>{startTime.getUTCHours()}:{addDigit(startTime.getMinutes())}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>

                    </View>

                    {show && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={startDate}
                            mode='date'
                            minimumDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
                            is24Hour={true}
                            onChange={(event, selectedDate) => { setShow(false); setStartDate(selectedDate) }}
                            themeVariant='dark'
                            style={{ width: '80%' }}
                        />
                    )}
                    {showTime && (
                        <DateTimePicker
                            testID="dateTimePicker"
                            value={startTime}
                            mode='time'
                            minuteInterval={30}
                            is24Hour={true}
                            timeZoneOffsetInMinutes={0}
                            onChange={(event, selectedDate) => { setShowTime(false); setStartTime(selectedDate) }}
                            themeVariant='dark'
                            style={{ width: '80%' }}
                        />
                    )}


                </>
            )}
            <TouchableOpacity onPress={() => { availonrange() }} style={{ ...styles.shadow, width: "45%", height: 40, backgroundColor: '#0771b8', alignSelf: 'center', borderRadius: 25, justifyContent: "center", alignItems: "center", marginTop: 10 }}>

                {loading ?
                    (
                        <ActivityIndicator size='large' color='white' />

                    ) : (
                        <Text style={{ color: '#fff', marginTop: '0%', fontSize: 18 }}>Search</Text>
                    )
                }
            </TouchableOpacity>




            {/* <View style={{
                paddingBottom: 5,
                width: windowWidth - 16,
                backgroundColor: '#fff',
                borderRadius: 15,
                alignSelf: 'center',
                marginTop: 20,
                shadowColor: "#707070",
                shadowOffset: {
                    width: 0,
                    height: 4,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.65,
                elevation: 3,
                }}>
                <View style={{ flexDirection: 'row', margin: 6 }}>
                    <Ionicons name="settings-outline" size={25} color="#0771b8" />
                    <Text style={{ color: "#0771b8", fontSize: 20, marginLeft: 6 }}>Amenities</Text>
                </View>
                <View style={{ flexDirection: 'row', marginLeft: 6, flexWrap: 'wrap' }}>
                    <TouchableOpacity onPress={() => { setAmenities({ ...amenities, conditioner: !amenities.conditioner }) }} style={{ flexDirection: 'row', borderColor: 'gray', borderWidth: 1, borderRadius: 10, height: windowHeight / 22, justifyContent: 'center', alignItems: 'center', marginRight: 5, paddingHorizontal: 5, marginTop: 5, backgroundColor: amenities.conditioner ? "#0771b8" : "white" }}>
                        <Entypo name={amenities.conditioner ? "check" : "plus"} size={18} color={amenities.conditioner ? "white" : "gray"} />
                        <Text style={{ color: amenities.conditioner ? "white" : "gray", fontSize: 16, marginLeft: 6 }}>Conditioner</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setAmenities({ ...amenities, projector: !amenities.projector }) }} style={{ flexDirection: 'row', borderColor: 'gray', borderWidth: 1, borderRadius: 10, height: windowHeight / 22, justifyContent: 'center', alignItems: 'center', marginRight: 5, paddingHorizontal: 5, marginTop: 5, backgroundColor: amenities.projector ? "#0771b8" : "white" }}>
                        <Entypo name={amenities.projector ? "check" : "plus"} size={18} color={amenities.projector ? "white" : "gray"} />
                        <Text style={{ color: amenities.projector ? "white" : "gray", fontSize: 16, marginLeft: 6 }}>Projector</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setAmenities({ ...amenities, microphone: !amenities.microphone }) }} style={{ flexDirection: 'row', borderColor: 'gray', borderWidth: 1, borderRadius: 10, height: windowHeight / 22, justifyContent: 'center', alignItems: 'center', marginRight: 5, paddingHorizontal: 5, marginTop: 5, backgroundColor: amenities.microphone ? "#0771b8" : "white" }}>
                        <Entypo name={amenities.microphone ? "check" : "plus"} size={18} color={amenities.microphone ? "white" : "gray"} />
                        <Text style={{ color: amenities.microphone ? "white" : "gray", fontSize: 16, marginLeft: 6 }}>Microphone</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setAmenities({ ...amenities, wifi: !amenities.wifi }) }} style={{ flexDirection: 'row', borderColor: 'gray', borderWidth: 1, borderRadius: 10, height: windowHeight / 22, justifyContent: 'center', alignItems: 'center', marginRight: 5, paddingHorizontal: 5, marginTop: 5, backgroundColor: amenities.wifi ? "#0771b8" : "white" }}>
                        <Entypo name={amenities.wifi ? "check" : "plus"} size={18} color={amenities.wifi ? "white" : "gray"} />
                        <Text style={{ color: amenities.wifi ? "white" : "gray", fontSize: 16, marginLeft: 6 }}>WIFI</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => { setAmenities({ ...amenities, camera: !amenities.camera }) }} style={{ flexDirection: 'row', borderColor: 'gray', borderWidth: 1, borderRadius: 10, height: windowHeight / 22, justifyContent: 'center', alignItems: 'center', marginRight: 5, paddingHorizontal: 5, marginTop: 5, backgroundColor: amenities.camera ? "#0771b8" : "white" }}>
                        <Entypo name={amenities.camera ? "check" : "plus"} size={18} color={amenities.camera ? "white" : "gray"} />
                        <Text style={{ color: amenities.camera ? "white" : "gray", fontSize: 16, marginLeft: 6 }}>Camera</Text>
                    </TouchableOpacity>

                </View>

            </View> */}




            <ScrollView style={{ height: (windowHeight * 2 / 3) - 40 }}>

                {JSON.stringify(rooms) != "{}" ? (
                    <>
                        {rooms==='search'?(
                        <View style={{ justifyContent: 'center', alignItems: 'center',marginTop:50 }}>
                            <Text>Pick Date and search available rooms!</Text>
                        </View>
                        ):(
                            rooms.length > 0 ? (
                                <>
                                    {rooms.map(room => {
                                        return (
                                            <View style={{ flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 0.3 }}>
                                                <View style={{ width: '45%', alignItems: 'center', marginTop: '6%', marginBottom: "3%" }}>
                                                    {room.thumbnail !== "" ? (
                                                        <Image source={{ uri: room.thumbnail }}
                                                            resizeMode="cover"
                                                            style={{ width: windowWidth / 2.5, height: 100, borderRadius: 20, overflow: "hidden" }}
                                                        />
    
                                                    ) : (
                                                        <Image source={require('../../../images/room.jpg')}
                                                            resizeMode="contain"
                                                            style={{ width: windowWidth / 2.5, height: 100, borderRadius: 20, overflow: "hidden" }}
                                                        />
    
                                                    )}
    
                                                </View>
                                                <View style={{ width: '55%', justifyContent: "center", alignItems: "flex-start" }}>
                                                    <View style={{ marginTop: '9%' }}>
                                                        <Text style={{ color: "#000", fontWeight: "bold" }}>
                                                            {room.name}
                                                        </Text>
                                                        <Text style={{ color: "#000" }}>{room.description.slice(0, 110)}...<TouchableOpacity onPress={() => { { setisVisible(!isVisible); setDesc(room.description) } }}><Text style={{ color: "#3a86ff" }}>Read more</Text></TouchableOpacity></Text>
                                                        <Text style={{ color: "#000", fontWeight: "bold", marginTop: 5 }}>
                                                            Capacity: {room.capacity}
                                                        </Text>
                                                        <View style={{ marginTop: 8, marginBottom: 10 }}>
                                                            <TouchableOpacity onPress={() => { resto_alert(room.id) }} style={{ backgroundColor: "#0F57A9", borderRadius: 5, width: 100, justifyContent: "center", alignItems: "center", }}>
                                                                <Text style={{ color: "#b4b4b4", color: "#fff", fontWeight: "bold" }}>Book now</Text>
                                                            </TouchableOpacity>
    
                                                        </View>
                                                    </View>
                                                </View>
    
                                            </View>
                                        )
                                    })}
    
                                </>
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text>No room yet...</Text>
                                </View>
                            )
                        )}
                    </>
                ) : (
                    <>
                        <ActivityIndicator style={{ marginTop: 40 }} size='large' color="#0771b8" />
                    </>
                )}

            </ScrollView>

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
                        <View style={{ width: '90%', backgroundColor: '#e8e8f5', borderRadius: 20 }}>
                            <View style={{ backgroundColor: "#f5f6fb", width: '100%', borderTopRightRadius: 20, borderTopLeftRadius: 20, marginLeft: 0, height: 60, justifyContent: "center", }}>
                                <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold", marginLeft: 20 }}>Room Description</Text>
                            </View>
                            <ScrollView style={{ maxHeight: windowHeight / 2 }}>
                                <Text style={{ color: "#5c5c5c", fontSize: 18, fontWeight: "bold", marginTop: 20, marginLeft: 20, marginHorizontal: 20 }}>{Desc}</Text>
                            </ScrollView>
                            <TouchableOpacity onPress={() => { setisVisible(!isVisible) }} style={{ flexDirection: "row", borderTopColor: 'grey', borderTopWidth: 0.6, marginTop: 20, backgroundColor: "#f5f6fb", borderBottomRightRadius: 20, borderBottomLeftRadius: 20, }}>
                                {/* Cancel */}
                                <View style={{ height: 50, width: 100, width: '100%', alignItems: 'center', justifyContent: 'center' }}>
                                    <Text style={{ color: '#000', fontSize: 20 }}>Okay</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                    </>
                </View>




            </Modal>

        </View >
    )
}

export default Rooms;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    shadow: {
        shadowColor: "#707070",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.65,
        elevation: 8,
    },


})