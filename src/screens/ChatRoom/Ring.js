import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, Image, TouchableOpacity, StatusBar, ScrollView, Dimensions, TextInput } from 'react-native';
import { Feather, FontAwesome, FontAwesome5, Ionicons, Entypo } from '@expo/vector-icons';
const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const Ring = () => {
  const [Seen, setSeen] = useState([])
  const [userId, setUserId] = useState('')
  useFocusEffect(
  React.useCallback(async () => {

    const id = await AsyncStorage.getItem('id') 
    console.log(id)
    const Token = await AsyncStorage.getItem('token')
    const query = `
{
    notificationsByUser(userId:${JSON.stringify(id)}){
      id,
      content,
      type,
      createdDate,
      seen
    }
  }`
    setUserId(id)
    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
      body: JSON.stringify({ query: query })
    }).then(response => response.json())
      .then(data => {
        setSeen(data.data.notificationsByUser)
      })
  }, [])

  );

  return (
    <View>
      {Seen && Seen.filter(element => element.seen === false).length > 0 ? (
        <View>
          <View style={{ height: 14, marginLeft: 14, marginBottom: -12, borderRadius: 5, backgroundColor: '#d00000', zIndex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 8, fontWeight: "900", color: "#fff",marginHorizontal:3 }}>{Seen && Seen.filter(element => element.seen === false).length}</Text>
          </View>
          <FontAwesome name="bell" size={24} color="white" />
        </View>
      ) : (
        <FontAwesome name="bell" size={24} color="white" />
      )}
    </View>
  )
}

export default Ring