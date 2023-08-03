import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  StatusBar,
  Dimensions
} from 'react-native';
import { AntDesign,FontAwesome,Entypo,FontAwesome5,Ionicons,Feather,MaterialCommunityIcons,MaterialIcons } from '@expo/vector-icons'
import { ScrollView } from 'react-native-gesture-handler';
import { AuthContext } from '../context/context';

const windowHeight = Dimensions.get('window').height;
const windowWidth = Dimensions.get('window').width;

const Drawer = ({ navigation }) => {
  const context = React.useContext(AuthContext)
  return (
    <ImageBackground source={require('../images/drawerback.jpg')} resizeMode="stretch" style={styles.container}>
<StatusBar
        backgroundColor="#0A2133"
        barStyle='light-content'
        translucent={false}
         />
      <TouchableOpacity style={styles.cross} onPress={() => navigation.goBack()}>
        <AntDesign name='close' size={30} style={styles.icon} />
      </TouchableOpacity>

      <ScrollView showsVerticalScrollIndicator={false}>

      <TouchableOpacity onPress={()=>{navigation.navigate('Home')}} style={styles.content}>
        <FontAwesome name='home' size={28} style={styles.icon} />
        <Text style={styles.texties}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('Programs')}} style={styles.content}>
        <Entypo name='briefcase' size={28} style={styles.icon} />
        <Text style={styles.texties}>Programs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('Accomodations')}} style={styles.content}>
        <FontAwesome name='hotel' size={28} style={styles.icon} />
        <Text style={styles.texties}>Hotel & Restaurants</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('KeyVenue')}} style={styles.content}>
        <Entypo name='location-pin' size={28} style={styles.icon} />
        <Text style={styles.texties}>Event Venues</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('AllSpeaker')}} style={styles.content}>
      <Image style={styles.imageicon} source={require('../images/speaker.png')} />
        <Text style={styles.texties}>Speakers</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.content} onPress={()=>{navigation.navigate('Transport')}}>
        <FontAwesome5 name='bus' size={28} style={styles.icon} />
        <Text style={styles.texties}>Shuttle Service</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('Visa')}} style={styles.content}>
      <Image style={styles.imageicon} source={require('../images/visa.png')} />
        <Text style={styles.texties}>Travel VISA</Text>
      </TouchableOpacity>
      <TouchableOpacity  onPress={()=>{navigation.navigate('Notifications')}} style={styles.content}>
        <Ionicons name='notifications' size={28} style={styles.icon} />
        <Text style={styles.texties}>Notifications</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('AllNews')}} style={styles.content}>
        <FontAwesome name='newspaper-o' size={28} style={styles.icon} />
        <Text style={styles.texties}>News</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=>{navigation.navigate('FAQs')}} style={styles.content}>
        <MaterialCommunityIcons name='frequently-asked-questions' size={28} style={styles.icon} />
        <Text style={styles.texties}>FAQs</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity onPress={()=>{navigation.navigate('Chat')}} style={styles.content}>
        <Ionicons name='chatbox-ellipses-outline' size={28} style={styles.icon} />
        <Text style={styles.texties}>Chat with us</Text>
      </TouchableOpacity> */}
      <TouchableOpacity onPress={() => context.signOut()} style={styles.content}>
        <MaterialIcons name='logout' size={28} style={styles.icon} />
        <Text style={styles.texties}>Logout</Text>
      </TouchableOpacity>
      </ScrollView>


    </ImageBackground>
  )
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },
  texties: {
    fontSize: 20,
    color: "#fff",
    marginTop:2,
    marginLeft:10
  },
  cross: {
    alignItems: "flex-end",
    marginRight:20,
    marginTop:40

  },
  icon: {
    color: "#fff",
    fontWeight: "bold",
  },
  content:{
    flexDirection:"row",
    width:"100%",
    marginTop:windowHeight/50,
    marginLeft:30,
    lineHeight:190
  },
  imageicon: {
    width:30,
    height:30
  }

})


export default Drawer;