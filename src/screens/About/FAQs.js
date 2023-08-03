import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, Dimensions, View, TouchableOpacity, ScrollView, ActivityIndicator,Platform,RefreshControl } from 'react-native';
import { AntDesign, FontAwesome, FontAwesome5, Entypo, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';
import RenderHtml from 'react-native-render-html';
import Ring from '../ChatRoom/Ring';
import { WebView } from "react-native-webview";




const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';



const FAQs = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = React.useState(null);
  const [questions, setQuestions] = useState({});
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
          {category:QA
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
      .then(data => setQuestions(data.data.cmsByCategory))
  }, [])

  return (

    <View style={{ backgroundColor: "#fff" }}>
      <View style={{ width: '100%', backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

        <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '20%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>
        <View style={{ width: '55%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
          <Text style={{ color: 'white', fontSize: 15 }}>Frequently Asked Questions</Text>
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

      <ScrollView style={{ height: windowHeight * 7 / 8 }} contentContainerStyle={[styles.container, styles.shadow]} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        {JSON.stringify(questions) === "{}" ? (
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size='large' color='black' />
          </View>
        ) : (
          <>

            {questions.length > 0 ? (
              <>
                {questions.map((question, index) => {
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
                        <View style={{ width: "100%", flexDirection: "row", justifyContent: 'center', alignItems: 'center', height: 60, paddingHorizontal: 5 }}>

                          {
                            index === currentIndex ? (

                              <AntDesign name='minus' size={24} style={{ width: "10%", color: "#b4b4b4", marginLeft: 10 }} />
                            ) : (
                              <AntDesign name='plus' size={24} style={{ width: "10%", color: "#b4b4b4", marginLeft: 10 }} />

                            )
                          }
                          <Text style={[styles.heading, { color: "#4d4d4d", width: "90%", marginLeft: -5, padding: 6 }]}>
                            {question.name}
                          </Text>
                        </View>

                        {index === currentIndex && (
                          <View style={styles.subCategoriesList}>
                            <RenderHtml
                              contentWidth={windowWidth}
                              source={{
                                html: `
                            ${question.description}`
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

export default FAQs;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 150

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

  },
  card: {
    flexGrow: 1,
    borderWidth: 0.8,
    borderColor: "#4d4d4d",
    borderRadius: 8,
    marginBottom: 5,


  },
  heading: {
    fontSize: 15,
    marginLeft: 20,
    letterSpacing: 1,
    marginLeft: 20,

  },
  body: {
    fontSize: 20,
    marginHorizontal: 10,
    marginBottom: 200
  },
  subCategoriesList: {
    marginBottom: 10,
    marginHorizontal: 10,
    color: "#b4b4b4"

  },
});