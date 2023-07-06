import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { Camera, FlashMode } from "expo-camera";
import * as MediaLibrary from 'expo-media-library';


// import icons
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';

export default function CreatePostsScreen({ }) {
  
  const [label, setLabel] = useState("");
  const [place, setPlace] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [photoSource, setPhotoSource] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      await MediaLibrary.requestPermissionsAsync();

      setHasPermission(status === "granted");
    })();
  }, []);

  let enabled = label.length > 0 && place.length > 0;

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
  };

  const takePhoto = async () => {
    if (cameraRef) {
      const { uri } = await cameraRef.takePictureAsync();
      if (uri) { setPhotoSource(uri) };
      await MediaLibrary.createAssetAsync(uri);
    }
  };

  const onSubmit = () => {
    keyboardHide();
    if (enabled) {
      setLabel("");
      setPlace("");
      console.log("label:", label, "place: ", place);      
    }
  };

  if (hasPermission === null) { return <View /> };
  if (hasPermission === false) { return <Text>No access to camera</Text> };

  return (
    <TouchableWithoutFeedback onPress={keyboardHide}>

      <View style={styles.container}>

        <View style={styles.photoContent}>
          {/* camera */}
          <View style={styles.cameraContainer}>
            <Camera
              style={styles.camera}
              ref={setCameraRef}
              flashMode={FlashMode.auto}
            >
              {photoSource &&
                <View style={styles.previewPhotoContainer}>
                  <Image
                    source={{ uri: photoSource }}
                    style={{
                      height: "100%",
                      width: "100%",
                      resizeMode: "cover"
                    }}
                  />

                </View>
              }
              <TouchableOpacity
                style={styles.btnSnapshot}
                onPress={takePhoto}
              >
                <MaterialIcons name="photo-camera" size={30} color={"#BDBDBD"} />
              </TouchableOpacity>
            </Camera>
          </View>
          {/* uploader */}
          <TouchableOpacity
            style={styles.uploader}
            activeOpacity={0.8}
          >
            <Text style={styles.uploaderText}>Завантажте фото</Text>
          </TouchableOpacity>

        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 0}
        >
          {/* form */}
          <View style={styles.form}>
            {/* input label */}
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Назва..."
                placeholderTextColor="#BDBDBD"
                value={label}
                onFocus={() => {
                  setIsShowKeyboard(true);
                }}
                onBlur={() => setIsShowKeyboard(false)}
                onChangeText={setLabel}
              />
            </View>
            {/* input place */}
            <View style={{
              ...styles.inputWrapper,
              marginTop: 16,
              flexDirection: "row",
              gap: 8,
            }}>
              <Feather name="map-pin" size={24} color="#BDBDBD" />
              <TextInput
                style={styles.input}
                placeholder="Місцевість..."
                placeholderTextColor="#BDBDBD"
                value={place}
                onFocus={() => {
                  setIsShowKeyboard(true);
                }}
                onBlur={() => setIsShowKeyboard(false)}
                onChangeText={setPlace}
              />
            </View>
            {/* btn Submit */}
            <TouchableOpacity
              style={{
                ...styles.btnForm,
                backgroundColor: enabled ? "#FF6C00" : "#F6F6F6"
              }}
              activeOpacity={0.8}
              onPress={onSubmit}
              disabled={!enabled}
            >
              <Text style={{
                ...styles.btnFormTitle,
                color: enabled ? "#FFFFFF" : "#BDBDBD"
              }}>Опублікувати</Text>
            </TouchableOpacity>

          </View>

        </KeyboardAvoidingView>

        {!isShowKeyboard
          ? <TouchableOpacity
            style={{
              ...styles.btnForm,
              height: 40,
              width: 70,
              padding: 8,

              alignSelf: "center",
              backgroundColor: "#F6F6F6"
            }}
            activeOpacity={0.8}
          >
            <Feather name="trash-2" size={24} color="#BDBDBD" />
          </TouchableOpacity>
          : null
        }

      </View>

    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    paddingHorizontal: 16,
    justifyContent: 'flex-end'
  },

  photoContent: {
    marginTop: 32,
    flexDirection: 'column',    
  },

  cameraContainer: {
    width: "100%",
    height: 240,
    backgroundColor: "#F6F6F6",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden"
  },

  camera: {
    position: "relative",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },

  previewPhotoContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },

  btnSnapshot: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 50,
    backgroundColor: "#FFFFFF",

  },

  uploader: {
    marginTop: 8,    
  },

  uploaderText: {
    fontFamily: "Roboto-Regular",
    fontSize: 16,
    fontWeight: 400,
    lineHeight: 15,
    color: "#BDBDBD",
  },

  form: {
    marginTop: 32,
  },

  inputWrapper: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },

  input: {
    width: "100%",
    fontFamily: "Roboto-Regular",
    fontSize: 16,    
    color: "#212121",
  },
  
  btnForm: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
    padding: 16,   
    borderRadius: 25,
  },

  btnFormTitle: {
    fontFamily: 'Roboto-Regular',
    fontWeight: 400,
    fontSize: 16,
    color: '#BDBDBD',
  },
});