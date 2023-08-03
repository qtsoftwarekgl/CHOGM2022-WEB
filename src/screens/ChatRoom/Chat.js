import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useSubscription,
  gql,
  useQuery,

} from "@apollo/client";
import {
  Text,
  StatusBar,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  LogBox,
  ActivityIndicator,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Button,
  RefreshControl
}
  from "react-native";
import { Picker } from '@react-native-picker/picker';
import Modal from 'react-native-modal';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { EvilIcons, Ionicons, FontAwesome, MaterialIcons, MaterialCommunityIcons, SimpleLineIcons, Entypo, FontAwesome5 } from '@expo/vector-icons';
import Icon from '@expo/vector-icons/Entypo';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;
const Chat = ({ navigation }) => {
  const [category, setCategory] = useState('')
  const [comment, setComment] = useState('')
  const [messages, setMessages] = useState({})
  const [userId, setUserId] = useState('')
  const [chatId, setchatId] = useState('')
  const [isVisible, setIsVisible] = useState(false)

  const [refreshing, setRefreshing] = useState(false);

  const wait = timeout => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    wait(2000).then(() => setRefreshing(false));
  }, []);

  const mutation = `
  mutation sendNewChat {
    sendNewChat(createChatInput:{
      message:${JSON.stringify(comment)},
      queryType:${category},
      sender:${JSON.stringify(userId)},
      receiver : ${null}
    }){
      id
    }
  }`



  const sendMessage = async (ci) => {
    setIsVisible(false)
    setComment('')
    console.log("this is chat id:", ci)
    const mutationreply = `
  mutation replyChatNOC{
    replyChat(ReplyChatInput:{
      chatId: ${JSON.stringify(ci)},
      message : ${JSON.stringify(comment)},
      sender:${JSON.stringify(userId)},
    }){
      id
    }
  }
  `
    const Token = await AsyncStorage.getItem('token')
    fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
      body: JSON.stringify({ query: mutation })
    }).then(response => response.json())
      .then(data => {
        console.log(data)
        if (data.errors[0].message === "Chat is not new") {
          fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
            method: "POST",
            headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
            body: JSON.stringify({ query: mutationreply })
          }).then(response => response.json())
            .then(data => {
              console.log(data)
              if (data.errors) {
                alert(data.errors[0].message)
              }
            })
        }
        // else {
        //   alert('Query sent successfully!')
        //   fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
        //     body: JSON.stringify({ query: query })
        //   }).then(response => response.json())
        //     .then(data => {
        //       console.log(data)
        //       setMessages(data.data.chats)
        //     })
        // }
      })
  }

  const addDigit = (num) => {
    if (JSON.stringify(num).length > 1) {
      return JSON.stringify(num)
    }
    else {
      return '0' + num
    }
  }



  useEffect(() => {
    const getId = async () => {
      const id = await AsyncStorage.getItem('id')
      console.log('haha')
      setUserId(id)

      const query_ = `
      query getchatbyuser{
        chats(userId:${JSON.stringify(id)}){
          id,
          chatType,
          messages{
            message
            createdDate
            sender
          }
        }
      }`
      const Token = await AsyncStorage.getItem('token')

      setInterval(() => {
        fetch("https://chogmapi.qtsoftwareltd.com:3000/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json", "authorization": "Bearer " + Token },
          body: JSON.stringify({ query: query_ })
        }).then(response => response.json())
          .then(data => {
            setMessages(data.data.chats)
            setchatId(data.data.chats[data.data.chats.length - 1].id)
          })
      }, 500)
    }
    getId()

  }, [])
  return (

    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor='#0A2133' barStyle="light-content" />
      <View style={{ width: windowWidth, backgroundColor: '#0A2133', height: windowHeight / 8, flexDirection: 'row' }}>

        <TouchableOpacity onPress={() => { navigation.goBack() }} style={{ width: '25%', alignItems: 'center', justifyContent: 'center', marginTop: '8%' }}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={{ width: '50%', alignItems: 'center', justifyContent: 'center', marginTop: '8%', flexDirection: 'row' }}>
          <View>
            <View style={{ width: 10, height: 10, marginLeft: 40, marginBottom: -15, borderRadius: 5, backgroundColor: '#00afb9', zIndex: 1 }}></View>
            <EvilIcons name="user" size={60} color="white" />
          </View>

          <Text style={{ color: 'white', fontSize: 18 }}>Chogm22</Text>
        </View>
        <View style={{ width: '25%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: '8%' }}>

        </View>

      </View>



      <ScrollView style={{ backgroundColor: "#f4f6fc", }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>

        {JSON.stringify(messages) != "{}" ? (
          messages.length > 0 ? (
            messages.map(message => {
              return (
                message.messages.length > 0 && message.messages.map(message_ => {
                  return (
                    <>
                      {message_.sender === userId && (<View style={styles.container} >
                        <Text style={{ color: "grey", marginRight: 15, marginBottom: 5, alignSelf: 'flex-end', fontSize: 12 }}>{new Date(message_.createdDate).getDate()}/{new Date(message_.createdDate).getMonth() + 1}, {addDigit(new Date(message_.createdDate).getHours())}:{addDigit(new Date(message_.createdDate).getMinutes())}</Text>
                        <View style={styles.gradient}>
                          <Text style={styles.text}>{message_.message}</Text>
                        </View>
                      </View>)}
                      {message_.sender !== userId && (<View style={styles.container2}>
                        <Text style={{ color: "grey", marginLeft: 15, marginBottom: 5, alignSelf: 'flex-start', fontSize: 12 }}>{new Date(message_.createdDate).getDate()}/{new Date(message_.createdDate).getMonth() + 1}, {addDigit(new Date(message_.createdDate).getHours())}:{addDigit(new Date(message_.createdDate).getMinutes())}</Text>
                        <View>
                          <View style={styles.gradient2} >
                            <Text style={styles.text2}>{message_.message}</Text>
                          </View>
                        </View>
                      </View>)}
                    </>
                  )
                })
              )
            })
          ) : (
            <View style={{ justifyContent: 'center', alignItems: 'center', paddingHorizontal: 15 }}>
              <Text>No message yet...</Text>
            </View>
          )
        ) : (
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>
            <ActivityIndicator size='large' color='black' />
          </View>
        )}







      </ScrollView>
      <View>
        <TouchableOpacity onPress={() => { setIsVisible(true) }} style={{ width: '90%', alignSelf: 'center', justifyContent: 'center', marginVertical: 20, borderWidth: 1, borderColor: '#fff', backgroundColor: "#0771b8", height: 50, flexDirection: "row", alignItems: "center", borderRadius: 20 }}>
          <Text style={{ color: 'white' }}>Send Query</Text>
        </TouchableOpacity>
      </View>

      <Modal
        isVisible={isVisible}
        transparent={true}
        animationType={'slide'}
        hasBackdrop={true}
        backdropColor={"#000"}
        backdropOpacity={0.80}
      >


        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <>
              <KeyboardAvoidingView behavior="position">
                <View style={{ width: '90%', backgroundColor: '#e8e8f5', borderRadius: 20 }}>
                  <View style={{ backgroundColor: "#f5f6fb", width: '100%', borderTopRightRadius: 20, borderTopLeftRadius: 20, marginLeft: 0, height: 60, justifyContent: "center", alignItems: "center" }}>
                    <Text style={{ color: "#000", fontSize: 20, fontWeight: "bold" }}>Send Us your Query!</Text>
                  </View>
                  <Text style={{ color: "#5c5c5c", fontSize: 18, fontWeight: "bold", textAlign: "center", marginTop: 10 }}>Pick Query Category</Text>
                  <View>
                    <Picker
                      mode='dropdown'
                      style={{
                        marginTop: 20,
                        width: '85%',
                        alignSelf: 'center'
                      }}
                      selectedValue={category}
                      onValueChange={(val) => { setCategory(val) }}
                    >
                      <Picker.Item label="Select query type" value="" />
                      <Picker.Item value="ACCOMODATION" label="ACCOMODATION" />
                      <Picker.Item value="ACCREDITATION" label="ACCREDITATION" />
                      <Picker.Item value="MEDIA" label="MEDIA" />
                      <Picker.Item value="OPENING_CEREMONY" label="OPENING CEREMONY" />
                      <Picker.Item value="SECURITY" label="SECURITY" />
                      <Picker.Item value="TELECOM" label="TELECOM" />
                      <Picker.Item value="TRANSPORT" label="TRANSPORT" />
                      <Picker.Item value="VENUES_HOTEL_ACCESS" label="VENUES HOTEL ACCESS" />
                    </Picker>
                  </View>

                  <View style={{ marginTop: 10, paddingHorizontal: 20, justifyContent: "center", alignItems: "center" }}>
                    <TextInput
                      numberOfLines={5}
                      value={comment}
                      multiline={true}
                      placeholder="Explain your query!"
                      placeholderTextColor="#7d7d7d"

                      style={{ borderRadius: 10, width: '90%', height: 100, margin: 20, padding: 20, color: "black", backgroundColor: "#f5f6fb" }} onChangeText={(val) => { setComment(val) }} />
                  </View>


                  <View style={{ flexDirection: "row", borderTopColor: 'grey', borderTopWidth: 0.6, marginTop: 20, backgroundColor: "#f5f6fb", borderBottomRightRadius: 20, borderBottomLeftRadius: 20, }}>
                    {/* Cancel */}
                    <View style={{ width: "50%" }}>
                      <TouchableOpacity onPress={() => { setIsVisible(!isVisible) }}>
                        <View style={{ height: 50, width: 100, width: '100%', alignItems: 'center', justifyContent: 'center', borderRightColor: 'grey', borderRightWidth: 0.5 }}>

                          <Text style={{ color: '#5c5c5c', fontSize: 20 }}>Cancel</Text>

                        </View>
                      </TouchableOpacity>


                    </View>
                    {/* submit */}
                    <View style={{ width: "50%" }}>
                      <TouchableOpacity onPress={() => { sendMessage(chatId) }}>
                        <View style={{ height: 50, width: 100, width: '100%', alignItems: 'center', justifyContent: 'center' }}>

                          <Text style={{ color: '#5c5c5c', fontSize: 20 }}>submit</Text>
                        </View>
                      </TouchableOpacity>


                    </View>


                  </View>
                </View>
              </KeyboardAvoidingView>
            </>
          </View>
        </TouchableWithoutFeedback>




      </Modal>
    </View>
  );
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    alignSelf: 'flex-end'
  },
  shadow: {
    shadowColor: "#707070",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  duration: {
    color: '#b6b6b6',
    fontSize: 11,
    marginTop: 5,
    marginHorizontal: 10,
    alignSelf: 'flex-end'
  },
  gradient: {
    maxWidth: '60%',
    backgroundColor: '#64d1ce',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  gradient2: {
    maxWidth: '60%',
    backgroundColor: '#dee2e6',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: 15,
    marginHorizontal: 10,
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  text: {
    color: '#fff',
  },
  text2: {
    color: '#000',
    textAlign: "left"
  },
  duration2: {
    color: '#b6b6b6',
    fontSize: 11,
    marginHorizontal: 10,
    marginTop: 5,
  },
  container2: {
    marginVertical: 10,
  },
  message2: {
    fontSize: 13,
  },
  Formcontainer: {
    flexDirection: 'row',
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#05375a',
    paddingBottom: 2,
    marginHorizontal: 20,
    width: 280,
  },
  icon: {
    marginTop: 20,
    marginBottom: 20,
    color: '#05375a',

  },

  inner: {
    flex: 1,
    justifyContent: "space-around"
  },

  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  }
})