import { TouchableOpacity, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from './screen/LoginScreen';
import ForgotPasswordScreen from './screen/ForgotPasswordScreen';
import ResetPasswordScreen from './screen/ResetPasswordScreen';
import FinishResetPasswordScreen from './screen/FinishResetPasswordScreen';
import HomeScreen_0 from './screen/HomeScreen_0';
import HomeScreen_1 from './screen/HomeScreen_1';
import EmployeeManager from './screen/EmployeeManager';
import Order from './screen/Order';
import OrderEmloyee from './screen/OrderEmloyee';
import ManageTable from './screen/ManageTable';
import ProductManager from './screen/ProductManager';
import ChiTietHoaDon from './screen/ChiTietBill';
import QuanLyHoaDon from './screen/QuanLyHoaDon';
import ThanhToan from './screen/ThanhToan';
import ThanhToanEmloyee from './screen/ThanhToanEmloyee';
import ThongKeBieuDo from './screen/ThongKeBietDo';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Quên mật khẩu" component={ForgotPasswordScreen} />
        <Stack.Screen name="Tạo mật khẩu mới" component={ResetPasswordScreen} />
        <Stack.Screen
          name="FinishResetPasswordScreen"
          component={FinishResetPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home_admin"
          component={HomeScreen_0}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen_1}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Quản lý bàn" component={ManageTable} />
        <Stack.Screen name="Quản lý nhân viên" component={EmployeeManager} />
        <Stack.Screen name="Đặt món" component={Order} />
        <Stack.Screen name="Đặt món." component={OrderEmloyee} />
        <Stack.Screen name="Quản lý món ăn" component={ProductManager} />
        <Stack.Screen name="Thống kê" component={ThongKeBieuDo} />
        <Stack.Screen
          name="Chi tiết hóa đơn"
          component={ChiTietHoaDon}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => navigation.navigate('Quản lý hóa đơn')}>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require('./assets/back.png')}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen
          name="Quản lý hóa đơn"
          component={QuanLyHoaDon}
          options={({ navigation }) => ({
            headerLeft: () => (
              <TouchableOpacity
                style={{ marginLeft: 10 }}
                onPress={() => navigation.navigate('Home_admin')}>
                <Image
                  style={{ width: 20, height: 20 }}
                  source={require('./assets/back.png')}
                />
              </TouchableOpacity>
            ),
          })}
        />
        <Stack.Screen name="Thanh toán" component={ThanhToan} />
        <Stack.Screen name="Thanh toán." component={ThanhToanEmloyee} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
