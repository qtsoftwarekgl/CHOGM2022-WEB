import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, Platform, ActivityIndicator,RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, Foundation, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import * as Progress from 'react-native-progress';
import Ring from '../ChatRoom/Ring';

const NOC = ({ navigation }) => {
    const [stats, setStats] = useState({})
    const [tab, setTab] = useState('CHOGM')
    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);
    const changeForum = async (id) => {
        fetch("https://api.chogm2022.rw/web/index.php?r=v1/cms/statistics&event_id=" + id, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "app-type": "none",
                "app-version": "v1",
                "app-device": "Postman",
                "app-os": "Android 29",
                "app-device-id": "0",
                "x-auth": "b30e75d2-010c-4bd7-8408-3a97a9c77f64",
                "format": "json",
            },
        }).then(response => response.json())
            .then(data => {
                setStats(data.data)
            })
    }
    useEffect(async () => {

        changeForum(8064)
        setTab('CHOGM')

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
                    <Text style={{ color: 'white', fontSize: 18, letterSpacing: 2 }}>NOC</Text>
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


            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.5, height: 50, width: "100%" }}>
                <TouchableOpacity style={{ width: "33.3%", height: '100%', backgroundColor: '#0A2133', alignItems: 'center', justifyContent: 'center' }}>
                    <Foundation name="graph-bar" size={24} color="white" />
                    <Text style={{ color: '#fff' }}>Statistics</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Notifications') }} style={{ width: "33.%", height: '100%', backgroundColor: '#EBEBEB', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <MaterialCommunityIcons name="bell-check" size={24} color="black" />
                    <Text style={{ color: '#000' }}>Communications</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { navigation.navigate('Chat') }} style={{ width: "33.3%", height: '100%', backgroundColor: '#EBEBEB', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="md-chatbubbles-outline" size={24} color="black" />
                    <Text style={{ color: '#000' }}>Queries</Text>
                </TouchableOpacity>
            </View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity onPress={() => { changeForum(8064); setTab('CHOGM') }} style={{ width: (windowWidth / 3.3), height: 50, backgroundColor: tab === "CHOGM" ? '#0771B8' : '#D8D8D8', alignItems: 'center', justifyContent: 'center', marginRight: 1 }}>
                    <Text style={{ color: tab === "CHOGM" ? '#fff' : '#0771B8' }}>CHOGM</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { changeForum(2127); setTab('People Forum') }} style={{ width: (windowWidth / 3.3), height: 50, backgroundColor: tab === "People Forum" ? '#0771B8' : '#D8D8D8', alignItems: 'center', justifyContent: 'center', marginRight: 1 }}>
                    <Text style={{ color: tab === "People Forum" ? '#fff' : '#0771B8' }}>People Forum</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { changeForum(1463); setTab('Women Forum') }} style={{ width: (windowWidth / 3.3), height: 50, backgroundColor: tab === "Women Forum" ? '#0771B8' : '#D8D8D8', alignItems: 'center', justifyContent: 'center', marginRight: 1 }}>
                    <Text style={{ color: tab === "Women Forum" ? '#fff' : '#0771B8' }}>Women Forum</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { changeForum(3232); setTab('Business Forum') }} style={{ width: (windowWidth / 3.3), height: 50, backgroundColor: tab === "Business Forum" ? '#0771B8' : '#D8D8D8', alignItems: 'center', justifyContent: 'center', marginRight: 1 }}>
                    <Text style={{ color: tab === "Business Forum" ? '#fff' : '#0771B8' }}>Business Forum</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { changeForum(1559); setTab('Youth Forum') }} style={{ width: (windowWidth / 3.3), height: 50, backgroundColor: tab === "Youth Forum" ? '#0771B8' : '#D8D8D8', alignItems: 'center', justifyContent: 'center', marginRight: 1 }}>
                    <Text style={{ color: tab === "Youth Forum" ? '#fff' : '#0771B8' }}>Youth Forum</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => { changeForum(4326); setTab('Media') }} style={{ width: (windowWidth / 4) - 2, height: 50, backgroundColor: tab === "Media" ? '#0771B8' : '#D8D8D8', alignItems: 'center', justifyContent: 'center', marginRight: 1 }}>
                    <Text style={{ color: tab === "Media" ? '#fff' : '#0771B8' }}>Media</Text>
                </TouchableOpacity>


            </ScrollView>

            <ScrollView contentContainerStyle={{ height: (windowHeight * 7 / 8) - 20, marginHorizontal: windowWidth / 50, marginTop: 20 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
                <Text style={{ fontSize: 18, fontWeight: "900", marginTop: "5%", marginHorizontal: 20, letterSpacing: 2, color: "#4d4d4d" }}>{stats && stats.registered} Participants</Text>
                <View style={{ marginTop: '3%', width: '85%', marginHorizontal: 20 }}>
                    {JSON.stringify(stats) != "{}" && stats != undefined ? (
                        <>
                            {stats.categories.length > 0 ? (
                                <>
                                    {stats.categories.map(category => {
                                        return (
                                            <>
                                                {category.name == "Delegate" && (
                                                    <View style={{ marginVertical: "5%" }}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: '2%' }}>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>Delegates</Text>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>{category.count}</Text>
                                                        </View>
                                                        <Progress.Bar
                                                            progress={category.count / stats.registered}
                                                            width={windowWidth * 6 / 7}
                                                            height={10}
                                                            color={"#70b442"}
                                                            backgroundColor={"#b4b4b4"}
                                                            borderColor={"#fff"}
                                                            borderRadius={50}
                                                        />
                                                    </View>
                                                )}
                                                {category.name == "Speaker" && (
                                                    <View style={{ marginVertical: "5%" }}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: '2%' }}>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>Speakers</Text>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>{category.count}</Text>
                                                        </View>
                                                        <Progress.Bar
                                                            progress={category.count / stats.registered}
                                                            width={windowWidth * 6 / 7}
                                                            height={10}
                                                            color={"#fb8500"}
                                                            backgroundColor={"#b4b4b4"}
                                                            borderColor={"#fff"}
                                                            borderRadius={50}
                                                        />
                                                    </View>
                                                )}
                                                {category.name == "VIP" && (
                                                    <View style={{ marginVertical: "5%" }}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: '2%' }}>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>VIPs</Text>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>{category.count}</Text>
                                                        </View>
                                                        <Progress.Bar
                                                            progress={category.count / stats.registered}
                                                            width={windowWidth * 6 / 7}
                                                            height={10}
                                                            color={"#00b4d8"}
                                                            backgroundColor={"#b4b4b4"}
                                                            borderColor={"#fff"}
                                                            borderRadius={50}
                                                        />
                                                    </View>
                                                )}
                                                {category.name == "Unknown" && (
                                                    <View style={{ marginVertical: "5%" }}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: '2%' }}>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>Unknown</Text>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>{category.count}</Text>
                                                        </View>
                                                        <Progress.Bar
                                                            progress={category.count / stats.registered}
                                                            width={windowWidth * 6 / 7}
                                                            height={10}
                                                            color={"#000"}
                                                            backgroundColor={"#b4b4b4"}
                                                            borderColor={"#fff"}
                                                            borderRadius={50}
                                                        />
                                                    </View>
                                                )}
                                                {category.name == "Country Delegations" && (
                                                    <View style={{ marginVertical: "5%" }}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: '2%' }}>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>Country Delegations</Text>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>{category.count}</Text>
                                                        </View>
                                                        <Progress.Bar
                                                            progress={category.count / stats.registered}
                                                            width={windowWidth * 6 / 7}
                                                            height={10}
                                                            color={"red"}
                                                            backgroundColor={"#b4b4b4"}
                                                            borderColor={"#fff"}
                                                            borderRadius={50}
                                                        />
                                                    </View>
                                                )}
                                                {category.name == "Foreign Minister" && (
                                                    <View style={{ marginVertical: "5%" }}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: '2%' }}>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>Foreign Minister</Text>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>{category.count}</Text>
                                                        </View>
                                                        <Progress.Bar
                                                            progress={category.count / stats.registered}
                                                            width={windowWidth * 6 / 7}
                                                            height={10}
                                                            color={"#ffb20b"}
                                                            backgroundColor={"#b4b4b4"}
                                                            borderColor={"#fff"}
                                                            borderRadius={50}
                                                        />
                                                    </View>
                                                )}
                                                {category.name == "Head of Government" && (
                                                    <View style={{ marginVertical: "5%" }}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: '2%' }}>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>Head of Government</Text>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>{category.count}</Text>
                                                        </View>
                                                        <Progress.Bar
                                                            progress={category.count / stats.registered}
                                                            width={windowWidth * 6 / 7}
                                                            height={10}
                                                            color={"#8338ec"}
                                                            backgroundColor={"#b4b4b4"}
                                                            borderColor={"#fff"}
                                                            borderRadius={50}
                                                        />
                                                    </View>
                                                )}
                                                {category.name == "Media" && (
                                                    <View style={{ marginVertical: "5%" }}>
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: '2%' }}>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>Media</Text>
                                                            <Text style={{ marginLeft: 2, color: "#4d4d4d", }}>{category.count}</Text>
                                                        </View>
                                                        <Progress.Bar
                                                            progress={category.count / stats.registered}
                                                            width={windowWidth * 6 / 7}
                                                            height={10}
                                                            color={"#ff006e"}
                                                            backgroundColor={"#b4b4b4"}
                                                            borderColor={"#fff"}
                                                            borderRadius={50}
                                                        />
                                                    </View>
                                                )}
                                            </>

                                        )
                                    })}
                                </>
                            ) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                    <Text>No stats...</Text>
                                </View>
                            )}
                            {stats.gender.length > 0 && (
                                <>
                                    <View style={{ marginTop: "4%", justifyContent: "space-between", flexDirection: "row" }}>
                                        <View style={{ flexDirection: "row", marginLeft: 10 }}>

                                            <View>
                                                <Text style={{ color: "#4d4d4d", fontSize: 25, fontWeight: "bold" }}>{JSON.stringify((stats.gender[0].female / (stats.gender[0].total - stats.gender[0].none)) * 100).slice(0, 4)}%</Text>
                                            </View>
                                            <View style={{ marginLeft: 10 }}>
                                                <FontAwesome5 name="female" size={42} color="black" />
                                            </View>
                                        </View>

                                        <View style={{ flexDirection: "row", marginRight: 10 }}>

                                            <View style={{ marginRight: 10 }}>
                                                <FontAwesome5 name="male" size={42} color="black" />
                                            </View>
                                            <View>
                                                <Text style={{ color: "#4d4d4d", fontSize: 25, fontWeight: "bold" }}>{JSON.stringify((stats.gender[0].male / (stats.gender[0].total - stats.gender[0].none)) * 100).slice(0, 4)}%</Text>
                                            </View>
                                        </View>
                                    </View>

                                    <View style={{ alignItems: "center" }}>

                                        <View style={{ marginTop: 15 }}>
                                            <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000" }}>OTHER</Text>
                                        </View>
                                        <View>
                                            <Text style={{ color: "#4d4d4d", fontSize: 25, }}>{JSON.stringify((stats.gender[0].other / (stats.gender[0].total - stats.gender[0].none)) * 100).slice(0, 4)}%</Text>
                                        </View>
                                    </View>
                                </>

                            )}
                        </>
                    ) : (
                        <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                            <ActivityIndicator size='large' color='#0771b8' />
                        </View>
                    )}

                </View>

            </ScrollView>

        </View>
    )
}

export default NOC;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    shadow: {
        shadowColor: '#707070',
        shadowOffset: {
            width: 5,
            height: 5
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.65,
        elevation: 8
    }
})