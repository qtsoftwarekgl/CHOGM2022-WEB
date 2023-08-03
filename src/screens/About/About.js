import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    StatusBar,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    Linking,
    Platform,
    RefreshControl
} from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons'
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import Ring from '../ChatRoom/Ring';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from "react-native-webview";


const About = ({ navigation }) => {
    const [about, setAbout] = useState({});
    const [tab, setTab] = useState("ABOUT_CONFERENCE");
    const { width } = useWindowDimensions()

    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);



    const changeForum = async (name) => {
        const Token = await AsyncStorage.getItem('token')
        const query = `
    {
        cmsByCategory(CmsCategoryInput:
            {category:${name}
            })
            {
                id,
                name,
                category,
                description,
                thumbnail,
            }
        }`

        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: query })
        }).then(response => response.json())
            .then(data => {
                console.log(data)
                setAbout(data.data.cmsByCategory);
            })
    }

    useEffect(async () => {
        changeForum("ABOUT_CONFERENCE")

    }, [])

    return (
        <View style={{ backgroundColor: "#fff" }}>

            <View style={{ width: '100%', height: windowHeight / 8, backgroundColor: '#0A2133', flexDirection: 'row' }}>

                <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
                    <Text style={{ color: 'white', fontSize: 18 }}>CHOGM 2022</Text>
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

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2, height: 50, width: "100%" }}>
                <TouchableOpacity onPress={() => { changeForum("ABOUT_CONFERENCE"); setTab("ABOUT_CONFERENCE") }}
                    style={{ width: "50%", height: '100%', backgroundColor: tab === "ABOUT_CONFERENCE" ? '#0A2133' : '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: tab === "ABOUT_CONFERENCE" ? '#FFF' : '#000' }}>About CHOGM</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { changeForum("COMSEC"); setTab("cosec") }}
                    style={{ width: "50%", height: '100%', backgroundColor: tab === "cosec" ? '#0A2133' : '#ebebeb', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: tab === "cosec" ? '#fff' : '#000' }}>Commonwealth Secretariat</Text>
                </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ height:(windowHeight * 7 / 8) -( windowHeight / 4.2)-10 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                <View style={{ alignItems: "center" }}>
                    <Image source={require('../../images/CHOGM.png')} resizeMode={"contain"} style={{ width: windowWidth, height: windowHeight / 4.1 }} />
                </View>

                <View style={{ marginHorizontal: windowWidth / 12 }}>
                    {/* Html */}

                    <View style={{ height: windowHeight / 1.6, marginTop: 0 }}>
                        {JSON.stringify(about) != "{}" ? (
                            about.length > 0 ? (

                                <WebView source={{ html: `<span style="font-size:55px;">${about[0].description}</span>` }} />
                            ) : (

                                <Text style={{ marginTop: 40 }}>No Info yet...</Text>
                            )
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                <ActivityIndicator size='large' color='#0771b8' />
                            </View>
                        )}

                    </View>


                    {/* Footer */}


                </View>
            </ScrollView>

            <View style={styles.social}>
                <Text style={{ color: '#0771b8' }}>
                    Visit Our Social Media Pages
                </Text>
                <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", marginTop: 5,height:70 }}>
                    <TouchableOpacity style={{ width: '9%' }} onPress={() => { Linking.openURL('https://www.facebook.com/chogm2022') }} >
                        <FontAwesome name="facebook-square" size={35} color="#0771b8" style={{ width: "100%" }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '9%', marginLeft: 10 }} onPress={() => { Linking.openURL('https://twitter.com/chogm2022?s=21&t=tsX-cYgyRfhGxg14SuMP9w') }} >
                        <FontAwesome name="twitter-square" size={35} color="#0771b8" style={{ width: "100%" }} />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '9%', marginLeft: 10 }} onPress={() => { Linking.openURL('https://instagram.com/chogm2022?igshid=YmMyMTA2M2Y=') }} >
                        <FontAwesome5 name="instagram-square" size={35} color="#0771b8" style={{ width: "100%" }} />
                    </TouchableOpacity>
                    <FontAwesome5 name="youtube-square" size={35} color="#0771b8" style={{ width: "9%", marginLeft: 10 }} />
                </View>
            </View>

        </View>
    )
}

export default About


const styles = StyleSheet.create({
    shadow: {
        shadowColor: "#707070",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.8,
        shadowRadius: 4.65,

        elevation: 8,
    },
    imagetop: {
        width: windowWidth / 1.1,
        height: windowHeight / 4,
        marginTop: 15
    },
    social: {

        alignItems: "center",
        marginTop: '6%',
        marginBottom: '1%'
    }
})