import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {

  const navigation = useNavigation();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>Thành công !</Text>

      <Text style={styles.content}>Mật khẩu của bạn đã được thiết lập lại thành công! Bây giờ hãy đăng nhập bằng mật khẩu mới của bạn.</Text>

      <TouchableOpacity style={styles.buttonContinue} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonContinueText}>Đăng nhập</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor:'white',
  },
  title: {
    fontSize: 20,
    height: 70,
    marginTop: 80,
  },
  content:{
    fontSize: 14,
    marginLeft: 50,
    marginRight: 50,
    height: 50,
    textAlign: 'center'
  },
  buttonContinue: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 65,
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
});
