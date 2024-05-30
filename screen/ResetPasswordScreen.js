import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

export default function ResetPasswordScreen({ route, navigation }) {
  const { username } = route.params;
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [enteredSecurityCode, setEnteredSecurityCode] = useState('');
  const [securityCode, setSecurityCode] = useState('');
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);

  useEffect(() => {
    retrieveSecurityCode();
  }, []);

  const retrieveSecurityCode = async () => {
    try {
      const code = await AsyncStorage.getItem('securityCode');
      if (code) {
        setSecurityCode(code);
      }
    } catch (error) {
      console.error('Error retrieving security code from AsyncStorage:', error);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword.trim() || !confirmPassword.trim()) {
      // Handle error for empty password
      return;
    }
    if (newPassword !== confirmPassword) {
      // Handle error for mismatched passwords
      return;
    }
    if (enteredSecurityCode !== securityCode) {
      // Handle error for incorrect security code
      setIsErrorModalVisible(true);
      return;
    }

    try {
      // Send password change request to API
      const response = await fetch(
        'https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account'
      );
      const data = await response.json();
      const user = data.find((user) => user.username === username);

      if (user) {
        // Update password for the user
        await requestPasswordChange(user.id, newPassword);

        // Reset form fields
        setNewPassword('');
        setConfirmPassword('');
        setEnteredSecurityCode('');

        // Navigate to the password reset success screen
        navigation.navigate('FinishResetPasswordScreen');
      } else {
        // Handle error for user not found
      }
    } catch (error) {
      console.error('Error calling API:', error);
    }
  };

  const requestPasswordChange = async (employeeId, newPassword) => {
    try {
      const updatedEmployee = {
        password: newPassword,
      };

      await fetch(
        `https://646abd257d3c1cae4ce2bb57.mockapi.io/api/caferoyale/account/${employeeId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEmployee),
        }
      );

      // Handle success for password change request
    } catch (error) {
      console.error('Error sending password change request:', error);
      // Handle error for password change request
    }
  };

  const closeModal = () => {
    setIsErrorModalVisible(false); // Hide error modal
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vui lòng nhập mật khẩu mới !</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu mới"
          placeholderTextColor='rgba(0,111,238,0.8)'
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Xác nhận mật khẩu"
          placeholderTextColor='rgba(0,111,238,0.8)'
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>
      <Text style={styles.content}>Nhập mã xác thực để hoàn tất.</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Mã xác thực"
          placeholderTextColor='rgba(0,111,238,0.8)'
          value={enteredSecurityCode}
          onChangeText={setEnteredSecurityCode}
        />
      </View>

      <TouchableOpacity
        style={styles.buttonContinue}
        onPress={handleResetPassword}>
        <Text style={styles.buttonContinueText}>Hoàn thành</Text>
      </TouchableOpacity>

      {/* Error Modal */}
      <Modal isVisible={isErrorModalVisible} onBackdropPress={closeModal}>
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Đặt lại mật khẩu thất bại</Text>
          <Text style={styles.modalText}>
            Mã xác thực không chính xác. Vui lòng thử lại.
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
    backgroundColor:'white',
    borderTopWidth:1,
  },
  title: {
    fontSize: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  content: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    paddingHorizontal: 15,
  },
  buttonContinue: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '80%',
    shadowColor: 'primary',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  buttonContinueText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  inputContainer: {
    backgroundColor: '#E6F1FE',
    borderRadius: 10,
    width: '80%',
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
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
});
