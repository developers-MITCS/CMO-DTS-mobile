import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  GRAY1,
  GRAY2,
} from '../styles/color_scheme';


export default function LoginScreen({navigation}) {
  //states
  const [modalVisible, setModalVisible] = useState(false);
  const [username, onChangeusername] = React.useState('');
  const [password, onChangpassword] = React.useState('');

  const setItemStorage = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Error saving data
    }
  };

  const login = async () => {

    setModalVisible(true);
    const formData = new FormData();
    // formData.append('username', '1000180');
    // formData.append('password', '123');

    formData.append('username', username);
    formData.append('password', password);

    fetch(global.url + '/login.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        setModalVisible(false);
        console.log(responseJson.response[0].status);
        if (responseJson.response[0].status == 1) {
          setItemStorage('user_details', {
            user_id: responseJson.response[0].user_id,
            user_name:
              responseJson.response[0].name
          });
          navigation.reset({
            index: 0,
            routes: [
              {
                name: 'Main',
                params: {
                  screenlist: 'home',
                },
              },
            ],
          });
        } else {
          Alert.alert('user not found');
          console.log('error connection');
        }
      })
      .catch(error => {
        setModalVisible(false);
        console.log(error);
        Alert.alert('Network Error. Something went wrong');
      });
  };

  return (
      <View style={custom_styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
          <View style={modal_styles.centeredView}>
            <View style={modal_styles.modalView}>
              <ActivityIndicator size="small" color={'gray'} />
            </View>
          </View>
        </Modal>

        <View style={{flex: 1, justifyContent: 'center'}}>
          
          <View
            style={{
              marginHorizontal: 40,
              backgroundColor: 'rgba(192, 192, 192, 0.5)',
              padding: 20,
              alignContent: 'center',
            
            }}>
              <Image style={{alignSelf:'center', width: 100, height: 100 }} source={require('./image001.png')} />
            <TextInput
              style={custom_styles.input}
              onChangeText={text => {
                onChangeusername(text);
              }}
              value={username}
              placeholder="Username"
              placeholderTextColor="black"
            />
            <TextInput
              style={custom_styles.input}
              onChangeText={text => {
                onChangpassword(text);
              }}
              value={password}
              placeholder="Password"
              secureTextEntry={true}
              placeholderTextColor="black"
            />

            <TouchableOpacity
              style={
                password != '' && username != ''
                  ? custom_styles.login_active
                  : custom_styles.login_passive
              }
              onPress={() => {
                login();
                // navigation.navigate('HomeScreen');
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                LOGIN
              </Text>
            </TouchableOpacity>
          </View>
          {/* <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              padding: 10,
            }}>
            <TouchableOpacity>
              <Text
                style={{
                  fontSize: RFValue(16),
                  color: 'red',
                  alignSelf: 'center',
                }}>
                Forgot password ?{'   '}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ChangePasswordScreen');
              }}>
              <Text
                style={{
                  fontSize: RFValue(16),
                  color: 'red',
                  alignSelf: 'center',
                }}>
                Reset password ?
              </Text>
            </TouchableOpacity>
          </View> */}
          <Text style={{alignSelf: 'flex-end',fontSize:10,marginHorizontal:50,marginTop:20}}>powered by MITCS  <Image style={{alignSelf:'center', width: 20, height: 20 }} source={require('./mitcs.jpg')} /></Text>

        </View>
      </View>
  );
}

const custom_styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  input: {
    margin: 12,
    borderBottomWidth: 1,
    fontSize: 18,
    color: 'black',
    borderBottomColor: '#003B73',
    marginTop: 30,
  },
  login_passive: {
    height: 60,
    backgroundColor: 'gray',
    marginTop: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  login_active: {
    height: 60,
    backgroundColor: '#003B73',
    marginTop: 30,
    marginHorizontal: 10,
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    alignSelf: 'stretch',
    width: '100%', // applied to Image
    height: '100%',
  },
});

const modal_styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});