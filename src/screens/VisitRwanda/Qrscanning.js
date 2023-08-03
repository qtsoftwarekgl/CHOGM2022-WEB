import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, Alert, Dimensions } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';

const Qrscanning = ({ navigation }) => {
    const [hasPermission, setHasPermission] = React.useState(false);
    const [scanData, setScanData] = React.useState();
    const [profile, setProfile] = useState({})


    useEffect(async () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === "granted");
        })();

        const id = await AsyncStorage.getItem('id')
        const Token = await AsyncStorage.getItem('token')
        const userQuery = `
    {
        user(id:${JSON.stringify(id)}){
            firstName,lastName
          }
    }
    `
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: userQuery })
        }).then(response => response.json())
            .then(data => setProfile(data.data.user))



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
    const fullname = profile.firstName
    console.log(fullname)
    const resto_alert = () => {
        Alert.alert(
            `Hello ${fullname} `,
            `You have a discount of 10% in  ${scanData} Thank you!`,
            [
                { text: "Confirm", onPress: () => navigation.navigate('VisitRwanda') }
            ]
        );
    }
    return (
        <View style={styles.container}>
            <BarCodeScanner
                style={StyleSheet.absoluteFillObject}
                onBarCodeScanned={scanData ? undefined : handleBarCodeScanned}
            />
            {scanData && resto_alert()}
            <StatusBar style="auto" />
            <TouchableOpacity style={{ backgroundColor: "#12a58f", width: "100%", height: "8%", alignContent: "center", justifyContent: "center", marginTop: windowHeight * 14 / 15, flexDirection: "row", alignItems: "center" }}
                onPress={() => { navigation.goBack() }}>
                <Ionicons name='chevron-back' size={30} style={styles.icon} />
                <Text style={{ color: "#fff", fontSize: 20, textAlign: "center" }}>Go back</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Qrscanning

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
