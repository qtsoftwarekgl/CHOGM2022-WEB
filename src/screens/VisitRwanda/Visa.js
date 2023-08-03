import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Platform, TouchableOpacity, StatusBar, ScrollView, Dimensions, RefreshControl, ActivityIndicator } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ring from '../ChatRoom/Ring';

const Visa = ({ navigation }) => {
    const [tab, setTab] = useState(1);

    const toggleTab = (index) => {
        setTab(index);
    }

    const [Visaonarrival, setVisaonarrival] = useState({});
    const [Visitors, setVisitors] = useState({});
    const [Transit, setTransit] = useState({});
    const { width } = useWindowDimensions()
    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);


    const query = `
    {
        cmsByCategory(CmsCategoryInput:
            {category:VISA_ON_ARRIVAL
            })
            {
                id,
                name,
                description,
            }
    }`
    const visitorsVisa = `
    {
        cmsByCategory(CmsCategoryInput:
            {category:VISITORS_VISA
            })
            {
                id,
                name,
                description,
            }
    }`
    const TransitVisa = `
    {
        cmsByCategory(CmsCategoryInput:
            {category:TRANSIT_VISA
            })
            {
                id,
                name,
                description,
            }
    }`
    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')

        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: query })
        }).then(response => response.json())
            .then(data => setVisaonarrival(data.data.cmsByCategory))
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: visitorsVisa })
        }).then(response => response.json())
            .then(data => setVisitors(data.data.cmsByCategory))
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: TransitVisa })
        }).then(response => response.json())
            .then(data => setTransit(data.data.cmsByCategory))
    }, [])
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Visa Rwanda</Text>
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

            {tab === 1 ? (

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.5, height: 70, width: "100%" }}>
                    <TouchableOpacity onPress={() => toggleTab(1)}
                        style={{ width: "33.3%", height: '100%', backgroundColor: '#0A2133', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5 name="plane-arrival" size={24} color="white" />
                        <Text style={{ color: '#fff' }}>Visa on arrival</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleTab(2)}
                        style={{ width: "33.%", height: '100%', backgroundColor: '#EBEBEB', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="male" size={24} color="black" />
                        <Text style={{ color: '#000' }}>Visitors Visa</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleTab(3)}
                        style={{ width: "33.3%", height: '100%', backgroundColor: '#EBEBEB', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome5 name="plane-departure" size={24} color="black" />
                        <Text style={{ color: '#000' }}>Transit Visa</Text>
                    </TouchableOpacity>
                </View>
            ) : (

                tab === 2 ? (

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.5, height: 70, width: "100%" }}>
                        <TouchableOpacity onPress={() => toggleTab(1)}
                            style={{ width: "33.3%", height: '100%', backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="plane-arrival" size={24} color="black" />
                            <Text style={{ color: '#000' }}>Visa on arrival</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => toggleTab(2)}
                            style={{ width: "33.%", height: '100%', backgroundColor: '#0A2133', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome name="male" size={24} color="white" />
                            <Text style={{ color: '#fff' }}>Visitors Visa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => toggleTab(3)}
                            style={{ width: "33.3%", height: '100%', backgroundColor: '#EBEBEB', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="plane-departure" size={24} color="black" />
                            <Text style={{ color: '#000' }}>Transit Visa</Text>
                        </TouchableOpacity>
                    </View>

                ) : (

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.5, height: 70, width: "100%" }}>
                        <TouchableOpacity onPress={() => toggleTab(1)}
                            style={{ width: "33.3%", height: '100%', backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="plane-arrival" size={24} color="black" />
                            <Text style={{ color: '#000' }}>Visa on arrival</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => toggleTab(2)}
                            style={{ width: "33.%", height: '100%', backgroundColor: '#ebebeb', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome name="male" size={24} color="black" />
                            <Text style={{ color: '#000' }}>Visitors Visa</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => toggleTab(3)}
                            style={{ width: "33.3%", height: '100%', backgroundColor: '#0A2133', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesome5 name="plane-departure" size={24} color="white" />
                            <Text style={{ color: '#fff' }}>Transit Visa</Text>
                        </TouchableOpacity>
                    </View>

                )

            )

            }





            <ScrollView style={{ height: (windowHeight * 7 / 8) - 100 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {tab === 1 ? (
                    <>
                        {JSON.stringify(Visaonarrival) != "{}" && Visaonarrival.length>0? (
                            <Text style={{ fontSize: 26, fontWeight: "900", marginTop: "5%", marginHorizontal: 20, letterSpacing: 2, color: "#4d4d4d" }}>{Visaonarrival[0].name}</Text>

                        ) : (
                            <></>
                        )}
                        <View style={{ marginTop: '5%', width: '85%', alignItems: 'center', marginHorizontal: 20 }}>

                            <View>
                                {JSON.stringify(Visaonarrival) != "{}" ? (
                                    Visaonarrival.length > 0 ? (

                                        <RenderHtml
                                            contentWidth={width}
                                            source={{
                                                html: ` 
                                    ${Visaonarrival[0].description}`
                                            }}
                                        />
                                    ) : (

                                        <Text style={{ marginTop: 40 }}>No Info yet...</Text>
                                    )
                                ) : (
                                    <ActivityIndicator style={{ marginTop: 40 }} size='large' color="#0771b8" />
                                )}
                            </View>
                        </View>
                    </>
                ) : (

                    tab === 2 ? (


                        <>
                            {JSON.stringify(Visitors) != "{}" && Visitors.length>0 ? (
                                <Text style={{ fontSize: 26, fontWeight: "900", marginTop: "5%", marginHorizontal: 20, letterSpacing: 2, color: "#4d4d4d" }}>{Visitors[0].name}</Text>

                            ) : (
                                <></>
                            )}
                            <View style={{ marginTop: '5%', width: '85%', alignItems: 'center', marginHorizontal: 20 }}>

                                <View >
                                    {JSON.stringify(Visitors) != "{}" ? (
                                        Visitors.length > 0 ? (

                                            <RenderHtml
                                                contentWidth={width}
                                                source={{
                                                    html: ` 
                                    ${Visitors[0].description}`
                                                }}
                                            />
                                        ) : (

                                            <Text style={{ marginTop: 40 }}>No Info yet...</Text>
                                        )
                                    ) : (
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                            <ActivityIndicator size='large' color='#0771b8' />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </>

                    ) : (

                        <>
                            {JSON.stringify(Transit) != "{}" && Transit.length>0 ? (
                                <Text style={{ fontSize: 26, fontWeight: "900", marginTop: "5%", marginHorizontal: 20, letterSpacing: 2, color: "#4d4d4d" }}>{Transit[0].name}</Text>

                            ) : (
                                <></>
                            )}
                            <View style={{ marginTop: '5%', width: '85%', alignItems: 'center', marginHorizontal: 20 }}>

                                <View >
                                    {JSON.stringify(Transit) != "{}" ? (
                                        Transit.length > 0 ? (

                                            <RenderHtml
                                                contentWidth={width}
                                                source={{
                                                    html: ` 
                                    ${Transit[0].description}`
                                                }}
                                            />
                                        ) : (

                                            <Text style={{ marginTop: 40 }}>No Info yet...</Text>
                                        )
                                    ) : (
                                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                            <ActivityIndicator size='large' color='#0771b8' />
                                        </View>
                                    )}
                                </View>
                            </View>
                        </>


                    )

                )}




            </ScrollView>

        </View>
    )
}

export default Visa;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})