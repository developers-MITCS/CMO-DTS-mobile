// Example to Pick and Upload files in React Native
// https://aboutreact.com/file-uploading-in-react-native/
 
// Import React
import React, { useState } from 'react';
// Import core components
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  PermissionsAndroid,
  Modal,Dimensions
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker'
const windowWidth = Dimensions.get('window').width;

const DATA = [
  {
    id: '3ac68afc-c605-48d3-a4f8-fb33d91aa97f63',
    title: 'File 1',
  },
  {
    id: '3ac68afc-c605-48d3-a4f8-fbd9sdf1aa97f63',
    title: 'File 2',
  },
];

export default function DateScreen  ({route,navigation})  {
  const [filePath, setFilePath] = useState({});
  const {doc_id} = route.params;
 //image
 const [image_preview,Setimage_preview] = useState(false);
 const [imageUri,setImageUri] = useState('');
 const [ImageFileType,setImageFileType] = useState('');
 const [ImageFileName,setImageFileName] = useState('');
 const [modalVisible, setModalVisible] = useState(false);
 const [modalVisible, setModalVisible] = useState(false);

const requestExternalWritePermission = async () => {
  if (Platform.OS === 'android') {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
        },
      );
      // If WRITE_EXTERNAL_STORAGE Permission is granted
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      alert('Write permission err', err);
    }
    return false;
  } else return true;
};

  const requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission',
          },
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    } else return true;
  };

  const fetch_upload_image_camera = () =>{
    console.log(imageUri)
    const formData = new FormData();
    formData.append('doc_id', doc_id);
    formData.append('file_attachment', {
      uri: imageUri,
      name: ImageFileName,
      type: ImageFileType
    });
    formData.append('Content-Type', 'image/png');

    fetch( global.url + '/camera.php',{
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formData
      })
      .then((response) => response.json())
      .then((responseJson) => {
         console.log(responseJson);     
        })
        .catch((error) => {
            console.log(error);
          });
  }

  const _launchImageLibrary = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
   launchImageLibrary(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        const source = { uri: response.uri };
        console.log('response', JSON.stringify(response));
       
        setImageUri(response.assets[0].uri)
        setImageFileType(response.assets[0].type);
        setFilePath(response.assets[0]);
        setImageFileName( response.assets[0].fileName);
      }
    });

  }

  const _launchCameraLibrary = async (type) => {
    let options = {
      mediaType: type,
      maxWidth: 300,
      maxHeight: 550,
      quality: 1,
      videoQuality: 'low',
      durationLimit: 30, //Video max duration in seconds
      saveToPhotos: true,
    };
    let isCameraPermitted = await requestCameraPermission();
    let isStoragePermitted = await requestExternalWritePermission();
    if (isCameraPermitted && isStoragePermitted) {
      launchCamera(options, (response) => {
        console.log('Response = ', response);
        
        if (response.didCancel) {
          Setimage_preview(false)
          alert('User cancelled camera picker');
          return;
        } else if (response.errorCode == 'camera_unavailable') {
          Setimage_preview(false)
          alert('Camera not available on device');
          return;
        } else if (response.errorCode == 'permission') {
          Setimage_preview(false)
          alert('Permission not satisfied');
          return;
        } else if (response.errorCode == 'others') {
          Setimage_preview(false)
          alert(response.errorMessage);
          return;
        }
        Setimage_preview(true)
        console.log('base64 -> ', response.assets[0].base64);
        console.log('uri -> ', response.assets[0].uri);
        console.log('width -> ', response.assets[0].width);
        console.log('height -> ', response.assets[0].height);
        console.log('fileSize -> ', response.assets[0].fileSize);
        console.log('type -> ', response.assets[0].type);
        console.log('fileName -> ', response.assets[0].fileName);
        console.log(response.assets[0])
        setFilePath(response.assets[0]);
        setImageFileType(response.assets[0].type);
        setImageUri(response.assets[0].uri)
        setImageFileName( response.assets[0].fileName);
      });
    }
  };

  //flatlist
  const renderItem = ({item}) => <Item title={item.title} />;
  const Item = ({title}) => (
    <TouchableOpacity onPress={() => select_leave(title)}>
      <View style={styles.item}>
        <Text style={styles.title}>{title}</Text>
      </View>
    </TouchableOpacity>
  );


  return (
    <View style={styles.container}>
 
      <View
        style={{flex: 0.1, backgroundColor: '#60A3D9', justifyContent: 'center'}}>
        <Text style={{alignSelf: 'center', color: 'white', fontSize: 20}}>
          Doc No. {doc_id}
        </Text>
      </View>

      <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(!modalVisible);
          }}>
    <View style={styles.centeredView}>
            <View style={styles.modalView}>
      
      <TouchableOpacity
                 onPress={() => {  _launchCameraLibrary('photo') }}
                style={{alignItems:"center",marginBottom:10}}
                >
                 <Image 
            style={{height:200,width:200,alignItems:"center",alignContent:"center"}}
            source={
            image_preview==false?require('./add_image.png'):{ uri: filePath.uri }
            } />
            </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={() => {  _launchCameraLibrary('photo') }}>
        <Text style={styles.buttonTextStyle}>Open Camera</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonStyle}
        activeOpacity={0.5}
        onPress={_launchImageLibrary}>
       
        <Text style={styles.buttonTextStyle}>Open Gallery</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={{  width:windowWidth*0.65,
          backgroundColor: '#307ecc',
          borderWidth: 0,
          color: '#FFFFFF',
          borderColor: '#307ecc',
          height: 40,
          borderRadius: 30,
          marginTop: 15,}}
        activeOpacity={0.5}
        onPress={fetch_upload_image_camera}>
        <Text style={styles.buttonTextStyle}>Upload Selected</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ width:windowWidth*0.65,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        color: '#FFFFFF',
        borderColor: '#307ecc',
        height: 40,
        borderRadius: 30,
        marginTop: 15,}}
        activeOpacity={0.5}
        onPress={()=>{
         setModalVisible(false)
        }}>
        <Text style={{ color: '#307ecc', paddingVertical: 10, fontSize: 16,  alignSelf: 'center',}}>CANCEL</Text>
      </TouchableOpacity>
      
  
      
      </View>
    </View>
    
    </Modal>


        <View style={{justifyContent: 'center', alignContent: 'center'}}>
        <TouchableOpacity
        style={{
          width:"80%",
          backgroundColor: '#307ecc',
          borderWidth: 0,
          color: '#FFFFFF',
          borderColor: '#307ecc',
          height: 40,
          borderRadius: 30,
          alignSelf:'center',
          marginTop: 15,
        }}
        activeOpacity={0.5}
        onPress={()=>{setModalVisible(true)}}>
        <Text style={{ color: '#FFFFFF',
    alignSelf:'center',
    textAlign:'center',
    fontSize: 16,
    padding:10,
  }}>Upload New Image</Text>
      </TouchableOpacity>
      
        <Text style={{textAlign:'center',alignSelf: 'center', fontSize: 20, color: 'gray',marginTop:20}}>
            UPLOADED FILES
        </Text>
        <FlatList
              data={DATA}
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
    width:windowWidth*0.65,
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
    padding:10,
    width:"100%",
    textAlign:'center'
  },
  textStyle: {
    backgroundColor: '#fff',
    fontSize: 15,
    marginTop:20,
    padding:20,
    alignSelf: 'center',
    width:'100%'
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
});