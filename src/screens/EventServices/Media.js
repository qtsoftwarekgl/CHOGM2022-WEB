import React, { useState, useEffect } from 'react'
import { StyleSheet, Dimensions, Text, View, TouchableOpacity, ScrollView, Linking, Platform,RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { WebView } from "react-native-webview";
import { useWindowDimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

import Ring from '../ChatRoom/Ring';



const Media = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = React.useState(null);
  // const ref = React.useRef();
  const [Media, setMedia] = useState({});
  const { width } = useWindowDimensions()
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
          {category:MEDIA
          })
          {
              id,
              name,
              qaType,
              description,
          }
      }`
  useEffect(async () => {
    const Token = await AsyncStorage.getItem('token')
    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
      body: JSON.stringify({ query: query })
    }).then(response => response.json())
      .then(data => setMedia(data.data.cmsByCategory))
  }, [])

  let js = '<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
  let source = '<blockquote class="twitter-tweet"><a href="https://twitter.com/chogm2022/status/1507348499876229120?s=21&t=5XoAC0yZ3v1PWKegFD7_Jg"></a></blockquote>'
  return (
    <View >
      <View style={{ width: '100%', backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

        <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Media</Text>
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

      <ScrollView style={{ height: windowHeight * 7 / 8 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>



        <View style={[styles.container, styles.shadow]}>
          {JSON.stringify(Media) === "{}" ? (
            <></>
          ) : (
            <>

              {Media.length > 0 ? (
                <>
                  {Media.map((media, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          // ref.current.animateNextTransition();
                          setCurrentIndex(index === currentIndex ? null : index);
                        }}
                        style={styles.cardContainer}
                        activeOpacity={0.9}
                      >
                        <View style={[styles.card, { backgroundColor: '#f8f9fa' }]}>
                          <View style={{ width: "100%", flexDirection: "row" }}>

                            <Text style={[styles.heading, { color: '#4d4d4d', width: "80%" }]}>
                              {media.name}
                            </Text>
                            {
                              index === currentIndex ? (

                                <Ionicons name='chevron-up' size={24} style={{ width: "20%", color: "#4d4d4d", marginTop: 10 }} />
                              ) : (
                                <Ionicons name='chevron-down' size={24} style={{ width: "20%", color: "#4d4d4d", marginTop: 10 }} />

                              )
                            }
                          </View>

                          {index === currentIndex && (
                            <View style={styles.subCategoriesList}>
                              <RenderHtml
                                contentWidth={windowWidth}
                                source={{
                                  html: `
                            ${media.description}`
                                }}
                              />

                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })
                  }
                </>
              ) : (
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>

                </View>
              )}
            </>
          )}

        </View>
        <View style={styles.social}>
          <Text style={styles.texties}>
            Visit Our Social Media Pages
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "center", width: "100%", marginTop: 5 }}>
            <TouchableOpacity style={{ width: '9%' }} onPress={() => { Linking.openURL('https://www.facebook.com/chogm2022') }} >
              <FontAwesome name="facebook-square" size={24} color="#0771b8" style={{ width: "100%" }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '9%' }} onPress={() => { Linking.openURL('https://twitter.com/chogm2022?s=21&t=tsX-cYgyRfhGxg14SuMP9w') }} >
              <FontAwesome name="twitter-square" size={24} color="#0771b8" style={{ width: "100%" }} />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: '9%' }} onPress={() => { Linking.openURL('https://instagram.com/chogm2022?igshid=YmMyMTA2M2Y=') }} >
              <FontAwesome5 name="instagram-square" size={24} color="#0771b8" style={{ width: "100%" }} />
            </TouchableOpacity>
            <FontAwesome5 name="youtube-square" size={24} color="#0771b8" style={{ width: "9%" }} />
          </View>

        </View>
        <View style={{ marginHorizontal: windowWidth / 30, marginBottom: 30 }}>



          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', height: 50, width: "100%", marginBottom: -7.7, zIndex: 1, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
            <Text style={{ color: 'white' }}>Tweet By<Text style={{ color: '#00b4d8' }}>@CHOGM2022</Text></Text>
          </View>
          <View style={{ height: windowHeight / 1.8, backgroundColor: 'white' }}>
            <WebView nestedScrollEnabled={true} source={{ uri: "https://twitter.com/chogm2022/" }} />
          </View>
        </View>

      </ScrollView>


    </View>
  );
}

export default Media;

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 10,
    marginHorizontal: "5%"
  },
  shadow: {
    shadowColor: "#707070",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.65,
    elevation: 8,
  },
  cardContainer: {
    flexGrow: 1,

  },
  card: {
    flexGrow: 1,
    borderBottomWidth: 1,
    borderBottomColor: "#b4b4b4",
    marginBottom: 5

  },
  heading: {
    fontSize: 18,
    marginLeft: 20,
    letterSpacing: 1,
    marginLeft: 20,
    lineHeight: 25 * 1.5,

  },
  body: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  subCategoriesList: {
    marginTop: 10,
    marginHorizontal: 10

  },
  social: {

    alignItems: "center",
    marginTop: '1%',
    marginBottom: '1%'
  },
  texties: {
    color: "#0771b8"
  }

});