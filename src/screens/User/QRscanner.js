import { StyleSheet, Text, View, Button, StatusBar, TouchableOpacity,Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { AntDesign, FontAwesome, Entypo, FontAwesome5, Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons'
import { AuthContext } from '../../context/context';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const QRscanner = ({ navigation }) => {
    const [hasPermission, setHasPermission] = React.useState(false);
    const [scanData, setScanData] = React.useState();

    const { QRsignIn } = React.useContext(AuthContext);

    const login=()=>{
        // QRsignIn(props.route.params.email,otp)
    }
    useEffect(() => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();
    }, []);

    if (!hasPermission) {
        return (
            <View style={styles.container}>
                <Text>Please grant camera permissions to app.</Text>
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }) => {
        setScanData(data);
        console.log(`Data: ${data}`);
        console.log(`Type: ${type}`);
    };
    return (
        <View style={styles.container}>
            <BarCodeScanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
            />
            {scanData && navigation.navigate('VerifyQR',{'data':scanData})}
            <StatusBar style="auto" />
            <TouchableOpacity style={{ backgroundColor: "#12a58f", width: "100%", height: "8%", alignContent: "center", justifyContent: "center", marginTop: windowHeight * 14 / 15, flexDirection: "row",alignItems:"center"}}
                onPress={() => navigation.navigate("Login")}>
                <Ionicons name='chevron-back' size={30} style={styles.icon} />
                <Text style={{ color: "#fff", fontSize: 20, textAlign: "center"}}>Go back to login</Text>
            </TouchableOpacity>
        </View>
    )
}

export default QRscanner

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: "#fff",
        fontWeight: "bold",
    },
});