import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  Button,
  Dimensions,
  TouchableOpacity
} from 'react-native';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
//libs
import AsyncStorage from '@react-native-async-storage/async-storage';

import {COLOR_PRIMARY, COLOR_SECONDARY} from '../styles/color_scheme';
//const {width, height} = Dimensions.get('window');
export default function SplashScreen({navigation}) {
  const logout = () => {
    remove_async('user_details');
    navigation.navigate('LoginScreen');
  };
  const remove_async = async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{flex: 0.1, backgroundColor: '#60A3D9', justifyContent: 'center'}}>
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>
        <Image style={{alignSelf:'center', width: 25, height: 25 }} source={require('./image001.png')} />  Document Tracking System 
        </Text>
      </View>
      <View
        style={{
          marginHorizontal: 60,
          marginVertical: 50,
          alignContent: 'center',
          flex: 0.9,
        }}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: 100,
            backgroundColor: COLOR_PRIMARY,
            borderRadius: 10,
            justifyContent: 'center',
          }}
          onPress={() => {
            navigation.navigate('ViewScreen');
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              alignSelf: 'center',
              fontSize: 20,
              color: 'white',
            }}>
             CMO Documents
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            width: '100%',
            height: 100,
            backgroundColor: COLOR_SECONDARY,
            borderRadius: 10,
            justifyContent: 'center',
            marginTop: 20,
          }}
          onPress={() => {
            navigation.navigate('ApplyScreen');
          }}>
          <Text
            style={{
              fontWeight: 'bold',
              alignSelf: 'center',
              fontSize: 20,
              color: 'white', 
            }}>
            New Document
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '100%',
            height: 100,
            borderColor: 'gray',
            borderWidth: 2,
            borderRadius: 10,
            justifyContent: 'center',
            marginTop: 20,
          }}
          onPress={() => {
            logout();
          }}>
          <Text style={{alignSelf: 'center', fontSize: 20, color: 'gray'}}>
            LOG OUT
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  text: {fontSize: width * 0.5, textAlign: 'center'},
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
});
