// Example to Pick and Upload files in React Native
// https://aboutreact.com/file-uploading-in-react-native/
 
// Import React
import React, { useState,useEffect } from 'react';
// Import core components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,TextInput,
  FlatList,Alert,Pressable,Modal
} from 'react-native';
import { COLOR_PRIMARY } from '../styles/color_scheme';

export default function ViewScreenActionDetails  ({route,navigation})  {
  const {doc_id} = route.params;
  const [ActionData, setActionData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [ActionDesc,setActionDesc] = useState('');

  useEffect(() => {
    get_action_data()
  }, [1]); // Only re-run the effect if count changes
 
  const renderItem = ({item}) => <Item items={item} />;

  const Item = ({items}) => (
   
      <View style={{flexDirection:'column',justifyContent:'space-between',
      borderWidth: 1,
      borderColor: 'gray',
      
      marginTop:5,
      borderRadius: 10,alignItems:'center'}}>
          <Text style={{padding:10}}>{items.action_desc}</Text>
        <Text style={{paddingHorizontal:15,paddingBottom:5,fontSize:12,alignSelf:'flex-end'}}>created at: {items.action_date}</Text>
      </View>
  );

  const get_action_data = async () => {
    const formData = new FormData();
    formData.append('doc_id', doc_id);
    fetch(global.url + '/get_action_data.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
     
        console.log(responseJson.data);
        setActionData(responseJson.data);

      })
      .catch(error => {
      
        console.log(error);
        Alert.alert('Network Error. Something went wrong');
      });
  };

const Save_Action = async () => {
    console.log(ActionDesc)
    if(ActionDesc!=''){
      const formData = new FormData();
      formData.append('doc_id', doc_id);
      formData.append('action_desc', ActionDesc);
      fetch(global.url + '/add_action_history.php', {
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
            setModalVisible(false);
            get_action_data()
          }
        })
        .catch(error => {
          setModalVisible(false);
          console.log(error);
          Alert.alert('Network Error. Something went wrong');
        });
    
    }else{
      Alert.alert('Please fill up all fields');
    }
     
  };

  return (
    <View style={styles.container}>
  <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          Alert.alert("Modal has been closed.");
          setModalVisible(!modalVisible);
        }}
      >
        <View style={modal_styles.centeredView}>
          <View style={modal_styles.modalView}>
            <Text style={[{fontSize:20},modal_styles.modalText]}>Add New Action</Text>
            <View  style={{
              width: '100%',
              height: 40,
              borderColor: '#0074B7',
              borderWidth: 0.5,
              borderRadius: 10,
              alignSelf: 'center',
              paddingHorizontal:10,
              marginTop: 5,
              flexDirection:'row'
            }}>
         
            <TextInput
        //    onChangeText={onChangeusername}
            // value={'test'}
            onChangeText={text => {setActionDesc(text)}}
            style={{textAlign: 'center', fontSize: 15, }}
            placeholder="Enter Action Taken"
           
          />
            </View>
            <Pressable
              style={[{marginTop:20,paddingHorizontal:30,width:"90%"}
                ,modal_styles.button, modal_styles.buttonClose]}
              onPress={() => Save_Action()}
            >
              <Text style={modal_styles.textStyle}>Save</Text>
            </Pressable>
            <Pressable
              style={[{marginTop:10,paddingHorizontal:30,width:"90%",backgroundColor:COLOR_PRIMARY},{
                borderRadius: 20,
                padding: 10,
                elevation: 2
              }]}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={modal_styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View
        style={{flex: 0.1, backgroundColor: '#60A3D9', justifyContent: 'center'}}>
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>
          Document: {doc_id}
        </Text>
      </View>
      <View style={{ flex: 0.2, marginHorizontal: 40,justifyContent: 'center', alignContent: 'center'}}>
      <TouchableOpacity
        style={{ 
        borderColor:'#307ecc',
        borderWidth: 1,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignSelf: 'center',
        borderRadius: 30,
        width:"100%"
        }}
        activeOpacity={0.5}
        onPress={()=>{
               navigation.goBack()
        }}>
        <Text style={{ color: '#307ecc', paddingVertical: 10, fontSize: 16,  alignSelf: 'center',}}>BACK</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
      style={styles.buttonStyle}
      activeOpacity={0.5}
      onPress={()=>{ setModalVisible(true)}}>
      <Text style={styles.buttonTextStyle}>Add New</Text>
    </TouchableOpacity>

      </View>
    <View
      style={{
        marginHorizontal:25,
        alignContent: 'center',
        flex: 0.6
      }}>

        <Text style={{alignSelf: 'center', fontSize: 20, color: 'gray',marginTop:10}}>
            Action History
          </Text>
        <FlatList
              style={{width:"100%",marginTop:10}}
              data={ActionData}
              renderItem={renderItem}
              keyExtractor={item => item.id}
        />
    
    </View>
  </View>

  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },

  buttonStyle: {
    width:"100%",
    backgroundColor: '#307ecc',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#307ecc',
    height: 40,
    borderRadius: 30,
  
    marginTop: 15,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    alignSelf:'center',
    fontSize: 16,
  },
  textStyle: {
    fontSize: 16,
    alignSelf: 'center',
    width:'100%',
    textAlign:'center'
  },textStyle2: {
    fontSize: 18,
    alignSelf: 'center',
    width:'100%',
    textAlign:'center',
    fontWeight:'bold'
  },
});


const modal_styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
        width:"90%",
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    }
  });
  