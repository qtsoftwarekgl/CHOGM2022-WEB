import React from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, Platform } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import Ring from '../ChatRoom/Ring';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const VisitRwanda = ({ navigation }) => {
    return (
        <View styles={styles.container}>
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Visit Rwanda</Text>
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

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: windowWidth / 18 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Visa') }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: windowWidth / 3, height: windowWidth / 3, borderRadius: 20, ...styles.shadow }}>
                        <Image source={require('../../images/visa2.png')} style={{ width: windowWidth / 9 }} resizeMode='contain' />
                        <Text style={{ color: "#0771B8", marginTop: 5 }}>Travel Visa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Accomodations') }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: windowWidth / 3, height: windowWidth / 3, borderRadius: 20, ...styles.shadow }}>
                        <MaterialIcons name="hotel" size={windowWidth / 9} color="#0771B8" />
                        <Text style={{ color: "#0771B8", marginTop: 5 }}>Accomodations</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: windowWidth / 18 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Locations') }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: windowWidth / 3, height: windowWidth / 3, borderRadius: 20, ...styles.shadow }}>
                        <Image source={require('../../images/location.png')} style={{ width: windowWidth / 9 }} resizeMode='contain' />
                        <Text style={{ color: "#0771B8", marginTop: 5 }}>Get around Rwanda</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate('Dining') }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: windowWidth / 3, height: windowWidth / 3, borderRadius: 20, ...styles.shadow }}>
                        <Image source={require('../../images/resto.png')} style={{ width: windowWidth / 9 }} resizeMode='contain' />
                        <Text style={{ color: "#0771B8", marginTop: 5 }}>Dine around Kigali</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: windowWidth / 18 }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('Shops') }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: windowWidth / 3, height: windowWidth / 3, borderRadius: 20, ...styles.shadow }}>
                        <Image source={require('../../images/shopping-cart.png')} style={{ width: windowWidth / 9, height: windowWidth / 9 }} resizeMode='contain' />
                        <Text style={{ color: "#0771B8", marginTop: 5 }}>Shop around Kigali</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity onPress={clea() => { navigation.navigate('Qrscanning') }} style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', width: windowWidth / 3, height: windowWidth / 3, borderRadius: 20, ...styles.shadow }}>
                        <MaterialIcons name="qr-code" size={windowWidth / 9} color="#0771B8" />
                        <Text style={{ color: "#0771B8", marginTop: 5 }}>Scan Restaurant</Text>
                    </TouchableOpacity> */}
                </View>

            </ScrollView>

        </View>
    )
}

export default VisitRwanda;

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
        shadowOpacity: 0.2,
        shadowRadius: 3.65,
        elevation: 8
    }
})