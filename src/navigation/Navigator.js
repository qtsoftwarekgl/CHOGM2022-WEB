import React, { useState, useEffect, useMemo, useReducer } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createClient } from 'graphql-ws';
import {
  ActivityIndicator,
  View,
  Platform
} from 'react-native';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql
} from "@apollo/client";
import Home from '../screens/Home';
import Forums from '../screens/Forums/Forums';
import Drawer from '../screens/Drawer';
import Login from '../screens/User/Login';
import QRscanner from '../screens/User/QRscanner';
import Aboutforum from '../screens/Forums/Aboutforum';
import Programs from '../screens/Forums/Programmes/Programs';
import Broadcast from '../screens/Forums/Broadcast';
import VisitRwanda from '../screens/VisitRwanda/VisitRwanda';
import Accomodations from '../screens/VisitRwanda/Accomodations';
import Locations from '../screens/VisitRwanda/Locations';
import Visa from '../screens/VisitRwanda/Visa';
import Dining from '../screens/VisitRwanda/Dining';
import Shops from '../screens/VisitRwanda/Shops';
import Badge from '../screens/AccessBadge/Badge';
import About from '../screens/About/About';
import Services from '../screens/EventServices/Services';
import KeyVenue from '../screens/EventServices/KeyVenue';
import VenueDetails from '../screens/EventServices/VenueDetails';
import Media from '../screens/EventServices/Media';
import Information from '../screens/InformationCentre/Information';
import Rooms from '../screens/EventServices/Booking/Rooms';
import AllNews from '../screens/News/AllNews';
import NewsDetails from '../screens/News/NewsDetails';
import Notifications from '../screens/ChatRoom/Notifications';
import Chat from '../screens/ChatRoom/Chat';
import NOC from '../screens/EventServices/NOC';
import Profile from '../screens/User/Profile';
import FAQs from '../screens/About/FAQs';
import ProgramDetails from '../screens/Forums/Programmes/ProgramDetails';
import ProgramSpeaker from '../screens/Forums/Programmes/ProgramSpeaker';
import Bio from '../screens/Speakers/Bio';
import Sessions from '../screens/Speakers/Sessions';
import { AuthContext } from '../context/context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import OTP from '../screens/User/OTP';
import axios from 'axios';
import VerifyQR from '../screens/User/VerifyQR';
import Map from '../screens/VisitRwanda/Map';
import Transport from '../screens/EventServices/Transport';
import About_ from '../screens/User/About';
import News from '../screens/User/News';
import Qrscanning from '../screens/VisitRwanda/Qrscanning';
import AllSpeaker from '../screens/Speakers/Allspeakers';
import Ring from '../screens/ChatRoom/Ring';
import PrivacyPolicy from '../screens/User/PrivacyPolicy';
import TollFree  from '../screens/AccessBadge/TollFree';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';


const Stack = createStackNavigator();
const screenOptionStyle = {
  headerShown: false
}

