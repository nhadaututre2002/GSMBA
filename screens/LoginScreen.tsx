import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, {useState} from "react";
import Spacing from "../constants/Spacing";
import FontSize from "../constants/FontSize";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types";
import AppTextInput from "../components/AppTextInput";
import axios from "axios";
import navigation from "../navigation";
import { useNavigation } from "@react-navigation/native";



type Props = NativeStackScreenProps<RootStackParamList, "Login">;

const LoginScreen: React.FC<Props> = ({ navigation: { navigate } }) => {
  const navigation = useNavigation();
  const [UserAccount, setUserAccount] = useState('');
  const [Password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [token, setToken] = useState('');

  const handleLogin = () => {
    const apiURL = `http://14.225.244.63:4040/api/Login?UserAccount=${UserAccount}&Password=${Password}`;
    axios.get(apiURL)
  .then(response => {
    // Kiểm tra dữ liệu trả về từ API
    if (response.data.MESSAGE === 'success') {
      console.log(response.data);
      setUserId(response.data.USER_ID);
      setToken(response.data.TOKEN);
      navigation.navigate("DataScreen", {userId: response.data.USER_ID, token: response.data.TOKEN});
    } else {
      console.log(response.data);
      Alert.alert('Đăng nhập thất bại');
    }
  })
  .catch(error => {
    console.error(error);
    Alert.alert('Đăng nhập thất bại');
  });
  };

  return (
    <SafeAreaView>
      <View
        style={{
          padding: Spacing * 2,
        }}
      >
        <View
          style={{
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontSize: FontSize.xLarge,
              color: Colors.primary,
              fontFamily: Font["poppins-bold"],
              marginVertical: Spacing * 3,
            }}
          >
            Login here
          </Text>
        </View>
        <View
          style={{
            marginVertical: Spacing * 3,
          }}
        >
          <AppTextInput
            placeholder="User"
            value={UserAccount}
            onChangeText={setUserAccount}
          />
          <AppTextInput
            placeholder="Password"
            value={Password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
        </View>

        <View>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            padding: Spacing * 2,
            backgroundColor: Colors.primary,
            marginVertical: Spacing * 3,
            borderRadius: Spacing,
            shadowColor: Colors.primary,
            shadowOffset: {
              width: 0,
              height: Spacing,
            },
            shadowOpacity: 0.3,
            shadowRadius: Spacing,
          }}
        >
          <Text
            style={{
              fontFamily: Font["poppins-bold"],
              color: Colors.onPrimary,
              textAlign: "center",
              fontSize: FontSize.large,
            }}
          >
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
