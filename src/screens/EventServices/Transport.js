import React, { useState, useEffect } from 'react'
import {
    View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, ImageBackground, ActivityIndicator, Linking,
    Platform, RefreshControl, Share
} from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo, MaterialIcons, AntDesign } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageViewer from 'react-native-image-zoom-viewer';
import Modal from 'react-native-modal';
import Ring from '../ChatRoom/Ring';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import { StorageAccessFramework } from 'expo-file-system';

const Transport = ({ navigation }) => {
    const [tab, setTab] = useState(1);

    const toggleTab = (index) => {
        setTab(index);
    }
    ``
    const [Shuttle, setShuttle] = useState({});
    const [Rental, setRental] = useState({});
    const [Index, setIndex] = useState({});
    const [loading, setLoading] = useState(false)
    const [Progress, setProgress] = useState({});
    const { width } = useWindowDimensions()
    const [isVisible, setisVisible] = useState(false)

    const [refreshing, setRefreshing] = useState(false);

    const wait = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        wait(2000).then(() => setRefreshing(false));
    }, []);

    const shutlles = `
    {
        cmsByCategory(CmsCategoryInput:
            {category:TRANSPORT_SHUTTLE_SERVICES
            })
            {
                id,
                name,
                description,
                thumbnail,
                otherInfo{
                    pdfFile
                }
            }
    }`
    const Rentals = `
    {
        cmsByCategory(CmsCategoryInput:
            {
                category:TRANSPORT_CAR_RENTALS
            })
            {
                id,
                name,
                description,
                otherInfo{
                    website,
                    contactEmail,
                    contactPhone,
                    pdfFile
                }
            }
    }`
    useEffect(async () => {
        const Token = await AsyncStorage.getItem('token')
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: shutlles })
        }).then(response => response.json())
            .then(data => setShuttle(data.data.cmsByCategory))
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: Rentals })
        }).then(response => response.json())
            .then(data => setRental(data.data.cmsByCategory))
    }, [])

    // DOWNLOAD

    const callback = downloadProgress => {
        const progress = downloadProgress.totalBytesWritten / downloadProgress.totalBytesExpectedToWrite;
        setProgress(progress)
    };

    

    const downloadfile = async (pdf) => {
        const downloadResumable = FileSystem.createDownloadResumable(
            pdf.replace(/\s/g, '%20'),
            FileSystem.documentDirectory + 'ACshuttle.pdf',
            {},
            callback
        );

        try {
            const { uri } = await downloadResumable.downloadAsync();
            if(Platform.OS==="android"){
                const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
                if (!permissions.granted) {
                    return;
                }
               const base64Data = await FileSystem.readAsStringAsync(uri,
                { encoding: FileSystem.EncodingType.Base64 });
            await StorageAccessFramework.createFileAsync(permissions.directoryUri, 'shuttle', 'application/pdf')
            .then(async(r) => {await FileSystem.writeAsStringAsync(r, base64Data, { encoding: FileSystem.EncodingType.Base64 });console.log(r);
            })
            .catch((e) => {
                console.log(e);
            }); 
            setTimeout(()=>{alert('File successfully downloaded!')},1000)
            }
            else{
                share_(uri)
            }
            
        } catch(e) {
            console.log(e);
        };


    }


    const share_ = async (url) => {
        try {
          const result = await Share.share({
            url
          });
    
        //   if (result.action === Share.sharedAction) {
        //     if (result.activityType) {
        //       // shared with activity type of result.activityType
        //     } else {
        //       // shared
        //     }
        //   } else if (result.action === Share.dismissedAction) {
        //     // dismissed
        //   }
        } catch (error) {
          alert(error.message);
        }
      }

    // alternative



    const downloadAlbum = async () => {

        const perm = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (perm.status != 'granted') {
            return;
        }

        try {
            const asset = await MediaLibrary.createAssetAsync('https://chogmapi.qtsoftwareltd.com:3000/2022_5_14_194_Shuttle%20Schedules.pdf');
            const album = await MediaLibrary.getAlbumAsync('Chogm');
            if (album == null) {
                await MediaLibrary.createAlbumAsync('Chogm', asset, false);
                console.log("file succesfuly downloaded")
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                console.log("file succesfuly downloaded")
            }
        } catch (e) {
            console.log(e)
        }

    }


    // alternative 2

    const downloadFileinalbum = async (fileimage) => {
        console.log(fileimage.replace(/\s/g, '%20'))
        const uri = fileimage.replace(/\s/g, '%20')
        let fileUri = FileSystem.documentDirectory + `ACshuttle.jpg`;
        FileSystem.downloadAsync(uri, fileUri)
            .then(({ uri }) => {
                saveFile(uri);
            })
            .catch(error => {
                console.error(error);
            })
    }

    const saveFile = async (fileUri) => {
        setLoading(true)
        const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
        if (status === "granted") {
            const album = await MediaLibrary.getAlbumAsync('Chogm');
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            if (album == null) {
                await MediaLibrary.createAlbumAsync('Chogm', asset, false);
                setLoading(false)
                alert("File succesfuly downloaded")
            } else {
                await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
                setLoading(false)
                alert("File succesfuly downloaded")
            }
        }
    }



    //   SHARE


    const onShare = async (filename) => {
        try {
            const result = await Share.share({
                url: filename,
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <View style={{ backgroundColor: "#f5f5f5" }}>
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
                    <Text style={{ color: 'white', fontSize: 18 }}>Transport
                    </Text>
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
                        style={{ width: "50%", height: '100%', backgroundColor: '#0A2133', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="bus" size={24} color="white" />
                        <Text style={{ color: '#fff' }}>Shuttle Service</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => toggleTab(2)}
                        style={{ width: "50%", height: '100%', backgroundColor: '#EBEBEB', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="car" size={24} color="#000" />
                        <Text style={{ color: '#000' }}>Car Rentals</Text>
                    </TouchableOpacity>
                </View>
            ) : (

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 0.5, height: 70, width: "100%" }}>
                    <TouchableOpacity onPress={() => toggleTab(1)}
                        style={{ width: "50%", height: '100%', backgroundColor: '#ebebeb', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="bus" size={24} color="#000" />
                        <Text style={{ color: '#000' }}>Shuttle Service</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => toggleTab(2)}
                        style={{ width: "50%", height: '100%', backgroundColor: '#0A2133', marginLeft: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesome name="car" size={24} color="white" />
                        <Text style={{ color: '#fff' }}>Car Rentals</Text>
                    </TouchableOpacity>
                </View>


            )

            }





            <ScrollView style={{ height: (windowHeight * 7 / 8) - 100 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

                {tab === 1 ? (
                    <>
                        {JSON.stringify(Shuttle) != "{}" ?
                            (
                                Shuttle.length > 0 ? (
                                    Shuttle.length > 0 && Shuttle.map(bus => {

                                        return (
                                            <>
                                                <View key={bus.id} style={{ justifyContent: "center", alignItems: "center", ...styles.shadow }}>
                                                    <ImageBackground source={{ uri: bus.thumbnail }} style={styles.container} imageStyle={{ borderTopLeftRadius: 25, borderTopRightRadius: 25, }} >
                                                        <View style={{ flexDirection: "row", justifyContent: "space-between", backgroundColor: 'rgba(48, 48, 45, 0.9)', marginTop: windowHeight / 4 - 10 }}>
                                                            <View >
                                                                <Text style={{ textAlign: "left", color: "white", fontSize: 18 }}> {bus.name.slice(0, 28)}...</Text>
                                                            </View>

                                                            <View style={{ flexDirection: "row" }}>

                                                                <TouchableOpacity onPress={() => { setisVisible(true); setIndex([{ url: bus.thumbnail }]) }} style={{ marginRight: 10 }}>
                                                                    <FontAwesome name="expand" size={28} color="white" />
                                                                </TouchableOpacity>
                                                                {bus.otherInfo&&(bus.otherInfo.pdfFile &&(
                                                                <>
                                                                <TouchableOpacity onPress={() => onShare(bus.otherInfo.pdfFile)} style={{ marginRight: 10 }}>
                                                                    <Entypo name="share" size={28} color="white" />
                                                                </TouchableOpacity>

                                                                <TouchableOpacity onPress={() => downloadfile(bus.otherInfo.pdfFile)} style={{ marginRight: 10 }}>
                                                                    {loading ? (
                                                                        <ActivityIndicator size='large' color='white' />
                                                                    ) : (
                                                                        <Entypo name="download" size={28} color="white" />
                                                                    )}
                                                                </TouchableOpacity>
                                                                </>))}
                                                                

                                                            </View>
                                                        </View>
                                                    </ImageBackground>
                                                </View>
                                            </>


                                        )
                                    }
                                    )
                                ) : (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No shutlle yet...</Text>
                                    </View>
                                )) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                    <ActivityIndicator size='large' color='#0771b8' />
                                </View>
                            )

                        }

                    </>

                ) : (
                    <>
                        {JSON.stringify(Rental) != "{}" ?
                            (
                                Rental.length > 0 ? (
                                    Rental.length > 0 && Rental.map(car => {

                                        return (
                                            <View style={{ flexDirection: 'row', borderBottomColor: 'grey', borderBottomWidth: 0.3 }}>
                                                <View style={{ width: '60%' }}>
                                                    <View style={{ marginTop: '5%', marginBottom: "3%", marginLeft: windowWidth / 60 }}>
                                                        <Text style={{ color: "#000", fontWeight: "bold", fontSize: 15, marginBottom: 5,width:windowWidth }}>
                                                            {car.name}
                                                        </Text>
                                                        {car.otherInfo.contactPhone !== null && car.otherInfo.contactPhone !== "" ? (
                                                            <Text style={{ color: "#4d4d4d", marginTop: 2 }}><Text style={{ fontWeight: "bold" }}>Contact</Text> : {car.otherInfo.contactPhone}</Text>

                                                        ) : (
                                                            <></>
                                                        )}

                                                        {car.otherInfo.contactEmail !== null && car.otherInfo.contactEmail !== "" ? (

                                                            <Text style={{ color: "#4d4d4d", marginTop: 2,width:windowWidth }}><Text style={{ fontWeight: "bold" }}>Email</Text> : {car.otherInfo.contactEmail}</Text>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </View>
                                                </View>
                                                {car.otherInfo.website !== null && car.otherInfo.website !== "" ? (
                                                    <TouchableOpacity style={{ width: '40%', justifyContent: 'center', alignItems: 'center' }}
                                                        onPress={() => { Linking.openURL(car.otherInfo.website) }}>
                                                        <View style={{ backgroundColor: "#12a58f", width: "80%", alignContent: "center", justifyContent: "center", flexDirection: "row", alignItems: "center", height: 50, borderRadius: 50 }} >
                                                            <Text style={{ color: "#fff", fontSize: 17, textAlign: "center" }}>Website</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                ) : (
                                                    <></>
                                                )}
                                            </View>
                                        )
                                    }
                                    )
                                ) : (
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <Text style={{ marginTop: 40, fontSize: 20, color: "#4d4d4d" }}>No Car rentals yet...</Text>
                                    </View>
                                )) : (
                                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
                                    <ActivityIndicator size='large' color='#0771b8' />
                                </View>
                            )

                        }
                    </>
                )
                }




            </ScrollView>
            <Modal
                isVisible={isVisible}
                transparent={true}
                animationType={'fade'}
                hasBackdrop={true}
                backdropColor={"#000"}
                backdropOpacity={0.80}
            >

                <TouchableOpacity style={styles.cross} onPress={() => setisVisible(false)}>
                    <AntDesign name='close' size={30} style={styles.icon} color="#fff" />
                </TouchableOpacity>



                <ImageViewer imageUrls={Index}
                    resizeMode="contain"
                />
            </Modal>



        </View>
    )
}

export default Transport;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        height: windowHeight / 3.5,
        width: windowWidth * 20 / 21,
        marginTop: 10,
    },
    shadow: {
        shadowColor: "#4D4D4D",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 4,
        elevation: 5,
    },
    cross: {
        alignItems: "flex-end",
        marginRight: 20,
        marginTop: 40

    },
})