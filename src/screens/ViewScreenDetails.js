// Example to Pick and Upload files in React Native
// https://aboutreact.com/file-uploading-in-react-native/
 
// Import React
import React, { useState,useEffect } from 'react';
// Import core components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,Alert,Modal,ActivityIndicator
} from 'react-native';
import ImageView from "react-native-image-viewing";
// Import Document Picker
import DocumentPicker from 'react-native-document-picker';
const DATA = [
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    file_name: 'File 1',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
    file_name: 'File 2',
  },
];

export default function ViewScreenDetails  ({route,navigation})  {
  const [modalVisible, setModalVisible] = useState(false);
  const [singleFile, setSingleFile] = useState(null);
  const [UploadedFile, setUploadedFile] = useState(null);
  const {doc_id} = route.params;

  const renderItem = ({item}) => <Item file_name={item.file_name} file_url={item.file_url}  file_id={item.file_id} />;
  const Item = ({file_name,file_id,file_url}) => (
   
      <View style={{flexDirection:'row',justifyContent:'space-between',
      borderWidth: 1,
      borderColor: 'gray',
      height: 40,
      marginTop:1,
      borderRadius: 10,alignItems:'center'}}>
        <Text style={{padding:10}}>{file_name}</Text>
        <TouchableOpacity onPress={()=>{delete_file(file_id,file_url)}} style={{paddingHorizontal:30,padding:10}}><Text style={{fontSize:15,fontWeight:'bold'}}>X</Text></TouchableOpacity>
      </View>
   
  );


  const uploadImage = async () => {
    // Check if any file is selected or not
    if (singleFile != null) {
      setModalVisible(true)
      // If file selected then create FormData
      const fileToUpload = singleFile[0];
      const data = new FormData();
      data.append('name', 'Image Upload');
      data.append('file_attachment', fileToUpload);
      data.append('doc_id', doc_id);
      // Please change file upload URL
      let res = await fetch(
        global.url + '/upload.php',
        {
          method: 'post',
          body: data,
          headers: {
            'Content-Type': 'multipart/form-data; ',
          },
        }
      );
      let responseJson = await res.json();
      if (responseJson.status == 1) {
        alert('Upload Successful');
        setSingleFile(null)
        get_uploaded_files_data()
      }else{
       alert(responseJson.msg)
       setSingleFile(null)
      }
      setModalVisible(false)
    } else {
      // If no file selected the show alert
      alert('Please Select File first');
    }
  };
 
  const selectFile = async () => {
    // Opening Document Picker to select one file
    try {
      const res = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
        // There can me more options as well
        // DocumentPicker.types.allFiles
        // DocumentPicker.types.images
        // DocumentPicker.types.plainText
        // DocumentPicker.types.audio
        // DocumentPicker.types.pdf
      });
      // Printing the log realted to the file
      console.log('res : ' + JSON.stringify(res));
      // Setting the state to show single file attributes
      setSingleFile(res);
    } catch (err) {
      setSingleFile(null);
      // Handling any exception (If any)
      if (DocumentPicker.isCancel(err)) {
        // If user canceled the document selection
      
      } else {
        // For Unknown Error
        alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  const get_uploaded_files_data = async () => {
    setModalVisible(true)
    const formData = new FormData();
    formData.append('doc_id', doc_id);
    fetch(global.url + '/uploaded_files_data.php', {
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
        setUploadedFile(responseJson.data);
        setImages(responseJson.data);
        setModalVisible(false)

      })
      .catch(error => {
        setModalVisible(false)
        console.log(error);
        Alert.alert('Network Error. Something went wrong');
      });
  };

  const delete_file = (file_id,file_url) =>
  Alert.alert(
    "Delete this file?",
    "",
    [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
      { text: "OK", onPress: () => {delete_file_fetch(file_id,file_url)} }
    ]
  );
  const delete_file_fetch = async (file_id,file_url) => {
    setModalVisible(true)
    const formData = new FormData();
    formData.append('file_id', file_id);
    formData.append('file_url', file_url);
    fetch(global.url + '/delete_uploaded_file.php', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.json())
      .then(responseJson => {
        setModalVisible(false)
       if(responseJson.response[0].status==1){
          get_uploaded_files_data();
       }else{
        Alert.alert(' Something went wrong');
       }
      })
      .catch(error => {
        setModalVisible(false)
        console.log(error);
        Alert.alert('Network Error. Something went wrong');
      });
  };


  var count = 1;
  //get token on load page
  useEffect(() => {
    get_uploaded_files_data()
  }, [1]); // Only re-run the effect if count changes

 //image view 
 
 const [visible, setIsVisible] = useState(false);

  
 const [images, setImages] = useState([]);

  

//  const images = [
//     {
//       uri: "https://images.unsplash.com/photo-1571501679680-de32f1e7aad4",
//     },
//     {
//       uri: "https://images.unsplash.com/photo-1573273787173-0eb81a833b34",
//     },
//     {
//       uri: "https://images.unsplash.com/photo-1569569970363-df7b6160d111",
//     },
//   ];


  
  return (
    <View style={styles.container}>
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

      <View
        style={{flex: 0.1, backgroundColor: '#60A3D9', justifyContent: 'center'}}>
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>
        Doc #: {doc_id}
        </Text>
      </View>


    <View
      style={{
        marginHorizontal: 40,
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
        width:"100%"
        }}
        activeOpacity={0.5}
        onPress={()=>{
               navigation.goBack()
        }}>
        <Text style={{ color: '#307ecc', paddingVertical: 10, fontSize: 16,  alignSelf: 'center',}}>BACK</Text>
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
        width:"100%",
        marginTop:10
        }}
      activeOpacity={0.5}
      onPress={()=>{
        images.length>0?setIsVisible(true):Alert.alert('No image available')
      }}>
      <Text style={{ color: '#307ecc', paddingVertical: 5, fontSize: 16,  alignSelf: 'center',textAlign:'center'}}>View Images</Text>
    </TouchableOpacity>
      {/*Showing the data of selected Single file*/}
      {singleFile != null ? (<View style={{borderColor:'gray',borderWidth:1,marginTop:10,borderRadius:20,padding:10}}>
        <Text style={styles.textStyle2}>
          Selected File
        </Text>
        <Text style={styles.textStyle}>
       {singleFile[0].name ? singleFile[0].name : ''}
          {'\n'}
         File Type: {singleFile[0].type ? singleFile[0].type : ''}
        </Text>
          <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={uploadImage}>
          <Text style={styles.buttonTextStyle}>Upload Now</Text>
        </TouchableOpacity></View>
      ) : <TouchableOpacity
      style={styles.buttonStyle}
      activeOpacity={0.5}
      onPress={selectFile}>
      <Text style={styles.buttonTextStyle}>Upload New File</Text>
    </TouchableOpacity>}

      

        <Text style={{alignSelf: 'center', fontSize: 20, color: 'gray',marginTop:10}}>
            Uploaded File/s
          </Text>
        <FlatList
              style={{width:"100%",marginTop:10}}
              data={UploadedFile}
              renderItem={renderItem}
              keyExtractor={item => item.id}
        />
      </View>
      <ImageView
            images={images}
            imageIndex={0}
            visible={visible}
            onRequestClose={() => setIsVisible(false)}
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