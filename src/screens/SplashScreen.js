import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  Button,
  Dimensions,
} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
//libs
import AsyncStorage from '@react-native-async-storage/async-storage';
import {TouchableOpacity} from 'react-native-gesture-handler';
//const {width, height} = Dimensions.get('window');
export default function SplashScreen({navigation}) {
  var count = 1;
  //get token on load page
  useEffect(() => {
    setTimeout(() => {
      start();
    }, 2500);
  }, [count]); // Only re-run the effect if count changes

  const start = async () => {
    const user_info = await AsyncStorage.getItem('user_details'); //logged in
    const parsed_user_info = JSON.parse(user_info);
    console.log(parsed_user_info);
    if (parsed_user_info != null) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'main',
            params: {
              screenlist: 'home',
            },
          },
        ],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'main',
            params: {
              screenlist: 'login',
            },
          },
        ],
      });
    }
  };

  return (
    <View style={styles.container}>
      <View>
      <Image style={{alignSelf:'center', width: 200, height: 200 }} source={require('./image001.png')} />
      <Text style={{alignSelf: 'center',marginTop:10,fontSize:16}}>City Mayors Office </Text>
      <Text style={{alignSelf: 'center',fontSize:16}}> Document Tracking System</Text>
      </View>
      <View style={{flexDirection:'column',justifyContent:'flex-end'}}>
      <Text style={{alignSelf: 'flex-end',fontSize:10,marginHorizontal:50}}>powered by MITCS  <Image style={{alignSelf:'center', width: 20, height: 20 }} source={require('./mitcs.jpg')} /></Text>
      </View>
     
    </View>
  );
}
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical:100
  },
  text: {fontSize: width * 0.5, textAlign: 'center'},
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
