import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  ImageBackground,
  Text,
  Modal,
  Dimensions,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';

//libs
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {COLOR_PRIMARY, COLOR_SECONDARY} from '../styles/color_scheme';

//const {width, height} = Dimensions.get('window');
export default function ApplyScreen({navigation}) {

  const getCurrentDate=()=>{

    var date = new Date().getDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();

    //Alert.alert(date + '-' + month + '-' + year);
    // You can turn it in to your desired format
    return year + '-' + month + '-' + date;//format: dd-mm-yyyy;
}
  const [date_list, set_date_list] = useState([]);


  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = date => {
    setDatePickerVisibility(false);
    var time = date.getTime();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    var hh = date.getHours();
    var min = date.getMinutes();
    var ss = date.getSeconds();
    var mili = date.getMilliseconds();
    var final_date = (date = yyyy + '-' + mm + '-' + dd);
    set_doc_date(final_date);

    var add_date_ = {
      id: Math.random(),
      title: final_date,
    };
    date_list.push(add_date_);
    set_date_list(date_list);
  };

  const logout = () => {
    navigation.goBack();
  };
  const remove_async = async key => {
    try {
      await AsyncStorage.removeItem(key);
      return true;
    } catch (exception) {
      return false;
    }
  };
  const DATA = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      title: 'SOLICITATION',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd9d1aa97f63',
      title: 'COMPLAINS',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbdaf91aa97f63',
      title: 'REQUEST',
    },
    {
      id: '3ac68afc-c605-48d3sdf-a4f8-fbd9f1aa97f63',
      title: 'INTER-DEPARTMENT',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fsdfbd91aa9d7f63',
      title: 'SP CORRESPONDENCE',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91sdfaa97f63',
      title: "GOV'T DEPARTMENT",
    }, {
      id: '3ac68afc-c605-48d3-a4f8-fbd91sdfaa97f63',
      title: 'FINANCIAL',
    }
  ];
  const Item = ({title}) => (
    <TouchableOpacity onPress={() => select_leave(title)}>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );

  const select_leave = title => {
    setModalVisible(!modalVisible);
    set_doc_type(title);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const renderItem = ({item}) => <Item title={item.title} />;

  //SAVE DOCUMENT
  const [doc_desc, set_doc_desc] = useState('');
  const [doc_from, set_doc_from] = useState('');
  const [doc_type, set_doc_type] =useState('↓ Select here');
  const [doc_date, set_doc_date] = useState(getCurrentDate());

  const document_next_btn = async () => {
   
    if(doc_type=='↓ Select here'||doc_desc==''||doc_from==''){
      alert("please enter all required fields")
      console.log(doc_date)
    }else{
      const formData = new FormData();
      formData.append('doc_date', doc_date);
      formData.append('doc_type', doc_type);
      formData.append('doc_from', doc_from);
      formData.append('doc_desc', doc_desc);
      fetch(global.url + '/add_document.php', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      })
        .then(response => response.json())
        .then(responseJson => {
          if(responseJson.response[0].status=='1'){
            navigation.navigate('DateScreen',{doc_id:responseJson.response[0].id});
          }
        })
        .catch(error => {
          setModalVisible(false);
          console.log(error);
          Alert.alert('Network Error. Something went wrong');
        });
      
    }
    
  };


  return (
    <View style={styles.container}>
            <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Select Doc Type</Text>

            <FlatList
              data={DATA}
              renderItem={renderItem}
              keyExtractor={item => item.id}
            />
          </View>
        </View>
      </Modal>
      <View
        style={{flex: 0.1, backgroundColor: '#0074B7', justifyContent: 'center'}}>
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>
          NEW DOCUMENT
        </Text>
      </View>

      <View
        style={{
          marginHorizontal: 20,

          alignContent: 'center',
          flex: 0.9,
          marginTop:40,
        }}>
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
          
          <TouchableOpacity
            style={{
              width: '100%',
              height: 40,
              borderColor: '#0074B7',
              borderWidth: 0.5,
              borderRadius: 10,
              alignSelf: 'center',
              justifyContent: 'center',
          
            }}
            onPress={() => setModalVisible(true)}>
            <View style={{flexDirection:'row',paddingLeft:10}}>
            <Text style={{alignSelf: 'center', fontSize: 16, color: '#0074B7'}}>
            Doc Type : {' '}
            </Text>
            <Text style={{alignSelf: 'center', fontSize: 16, color: '#0074B7'}}>
            {doc_type}
            </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
          <TouchableOpacity
            style={{
              width: '100%',
              height: 40,
              borderColor: '#0074B7',
              borderWidth: 0.5,
              borderRadius: 10,
              alignSelf: 'center',
              justifyContent: 'center',
              marginTop: 15,
            }}
            onPress={showDatePicker} >
            <View style={{flexDirection:'row',paddingLeft:10}}>
            <Text style={{alignSelf: 'center', fontSize: 16, color: '#0074B7'}}>
            Recieved Date : {' '}
            </Text>
            <Text style={{alignSelf: 'center', fontSize: 16, color: '#0074B7'}}>
            {doc_date}
            </Text>
            </View>
          </TouchableOpacity>
        </View>
            <View  style={{
              width: '100%',
              height: 40,
              borderColor: '#0074B7',
              borderWidth: 0.5,
              borderRadius: 10,
              alignSelf: 'center',
              paddingHorizontal:10,
              marginTop: 15,
              flexDirection:'row'
            }}>
            <Text style={{alignSelf: 'center', fontSize: 15,marginBottom:4, color: '#0074B7', }}>
            From : 
            </Text>
            <TextInput
        //    onChangeText={onChangeusername}
            // value={'test'}
            onChangeText={text => {
              set_doc_from(text);
            }}
            style={{textAlign: 'center', fontSize: 15, }}
            placeholder="from"
           
          />
            </View>

            <View  style={{
              width: '100%',
             
              borderColor: '#0074B7',
              borderWidth: 0.5,
              borderRadius: 10,
              alignSelf: 'center',
              paddingHorizontal:10,
              marginTop: 15,
              flexDirection:'row'
            }}>
            <Text style={{alignSelf: 'center', fontSize: 15,marginBottom:4,color: '#0074B7', }}>
            DESC : {' '}
            </Text>
            <TextInput
            onChangeText={text => {
              set_doc_desc(text);
            }}
            multiline={true}
   
            style={{fontSize: 15,marginRight:45}}
            placeholder="description"
           
          />
            </View>

           
        <View style={{marginTop:30,justifyContent: 'space-between', alignContent: 'center',flexDirection:'row'}}>
        <TouchableOpacity
        style={{ 
        borderColor:'#307ecc',
        borderWidth: 1,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignSelf: 'center',
        borderRadius: 30,
        width:"40%",justifyContent:'center'
        }}
        activeOpacity={0.5}
        onPress={()=>{
               navigation.goBack()
        }}>
        <Text style={{ color: '#307ecc', fontSize: 16,  alignSelf: 'center',textAlign:'center'}}>{'<'} Back </Text>
      </TouchableOpacity>
        <TouchableOpacity
        style={{ 
        borderColor:'#307ecc',
        borderWidth: 1,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignSelf: 'center',
        borderRadius: 30,
        width:"40%",justifyContent:'center'
        }}
        activeOpacity={0.5}
        onPress={()=>{
          document_next_btn()
        }}>
        <Text style={{ color: '#307ecc',fontSize: 16,  alignSelf: 'center',}}> Next {'>'}</Text>
      </TouchableOpacity>

     
        </View>
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
    marginVertical: 60,
    padding: 20,
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
    fontSize: 20,
  },
  container: {
    flex: 1,
  },
  item: {
 
    borderColor: '#60A3D9',
    borderWidth: 1,
    borderRadius: 100,
    marginVertical: 10,

    width:'100%',
    paddingBottom:5,
    paddingTop:5,
    justifyContent:'center'
  },
  title: {
    fontSize: 20,
    alignSelf: 'center',
    marginHorizontal: 15,
    color: '#60A3D9',
  },
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 1,
    fontSize: 16,
    color: 'gray',
    borderBottomColor: '#c9c7c7',
    marginTop: 30,
  },
});
