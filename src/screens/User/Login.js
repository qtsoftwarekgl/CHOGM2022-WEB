import React, { useState, useEffect } from 'react'
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ImageBackground,
    ActivityIndicator,
    StatusBar,
    TextInput,
    Dimensions,
    ScrollView
} from 'react-native';
import Modal from 'react-native-modal';
import Icon from '@expo/vector-icons/Entypo';
import { AntDesign, FontAwesome, Entypo, FontAwesome5, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import axios from 'axios';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Login = (props) => {
    const [securetext, setsecuretext] = useState(true)
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [isVisible, setisVisible] = useState(false)

    const updateSecureTextEntry = () => {
        setsecuretext(!securetext)
    }



    const options = {
        headers: {
            "Content-Type": "application/json",
            "app-type": "none",
            "app-version": "v1",
            "app-device": "Postman",
            "app-os": "Android 29",
            "app-device-id": "0",
            "x-auth": "c8355970-8d63-4f70-b26f-878c27f12003",
            "format": "json"
        }
    };

    const sendOtp = async () => {
        console.log(email)
        const generateOtp = `
        mutation generateOtp{
            generateOtp(email:${JSON.stringify(email)})
          }
    `


        setLoading(true)
        try {
            fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: generateOtp })
            }).then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.errors) {
                        setLoading(false)
                        alert(data.errors[0].message)
                    }
                    else {
                        setLoading(false)
                        props.navigation.navigate('OTP', { 'email': email })
                    }
                })
        } catch (error) {
            setLoading(false)
            alert('Your email is invalid')
        }

    }

    return (

        <View style={{ backgroundColor: "#fff" }}>

            <StatusBar barStyle='dark-content' backgroundColor="#000000" hidden={false} translucent={true} />

            <TouchableOpacity style={styles.cross} onPress={() => { setisVisible(true) }} >
                <FontAwesome5 name='book-open' size={30} style={styles.iconss} />
                <Text style={{ color: "#000" }}>Login Guide</Text>
            </TouchableOpacity>

            <ImageBackground source={require('../../images/Loginback.jpg')} style={styles.container} resizeMode="stretch">

                <View style={{ marginTop: windowHeight / 3, marginBottom: 15 }}>

                </View>

                <View style={styles.Formcontainer}>
                    <Icon
                        name="mail"
                        color="grey"
                        size={20}
                        style={[styles.icon, { marginLeft: 20 }]}
                    />

                    <TextInput
                        placeholder="Email"
                        placeholderTextColor="#666666"
                        keyboardType='email-address'
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => setEmail(val)}
                    />
                </View>


                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity
                        style={styles.signIn}
                        // onPress={() => { loginHandle(data.phone, data.password) }}
                        onPress={() => sendOtp()}
                    >
                        <View
                            style={{ backgroundColor: "#12a58f", justifyContent: 'center', width: windowWidth * 15 / 16, height: "100%", alignItems: "center", borderRadius: 30 }}
                        >
                            {loading ? (
                                <ActivityIndicator size='large' color='white' />
                            ) :
                                (
                                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Next</Text>
                                )}

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => props.navigation.navigate('QRscanner')} style={{ justifyContent: 'center', width: windowWidth, height: 30, alignItems: "center" }}>
                        <Text>Or click here to scan the  <Text style={{ color: '#FF9500', fontSize: 15 }}>QR code</Text></Text>
                    </TouchableOpacity>
                </View>
                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginTop: windowHeight / 6 }}>
                    <TouchableOpacity onPress={() => props.navigation.navigate('About_')} style={{ borderRightColor: '#0771b8', borderRightWidth: 1, justifyContent: 'center', width: windowWidth / 5, height: 30, alignItems: "center" }}>
                        <Text style={{ color: '#0771b8', fontSize: 25 }}>About</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => props.navigation.navigate('News')} style={{ justifyContent: 'center', width: windowWidth / 5, height: 30, alignItems: "center" }}>
                        <Text style={{ color: '#0771b8', fontSize: 25 }}>News</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>

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
                        <View style={{ width: '100%', backgroundColor: '#e8e8f5', borderRadius: 20 }}>
                            <Image source={require('../../images/CHOGM.png')} resizeMode="stretch" style={styles.imagetop} />
                            <ScrollView style={{ maxHeight: windowHeight / 2 }}>

                                <Text style={{ color: "#4d4d4d", fontSize: 15, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginHorizontal: 20 }}>Thank you for downloading the CHOGM2022 app.</Text>

                                <Text style={{ color: "#4d4d4d", fontSize: 15, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginHorizontal: 20 }}>This event app is designed to give CHOGM2022 delegates a comprehensive and interactive guide, with all the information they need in the palm of their hand, and to enjoy the various activities Rwanda has to offer.</Text>

                                <Text style={{ color: "#4d4d4d", fontSize: 15, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginHorizontal: 20 }}>1. If you are already a CHOGM registered delegate, follow the steps below:</Text>

                                <Text style={{ color: "#4d4d4d", fontSize: 15, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginHorizontal: 20 }}>- Login: Enter the email address used for your CHOGM accreditation, or scan the QR code on your badge.</Text>

                                <Text style={{ color: "#4d4d4d", fontSize: 15, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginHorizontal: 20 }}>- OTP: Enter the one-time password (a 6-digit code sent to your email address, after clicking on login)</Text>

                                <Text style={{ color: "#4d4d4d", fontSize: 15, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginHorizontal: 20 }}>If you are part of an official delegation and do not know or have the email address used ,please  contact your Delegation  Accreditation Officer (DAO)</Text>

                                <Text style={{ color: "#4d4d4d", fontSize: 15, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginHorizontal: 20 }}>2. If you are not accredited or registered for CHOGM, you will only be able to enjoy  the "Gallery" and "News" sections of this App.</Text>

                                <Text style={{ color: "#4d4d4d", fontSize: 15, fontWeight: "bold", marginTop: 10, marginLeft: 20, marginHorizontal: 20 }}> If you need help, please contact support@chogm2022.rw.</Text>

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
        </View>
    );
};


export default Login;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        height: windowHeight,
        width: windowWidth
    },
    forgotpass: {
        color: "#0096C7",
        fontSize: 14,

        marginLeft: 20,
        marginTop: 15
    },
    Formcontainer: {
        flexDirection: 'row',
        marginBottom: 5,
        height: 50,
        borderWidth: 1,
        borderColor: "#12a58f",
        borderRadius: 30,
        marginHorizontal: 20
    },
    icon: {
        justifyContent: 'center',
        alignSelf: 'center',
        color: '#12a58f',

    },
    textInput: {
        flex: 1,
        paddingLeft: 5,
        color: '#05375a',
        marginLeft: 20,
        justifyContent: "center"
    },
    signIn: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        paddingLeft: 40,
        paddingRight: 40
    },
    cross: {
        alignItems: "flex-start",
        alignSelf: "center",
        justifyContent: "center",

    },
    iconss: {
        marginTop: 40,
        color: "#000",
        fontWeight: "bold",
        marginLeft: 20
    },
    imagetop: {
        width: 200,
        height: 100,
        marginTop: 15,
        alignSelf: "center"
    },
})