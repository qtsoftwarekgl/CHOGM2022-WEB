import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, Platform } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons } from '@expo/vector-icons';
import Ring from '../ChatRoom/Ring';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const NewsDetails = ({ navigation }) => {
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Common Wealth Breaking News</Text>
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
            <ScrollView style={{ height: windowHeight * 7 / 8 }}>

                <View style={{ marginHorizontal: 20 }}
                // onPress={()=>{navigation.navigate('NewsDetails')}}
                >
                    <Text style={{ color: "#12a58f", fontWeight: "bold", marginTop: '1%', marginHorizontal: 5 }}>
                        24.06.2022
                    </Text>
                    <Text style={{ color: "#000", fontWeight: "600", marginHorizontal: 5 }}>
                        Common Wealth Breaking News
                    </Text>
                    <View style={{ alignItems: 'center', marginTop: '2%' }}>
                        <Image source={require('../../images/news.jpg')}
                            resizeMode="cover"
                            style={{ width: "100%", height: 200, borderRadius: 20, overflow: "hidden" }}
                        />
                    </View>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ marginTop: '2%' }}>
                            <Text style={{ color: "#4d4d4d", marginBottom: 2 }}>
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
                                content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum
                                their default model text, and a search for 'lorem ipsum' will uncover.
                            </Text>
                            <Text style={{ color: "#4d4d4d", marginBottom: 2 }}>
                                It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.
                                The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here,
                                content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum
                                their default model text, and a search for 'lorem ipsum' will uncover
                            </Text>
                            <View style={{ flexDirection: 'row', marginBottom: 8, marginTop: 10 }}>
                                <Text style={{ color: "#0771b8", fontWeight: "bold", marginTop: 5 }}>
                                    Share it on:
                                </Text>
                                <FontAwesome name="facebook-square" size={24} color="#0771b8" style={{ width: "9%", marginLeft: 12 }} />
                                <FontAwesome name="twitter-square" size={24} color="#0771b8" style={{ width: "9%", marginLeft: 12 }} />
                                <FontAwesome5 name="instagram-square" size={24} color="#0771b8" style={{ width: "9%", marginLeft: 12 }} />
                                <FontAwesome5 name="youtube-square" size={24} color="#0771b8" style={{ width: "9%", marginLeft: 12 }} />
                            </View>
                        </View>
                    </View>


                </View>









            </ScrollView>

        </View>
    )
}

export default NewsDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
})