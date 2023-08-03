import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, RefreshControl, TouchableOpacity, StatusBar, ScrollView, Dimensions, TextInput, ActivityIndicator, Platform } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ring from '../ChatRoom/Ring';

const AllSpeaker = (props) => {
    const [Speaker, setSpeaker] = useState({})
    const [Speaker_, setSpeaker_] = useState({})
    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    useEffect(async () => {
        const allspeakers =
            `{
            usersByRole
                (RoleInput:{roles:[SPEAKER,MODERATOR]}){id,firstName,lastName,category,avatar,biography,title},
            
        }`
        const Token = await AsyncStorage.getItem('token')
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: allspeakers })
        }).then(response => response.json())
            .then(data => {

                setSpeaker(data.data.usersByRole)
                setSpeaker_(data.data.usersByRole)

            }
            )

    }, [])


    const searchmoderator = (value) => {
        const filteredspeaker = Speaker_.filter(
            speaker => {
                let speakerLowercase = (speaker.firstName + speaker.lastName).toLowerCase()
                let searchTermLowercase = value.toLowerCase()
                return speakerLowercase.indexOf(searchTermLowercase) > -1
            }
        )
        setSpeaker(filteredspeaker);
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Speakers</Text>
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
                    <FontAwesome5 name="search" size={24} color='#ADB5BD' />
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
                        onChangeText={(value) => { searchmoderator(value) }}
                        placeholder="Search by name"
                        placeholderTextColor={'#ADB5BD'}
                    >


                    </TextInput>
                </View>
            </View>
            <ScrollView style={{ height: (windowHeight * 7 / 8) - 50 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                <View style={{ height: windowHeight / 15, width: "100%" }}>
                    <TouchableOpacity style={{ height: '60%', backgroundColor: '#ebebeb', justifyContent: 'center' }}>
                        <Text style={{ color: '#464749', marginLeft: 10 }}>All Speakers</Text>
                    </TouchableOpacity>
                </View>

                {/* <Text>{JSON.stringify(Speaker)}</Text> */}

                {JSON.stringify(Speaker) != "{}" ?
                    (
                        <>
                            {Speaker.length > 0 ? (
                                <>
                                    {Speaker.map(item => {



                                        return (



                                            <TouchableOpacity onPress={() => { props.navigation.navigate('Sessions', { 'userid': item.id }) }} style={{ flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 0.3, marginBottom: "5%" }}>

                                                {/* <View style={{ width: '25%', alignItems: 'center', marginBottom: "5%" }}>
                                                    {item.avatar !== "" ? (

                                                        <Image source={{ uri: item.avatar }} style={{ width: windowHeight / 12, height: windowHeight / 12, borderRadius: 100 }} resizeMode="contain" />
                                                    ) : (
                                                        <FontAwesome5 name="user-circle" size={60} color="black" />
                                                    )}
                                                </View> */}
                                                <View style={{ width: '100%', justifyContent: 'center', marginHorizontal: 10 }}>
                                                    <View>
                                                        <Text style={{ color: "#000", fontWeight: "bold" }}>
                                                            {item.lastName} {item.firstName}
                                                        </Text>
                                                        <Text style={{ color: "#4d4d4d" }}>{item.category}</Text>

                                                        {/* {item.rating.rate > 0 ? (
                                                            <View style={{ flexDirection: 'row', marginTop: 10 }}>
                                                                {Array(Math.floor(item.rating.rate)).fill().map(element => <Ionicons name="star" size={16} color='#E0A100' />)}
                                                                <Text>{parseFloat(item.rating.rate) - Math.floor(item.rating.rate) > 0 && <Ionicons name="star-half-sharp" size={16} color='#118AB2' />}</Text>
                                                                <Text style={{ marginLeft: 5, color: "#000" }}>{item.rating.rate} stars</Text>
                                                            </View>
                                                        ) : (
                                                            <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 10 }}>
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Ionicons color={'#E0A100'} size={16} name="star-outline" />
                                                                <Text style={{ marginLeft: 5, color: "#000" }}>{item.rating.rate} stars</Text>
                                                            </View>
                                                        )} */}

                                                    </View>
                                                </View>

                                            </TouchableOpacity>


                                        )
                                    }
                                    )}
                                </>
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No Speakers yet...</Text>
                                </View>
                            )}
                        </>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <ActivityIndicator size='large' color='#0771b8' />
                        </View>
                    )

                }



            </ScrollView>

        </View>
    )
}

export default AllSpeaker;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})