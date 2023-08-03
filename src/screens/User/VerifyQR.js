import React,{useState,useEffect} from 'react'
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
    Dimensions
  } from 'react-native'
import { AuthContext } from '../../context/context';
  import Icon from '@expo/vector-icons/Entypo';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const VerifyQR = (props) => {
    const [securetext, setsecuretext] = useState(true)
    const [loading, setLoading] = useState('')
    const [email, setEmail] = useState('')
    const updateSecureTextEntry = () => {
        setsecuretext(!securetext)
    }

    const { QRsignIn } = React.useContext(AuthContext);

    const login=()=>{
        setLoading(true)
        QRsignIn(email,props.route.params.data)
        setLoading(false)
    }

    

    return (

        <>


            <StatusBar barStyle='dark-content' backgroundColor="#000000" hidden={false} translucent={true} />




            <ImageBackground  source={require('../../images/Loginback.jpg')} style={styles.container} resizeMode="stretch">

                <View style={{ marginTop: "55%",marginBottom:15 }}>

                    <Text style={{ fontSize: 25,fontWeight:"bold",textAlign:"center",color:"#b4b4b4",letterSpacing: 5, }}>Verify your email</Text>
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
                    onPress={() => login()}
                    >
                        <View
                            style={{justifyContent:'center', backgroundColor: "#12a58f", width: windowWidth * 15 /16, height: "100%", alignItems: "center", borderRadius: 30 }}
                        >
                            {loading ? (
                                <ActivityIndicator size='large' color='white'  />
                            ) :
                                (
                                    <Text style={{ color: "white", fontSize: 20, fontWeight: "bold" }}>Login</Text>
                                )}

                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={{marginTop:15,alignItems:"center"}}
                    onPress={() => props.navigation.navigate("Login")}
                    >

                     <Text style={{color:"#0771b8"}}>Return to Login</Text>
                    </TouchableOpacity>


                </View>


            </ImageBackground>
        </>
    );
};


export default VerifyQR;

const styles = StyleSheet.create({

    container: {
        flex: 1,
        height:windowHeight,
        width:windowWidth
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
        justifyContent:'center',
        alignSelf:'center',
        color: '#12a58f',

    },
    textInput: {
        flex: 1,
        paddingLeft: 5,
        color: '#05375a',
        marginLeft: 20,
        justifyContent:"center"
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
})