import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    StatusBar,
    ImageBackground,
    ScrollView,
    TextInput,
    ActivityIndicator
} from "react-native";
import { MaterialCommunityIcons, FontAwesome5, Feather, Ionicons, Entypo, AntDesign, MaterialIcons, Fontisto } from "@expo/vector-icons";
import { TextInputMask } from 'react-native-masked-text';
import { AuthContext } from '../../context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Profile = ({ navigation }) => {
    const [stats, setStats] = useState({})
    const [Profile, setProfile] = useState({})
    useEffect(async () => {
        const id = await AsyncStorage.getItem('id')
        const Token = await AsyncStorage.getItem('token')
        console.log("usertokenprofile", Token)
        const userQuery = `
    {
        user(id:${JSON.stringify(id)}){
            firstName,lastName,qrcodeData,title,avatar,occupation,category,passport
          }
    }
    `
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: userQuery })
        }).then(response => response.json())
            .then(data => {
                setProfile(data.data.user);
                console.log(data);
                console.log("name", data.data.user.firstName)
                const covidQuery = `query covidResults{
                    covidResult {
                      testDate
                      testResult
                      testType
                    }
                  }`
                fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
                    body: JSON.stringify({ query: covidQuery })
                }).then(response => response.json())
                    .then(data => {
                        if (data.data === null) {
                            setStats([])
                        } else {
                            setStats(data.data.covidResult)
                            console.log(data.data.covidResult)
                        }

                    })
                // if (data.data.user.identity.identityType === "passport") {

                //     fetch(`https://his.hmis.moh.gov.rw/results/api/covid_results/?passport=${data.data.user.identity.identityNumber}`, {
                //         method: "GET",
                //         headers: {
                //             "Content-Type": "application/json",
                //             "Authorization": "Basic YXBpX3VzZXJfcXQ6RjlSQFpwMlRqR2NBQ3E2",
                //         },
                //     }).then(response => response.json())
                //         .then(data => {
                //             setStats(data)
                //         })

                // } else {
                //     fetch(`https://his.hmis.moh.gov.rw/results/api/covid_results/?national_id=${data.data.user.identity.identityNumber}`, {
                //         method: "GET",
                //         headers: {
                //             "Content-Type": "application/json",
                //             "Authorization": "Basic YXBpX3VzZXJfcXQ6RjlSQFpwMlRqR2NBQ3E2",
                //         },
                //     }).then(response => response.json())
                //         .then(data => {
                //             setStats(data)
                //         })

                // }

            })



    }, [])

    const format = (amount) => {
        return Number(amount)
            .toFixed(2)
            .replace(/\d(?=(\d{3})+\.)/g, '$&,')
    };
    const context = useContext(AuthContext)
    return (
        <>
            <StatusBar backgroundColor="#0A2133" translucent={false} hidden={false} barStyle="light-content" />
            <View style={{
                height: 100,
                paddingTop: 20,
                backgroundColor: '#0A2133',
                justifyContent: "center",
                ...styles.shadow
            }}>
                <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Home') }} style={{ width: "20%", alignItems: "center", marginTop: 1 }}>
                        <Ionicons name="arrow-back" size={40} color="white" />
                    </TouchableOpacity>

                    <View style={{ width: "60%", alignItems: "flex-start", marginTop: 4 }}>
                        <Text style={[styles.Title, { color: "white" }]}>COVID-19</Text>
                        <Text style={{ color: '#fff', marginLeft: 15 }}>Test Result</Text>
                    </View>

                </View>
            </View>

            {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, height: 50, width: "100%" }}>
                <TouchableOpacity onPress={() => { setTab('test') }}
                    style={{ width: "50%", height: '100%', backgroundColor: tab === "test" ? '#0A2133' : '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: tab === "test" ? '#fff' : '#000' }}>Test</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setTab('vaccine') }}
                    style={{ width: "50%", height: '100%', backgroundColor: tab === "vaccine" ? '#0A2133' : '#ebebeb', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: tab === "vaccine" ? '#fff' : '#000' }}>Vaccine</Text>
                </TouchableOpacity>
            </View> */}
            <View>



                {JSON.stringify(stats) != "{}" && JSON.stringify(Profile) != "{}" ? (

                    JSON.stringify(stats) != "[]" && stats.testResult != "" ? (
                        <>
                            <View style={{ alignItems: "center" }}>
                                {stats.testResult === "Positive" ? (
                                    <MaterialIcons name="coronavirus" size={80} color="#db00b6" style={{ marginTop: 20 }} />
                                ) : (
                                    <Feather name="check-circle" size={80} color="#0F57A9" style={{ marginTop: 20 }} />
                                )}
                            </View>
                            <View style={{ justifyContent: "center" }}>
                                <Text style={{ textAlign: "center", color: "#12A58F", fontSize: 25, }}>Hello {Profile.firstName} {Profile.lastName}</Text>
                                <Text style={{ textAlign: "center", color: "#12A58F", fontSize: 30, }}>Your test is</Text>
                                {stats.testResult === "Positive" ? (
                                    <>
                                        <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 35, color: "#db00b6" }}>{stats.testResult} <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 30, color: "#12A58F" }}>for COVID-19</Text></Text>
                                        <Text style={{ textAlign: "center" }}>Please consult a healthcare profesional</Text>
                                    </>
                                ) : (
                                    <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 35, color: "#0F57A9" }}>{stats.testResult} <Text style={{ textAlign: "center", fontWeight: "bold", fontSize: 30, color: "#12A58F" }}>for COVID-19</Text></Text>
                                )}
                            </View>
                            <View style={{ justifyContent: "center", marginTop: 20, marginHorizontal: 30 }}>
                                <View style={{ flexDirection: "row", marginBottom: 10 }}>
                                    <MaterialCommunityIcons name="test-tube" size={28} color="#12A58F" />
                                    <Text style={{ textAlign: "center", marginLeft: 10, marginTop: 5 }}>{stats.testType}</Text>
                                </View>
                                <View style={{ flexDirection: "row" }}>
                                    <Fontisto name="date" size={24} color="#12A58F" />
                                    <Text style={{ textAlign: "center", marginLeft: 10, marginTop: 5 }}>{stats.testDate}</Text>
                                </View>
                            </View>

                        </>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <Text style={{ fontWeight:"900" }}>No test result for you</Text>
                        </View>
                    )
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                        <ActivityIndicator size='large' color='#0771b8' />
                    </View>
                )}



            </View>

            {/* <View style={styles.container} >
                <View style={{ alignItems: 'center', marginTop: 15, marginLeft: 10 }}>
                    <Fontisto name="injection-syringe" size={40} color="white" />
                </View>
                <View style={{ justifyContent: 'center', flexDirection: "row", width: "100%", marginTop: 5 }}>
                    <View style={{ marginTop: 5 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Vaccine Doses</Text>
                    </View>


                </View>
                <View style={{ flexDirection: "row", width: "100%", marginTop: 15, padding: 10 }}>
                    <View style={{ width: "50%", marginTop: 5 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Dose 1</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', width: "50%", marginTop: 5 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Pfizer</Text>
                        <Text style={{ color: 'white', fontSize: 14 }}>2021-05-10</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", width: "100%", marginTop: 15, padding: 10 }}>
                    <View style={{ width: "50%", marginTop: 5 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Dose 2</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', width: "50%", marginTop: 5 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Pfizer</Text>
                        <Text style={{ color: 'white', fontSize: 14 }}>2021-07-10</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row", width: "100%", marginTop: 15, padding: 10 }}>
                    <View style={{ width: "50%", marginTop: 5 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Dose 3</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', width: "50%", marginTop: 5 }}>
                        <Text style={{ color: 'white', fontSize: 20 }}>Pfizer</Text>
                        <Text style={{ color: 'white', fontSize: 14 }}>2021-10-10</Text>
                    </View>
                </View>
            </View> */}


        </>
    );
};


export default Profile;

const styles = StyleSheet.create({

    container: {
        backgroundColor: "#12a58f",
        width: "92%",
        marginHorizontal: 15,
        marginTop: 25,
        borderRadius: 20,
        paddingHorizontal: 30

    },
    Title: {
        fontSize: 16,
        fontWeight: "bold",
        marginHorizontal: 15,
        marginTop: 5,
        color: "#05375a"
    },
    Texties: {
        fontSize: 12,
        fontWeight: "normal",
        marginHorizontal: 15,
        color: "#f4a261",
        marginTop: 1,

    },
    shadow: {
        shadowColor: "#707070",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
    },
    Tab: {
        flexDirection: "row",
        marginHorizontal: 10,
        marginLeft: 12,
        height: 50,
        flex: 1,
        alignContent: "center",
        alignItems: "center",
        shadowColor: "#707070",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.5,
        shadowRadius: 4.65,

        elevation: 8,
    },
    textInput: {

        borderRadius: 10,
        alignSelf: 'center',
        height: 55,
        width: "90%",
        marginTop: 10,
        textAlign: "left",
        padding: 10,
        flex: 1,
        borderBottomWidth: 1
    }

})