import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Modal,
  Text,
  FlatList,
  Dimensions,
  Alert,
  TextInput,
  Pressable,
  ActivityIndicator,
  TouchableOpacity
} from 'react-native';

import { COLOR_PRIMARY, COLOR_SECONDARY } from '../styles/color_scheme';

export default function ViewScreen({navigation}) {
  const [DocumentsData, setDocumentsData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible_loading, setmodalVisible_loading] = useState(false);
  const [SelectedItem, setSelectedItem] = useState(false);
  const renderItem = ({item}) => <Item items={item} />;
  const Item = ({items}) => (
      <TouchableOpacity 
      // onPress={()=>{  navigation.navigate('ViewScreenDetails',{doc_id:items.doc_id});}}
      onPress={()=>{setModalVisible(true);setSelectedItem(items)}}
      style={{flexDirection:'row',justifyContent:'space-between',
      borderWidth: 1,
      borderColor: 'gray', 
      marginTop:15,
      borderRadius: 10,flexDirection:'column',}}>
        <Text style={{alignSelf:'center',height:30,borderTopLeftRadius:9,borderTopRightRadius:9,width:"100%",color:'#ffffff',textAlign:'center',alignSelf:'center',fontSize:18,backgroundColor:COLOR_SECONDARY}} >Document No. {items.doc_id}</Text>
       <View style={{marginTop:10,flexDirection:'row',justifyContent:'center',marginHorizontal:20}}>
       <Text style={{fontSize:16,fontWeight:'bold'}} > {items.doc_type}</Text>
        </View> 
        <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20}}>
        <Text style={{fontSize:15}} >Desc : </Text>
        <Text style={{fontSize:15}} >{items.doc_desc}</Text>
        </View> 
        <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20}}>
        <Text style={{fontSize:15}} >From : </Text>
        <Text style={{fontSize:15}} >{items.from_}</Text>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginHorizontal:20}}>
        <Text style={{fontSize:15}} >Date Recieved : </Text>
        <Text style={{fontSize:15}} >{items.doc_date}</Text>
        </View> 

        <View style={{marginTop:10,marginBottom:10,flexDirection:'row',justifyContent:'flex-end',marginHorizontal:20}}>
      
        <Text style={{fontSize:11 }} >created at: {items.doc_created_date}</Text>
        </View> 
      </TouchableOpacity>
  );

  const get_documents_data = async () => {
    setmodalVisible_loading(true);
    const formData = new FormData();
    formData.append('doc_id', 90);
    fetch(global.url + '/documents_data.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        setmodalVisible_loading(false);
        console.log(responseJson.data[0]);
        setDocumentsData(responseJson.data);
      })
      .catch(error => {
      
        console.log(error);
        Alert.alert('Network Error. Something went wrong');
      });
  };

 useEffect(() => {
    get_documents_data()
  }, [1]); // Only re-run the effect if count changes

  return (
    <View style={styles.container}>
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
        }}
      >
        <View style={modal_styles.centeredView}>
          <View style={modal_styles.modalView}>
            <Text style={{fontSize:18,fontWeight:'bold'}}>Doc No. {SelectedItem.doc_id}</Text>
            <Pressable
              style={[{marginTop:10,paddingHorizontal:30,width:'100%'}
                ,modal_styles.button, modal_styles.buttonClose]}
              onPress={() => {setModalVisible(false);navigation.navigate('ViewScreenActionDetails',{doc_id:SelectedItem.doc_id})}}
            >
              <Text style={modal_styles.textStyle}>Action Taken</Text>
            </Pressable>
            <Pressable
              style={[{marginTop:10,paddingHorizontal:30,width:'100%'}
                ,modal_styles.button, modal_styles.buttonClose]}
              onPress={() => { setModalVisible(false);navigation.navigate('ViewScreenDetails',{doc_id:SelectedItem.doc_id})}}
            >
              <Text style={modal_styles.textStyle}>Documents</Text>
            </Pressable>
            <Pressable
              style={[{marginTop:10,paddingHorizontal:30,width:'100%'}
                ,modal_styles.button, modal_styles.buttonClose,{backgroundColor:COLOR_PRIMARY}]}
              onPress={() => { setModalVisible(false)}}
            >
              <Text style={modal_styles.textStyle}>Cancel</Text>
            </Pressable>
          </View>
        </View>
    </Modal>

    <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible_loading}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setmodalVisible_loading(!modalVisible_loading);}}>
          <View style={modal_styles.centeredView}>
            <View style={modal_styles.modalView2}>
              <ActivityIndicator size="small" color={'gray'} />
            </View>
          </View>
    </Modal>

      <View
        style={{flex: 0.1, backgroundColor: '#003B73', justifyContent: 'center'}}>
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>
          DOCUMENTS
        </Text>
      </View>
      <View
        style={{

          marginVertical: 20,
          alignContent: 'center',
          flex: 0.9,
        }}>
        <View style={{justifyContent: 'center', alignContent: 'center'}}>
        <TouchableOpacity
        style={{ 
        borderColor:'#307ecc',
        borderWidth: 1,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        alignSelf: 'center',
        borderRadius: 30,
        width:"90%",
        }}
        activeOpacity={0.5}
        onPress={()=>{
               navigation.goBack()
        }}>
        <Text style={{ color: '#307ecc', paddingVertical: 10, fontSize: 16,  alignSelf: 'center',}}>BACK</Text>
      </TouchableOpacity>

          <FlatList
           showsVerticalScrollIndicator={false}
           showsHorizontalScrollIndicator={false}
              style={{alignSelf:'center',width:"90%",marginTop:10}}
              data={DocumentsData}
              renderItem={renderItem}
              keyExtractor={item => item.doc_id}
        />
        
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
});

const modal_styles = StyleSheet.create({
  
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },modalView2: {
    width:"20%",
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
