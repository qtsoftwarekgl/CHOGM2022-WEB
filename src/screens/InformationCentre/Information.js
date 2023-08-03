import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Dimensions, ActivityIndicator,Platform,RefreshControl } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import RenderHtml from 'react-native-render-html';
import Ring from '../ChatRoom/Ring';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;


const Information = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = React.useState(null);
  const [information, setInformation] = useState({});
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
          {category:USEFUL_INFO
          })
          {
              id,
              name,
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
      .then(data => setInformation(data.data.cmsByCategory))
  }, [])

  return (
    <View style={{ backgroundColor: "#fff" }}>
      <View style={{ width: '100%', backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

        <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
          <Text style={{ color: 'white', fontSize: 18 }}>Useful Information</Text>
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

      <ScrollView showsVerticalScrollIndicator={false} style={{ height: (windowHeight * 7 / 8) - 20, marginTop: 10, marginHorizontal: 20 }} contentContainerStyle={[styles.container, styles.shadow]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {JSON.stringify(information) === "{}" ? (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
            <ActivityIndicator size='large' color='#0771b8' />
          </View>
        ) : (
          <>

            {information.length > 0 ? (
              <>
                {information.map((info, index) => {
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

                          <Text style={[styles.heading, { color: "#4d4d4d", width: "80%" }]}>
                            {info.name}
                          </Text>
                          {
                            index === currentIndex ? (

                              <Ionicons name='chevron-up' size={24} style={{ width: "20%", color: "#b4b4b4", marginTop: 10 }} />
                            ) : (
                              <Ionicons name='chevron-down' size={24} style={{ width: "20%", color: "#b4b4b4", marginTop: 10 }} />

                            )
                          }
                        </View>

                        {index === currentIndex && (
                          <View style={styles.subCategoriesList}>
                            <RenderHtml
                              contentWidth={windowWidth}
                              source={{
                                html: `
                            ${info.description}`
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

      </ScrollView>
    </View>
  );
}

export default Information;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    justifyContent: 'center',

  },
  shadow: {
    shadowColor: "#707070",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.65,

    elevation: 8,
  },
  cardContainer: {
    flexGrow: 1,
    marginBottom: 10
  },
  card: {
    flexGrow: 1,
    borderWidth: 0.8,
    borderColor: "#4d4d4d",
    borderRadius: 8,
    marginBottom: 5

  },
  heading: {
    fontSize: 18,
    marginLeft: 20,
    letterSpacing: 1,
    marginLeft: 20,
    lineHeight: 35 * 1.5,

  },
  body: {
    fontSize: 20,
    marginHorizontal: 10,
  },
  subCategoriesList: {
    marginBottom: 10,
    marginHorizontal: 10,
    color: "#b4b4b4"

  },
});