const HomeStackNavigator = (props) => {

  const initialState = {
    isLoading: true,
    token: null,
    id: null
  }


  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          token: action.token,
          isLoading: false,
          id: action.id
        };
      case 'LOGIN':
        return {
          ...prevState,
          token: action.token,
          isLoading: false,
          id: action.id
        };
      case 'LOGOUT':
        return {
          ...prevState,
          token: null,
          isLoading: false,
          id: null
        };
    }
  }

  const [loginState, dispatch] = useReducer(loginReducer, initialState)

  useEffect(async () => {
    let token;
    let id;
    try {
      //  await   AsyncStorage.multiRemove(["userToken", "userName", "email", "redirect_page","properties","tenant_info"]);
      const data = await AsyncStorage.multiGet(["token", "id"]);
      const new_data = data.map(entry => entry[1]);
      token = new_data[0]
      id = new_data[1]

      dispatch({
        type: 'RETRIEVE_TOKEN',
        token: token,
        id: id,
      }) 
    } catch (error) {
      console.log(error)
    }
  },[])
  const authContext = useMemo(() => ({
    signIn: async (email, otp) => {
      console.log(email)
      const loginMutation_ = `
      mutation login{otpLogin(
      email:${JSON.stringify(email)},
      otp:${JSON.stringify(otp)}
      )
      {token,user{id}}}
      `



      try {
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: loginMutation_ })
        }).then(response => response.json())
          .then(data => {
            if (data.errors) {
              console.log(data.errors)
              alert(data.errors[0].message)
            }
            else {
              const items = [['token', data.data.otpLogin.token], ['id', data.data.otpLogin.user.id]
              ]
              AsyncStorage.multiSet(items, () => {
                console.log('asyncstorage set successfully')
              });
              dispatch({
                type: 'LOGIN',
                token: data.data.otpLogin.token,
                id: data.data.otpLogin.user.id
              })
            }

          })

      } catch (error) {
        console.log(error)
        alert(error[0].message)
      }


    },
    QRsignIn: async (email, qrdata) => {
      const loginMutation = `
      mutation qrlogin{chogmLogin(ChogmLoginInput:{
        email:${JSON.stringify(email)},
        qrdata:${JSON.stringify(qrdata)}
      }){
        token,
        user{id}
      }}
      `



      try {
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: loginMutation })
        }).then(response => response.json())
          .then(data => {
            if (data.errors) {
              alert(data.errors[0].message)
            }
            else {
              const items = [['token', data.data.chogmLogin.token], ['id', data.data.chogmLogin.user.id]
              ]
              AsyncStorage.multiSet(items, () => {
                console.log('asyncstorage set successfully')
              });
              dispatch({
                type: 'LOGIN',
                token: data.data.chogmLogin.token,
                id: data.data.chogmLogin.user.id
              })
            }

          })

      } catch (error) {
        alert(data.errors[0].message)
      }


    },
    signOut: async () => {

      try {
        await AsyncStorage.multiRemove(["token"]);
      } catch (error) {
        console.log(error)
      }
      dispatch({ type: 'LOGOUT' })
    }
  }))


  if (loginState.isLoading) { 
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' color='#000' />
      </View>
    )
  }
  else {
    if (loginState.token === null) {
      return (
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={screenOptionStyle} >
              <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
              <Stack.Screen name="Login" component={Login} />
              <Stack.Screen name="OTP" component={OTP} />
              <Stack.Screen name="QRscanner" component={QRscanner} />
              <Stack.Screen name="About_" component={About_} />
              <Stack.Screen name="News" component={News} />
              <Stack.Screen name="VerifyQR" component={VerifyQR} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      )

    }


    return (
      // <ApolloProvider client={client}>
        <AuthContext.Provider value={authContext}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={screenOptionStyle} >

              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="Map" component={Map} />
              <Stack.Screen name="Chat" component={Chat} />
              <Stack.Screen name="Drawer" component={Drawer} />
              <Stack.Screen name="Aboutforum" component={Aboutforum} />
              <Stack.Screen name="Programs" component={Programs} />
              <Stack.Screen name="Broadcast" component={Broadcast} />
              <Stack.Screen name="VisitRwanda" component={VisitRwanda} />
              <Stack.Screen name="Accomodations" component={Accomodations} />
              <Stack.Screen name="Locations" component={Locations} />
              <Stack.Screen name="Visa" component={Visa} />
              <Stack.Screen name="Dining" component={Dining} />
              <Stack.Screen name="Qrscanning" component={Qrscanning} />
              <Stack.Screen name="Shops" component={Shops} />
              <Stack.Screen name="Forums" component={Forums} />
              <Stack.Screen name="Badge" component={Badge} />
              <Stack.Screen name="TollFree" component={TollFree} />
              <Stack.Screen name="About" component={About} />
              <Stack.Screen name="Services" component={Services} />
              <Stack.Screen name="KeyVenue" component={KeyVenue} />
              <Stack.Screen name="Transport" component={Transport} />
              <Stack.Screen name="VenueDetails" component={VenueDetails} />
              <Stack.Screen name="Media" component={Media} />
              <Stack.Screen name="Information" component={Information} />
              <Stack.Screen name="Rooms" component={Rooms} />
              <Stack.Screen name="AllNews" component={AllNews} />
              <Stack.Screen name="NewsDetails" component={NewsDetails} />
              <Stack.Screen name="Notifications" component={Notifications} />
              <Stack.Screen name="NOC" component={NOC} />
              <Stack.Screen name="Profile" component={Profile} />
              <Stack.Screen name="FAQs" component={FAQs} />
              <Stack.Screen name="ProgramDetails" component={ProgramDetails} />
              <Stack.Screen name="ProgramSpeaker" component={ProgramSpeaker} />
              <Stack.Screen name="AllSpeaker" component={AllSpeaker} />
              <Stack.Screen name="Bio" component={Bio} />
              <Stack.Screen name="Sessions" component={Sessions} />
              <Stack.Screen name="Ring" component={Ring} />
            </Stack.Navigator>
          </NavigationContainer>
        </AuthContext.Provider>
      // </ApolloProvider>
    );
  }
}

export default HomeStackNavigator;