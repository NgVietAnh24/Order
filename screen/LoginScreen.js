import React, { useState } from 'react';
import Modal from 'react-native-modal';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false); // Biến state để theo dõi trạng thái của mật khẩu
  const navigation = useNavigation();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [eyeIcon, setEyeIcon] = useState(require('../assets/hide_eye.png')); // Biến state cho icon mắt

  const handleLogin = async () => {
    try {
      const response = await fetch(
        'https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account'
      );
      const data = await response.json();
      const user = data.find(
        (account) =>
          account.username === username && account.password === password
      );
      if (user) {
        if (user.type === 0) {
          navigation.navigate('Home_admin');
        } else if (user.type === 1) {
          navigation.navigate('Home');
        }
        setUsername(''); // Reset username
        setPassword(''); // Reset password
      } else {
        setIsModalVisible(true); // Hiển thị popup lỗi
      }
    } catch (error) {
      console.error('Lỗi khi đăng nhập:', error);
      setIsModalVisible(true); // Hiển thị popup lỗi
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev); // Đảo ngược trạng thái của biến state khi nhấn vào
    // Đổi icon mắt
    if (eyeIcon === require('../assets/show_eye.png')) {
      setEyeIcon(require('../assets/hide_eye.png'));
    } else {
      setEyeIcon(require('../assets/show_eye.png'));
    }
  };

  const closeModal = () => {
    setIsModalVisible(false); // Ẩn popup
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/logo_login.png')}
        style={styles.iconAccount}
        resizeMode="contain"
      />

      <Text style={styles.title}>Đăng nhập</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="rgba(0,111,238,0.8)"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="rgba(0,111,238,0.8)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!isPasswordVisible} // Sử dụng secureTextEntry để ẩn mật khẩu khi isPasswordVisible là false
        />
        <TouchableOpacity onPress={togglePasswordVisibility}>
          <Image
            source={eyeIcon} // Sử dụng biến state để hiển thị icon mắt tương ứng
            style={styles.eyeIcon}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.forgotPass}
        onPress={() => navigation.navigate('Quên mật khẩu')}>
        <Text style={styles.forgotPassText}>Quên mật khẩu?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonLogin} onPress={handleLogin}>
        <Text style={styles.buttonLoginText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Popup lỗi */}
      <Modal isVisible={isModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đăng nhập thất bại</Text>
          <Text style={styles.modalText}>
            Tên đăng nhập hoặc mật khẩu không đúng
          </Text>
          <TouchableOpacity style={styles.modalButton} onPress={closeModal}>
            <Text style={styles.modalButtonText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  iconAccount: {
    height: 150,
    marginTop: 100,
  },
  title: {
    color: '#338EF7',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 30,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
  },
  buttonLogin: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: 115,
    shadowColor: 'blue',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  buttonLoginText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 20,
    backgroundColor: '#E6F1FE',
    borderRadius: 8,
    width: 280,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  forgotPass: {
    marginTop: 5,
    marginLeft: 190,
  },
  forgotPassText: {
    fontSize: 12,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: '#007AFF',
    borderRadius: 5,
    padding: 10,
    alignItems: 'center',
    width: '100%',
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  eyeIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});
