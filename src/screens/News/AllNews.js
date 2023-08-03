import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, Platform, ActivityIndicator,RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RenderHtml from 'react-native-render-html';
import Ring from '../ChatRoom/Ring';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const AllNews = ({ navigation }) => {
    const [news, setNews] = useState({})

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
            {category:NEWS
            })
            {
                id,
                name,
                category,
                description,
                thumbnail,
            }
        }`
    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        console.log(Token)
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: query })
        }).then(response => response.json())
            .then(data => setNews(data.data.cmsByCategory))
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
                    <Text style={{ color: 'white', fontSize: 18 }}>News</Text>
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
            <ScrollView style={{ height: windowHeight * 5 / 6 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {JSON.stringify(news) != "{}" ? (
                    <>
                        {news.length > 0 ? (
                            <>
                                {news.map(new_ => {
                                    return (
                                        <View style={{ borderBottomColor: 'black', borderBottomWidth: 0.3, marginHorizontal: 10 }}>
                                            <Text style={{ fontSize: 20, marginTop: 20, fontWeight: "bold" }}>{new_.name}</Text>
                                            <Image source={{ uri: new_.thumbnail }} resizeMode='cover' style={{ width: "100%", height: windowHeight / 5 }} />
                                            <RenderHtml
                                                contentWidth={windowWidth}
                                                source={{
                                                    html: `
                                                        ${new_.description}`
                                                }}
                                            />
                                        </View>

                                    )
                                })}
                            </>
                        ) : (
                            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                <Text>No news yet...</Text>
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
    )
}

export default AllNews;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})