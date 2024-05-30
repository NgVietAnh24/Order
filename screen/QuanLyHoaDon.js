import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';

import ToastAndroid from 'react-native';
import { format } from 'date-fns';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
export default function HoaDon({ route }) {
  const navigation = useNavigation();
  const [bill, setBill] = useState([]);
  useEffect(() => {
    layDuLieuHoaDon();
  }, []);
  const layDuLieuHoaDon = async () => {
    try {
      const response2 = await fetch(
        `https://663653b5415f4e1a5e27083f.mockapi.io/bill`
      );
      const data1 = await response2.json();
      const data2 = [];
      for (var i = data1.length - 1; i >= 0; i--) {
        if (data1[i].time != '') {
          data2.push(data1[i]);
        }
      }
      setBill(data2);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };
  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(
        `https://663653b5415f4e1a5e27083f.mockapi.io/bill/${id}`,
        {
          method: 'DELETE',
        }
      );
      if (response.ok) {
        const updatedBill = bill.filter((item) => item.id !== id);
        setBill(updatedBill);// khi xóa sẽ reload lại danh sách bill
        
      }
    } catch (error) {
      console.error('Lỗi khi xoá hoá đơn:', error);
    }
  };
  return (
    <View style={styles.image}>
      <View style={{ alignItems: 'center' }}>
        <View style={styles.cumThanhToan}>
          <Image
            style={styles.thanhToanImage}
            source={require('../assets/logo_bill.png')}
          />
          <Text style={styles.chuThanhToan}>Hóa đơn</Text>
        </View>
      </View>
      <Text style={styles.chuThichTieuDe}>Danh sách các hóa đơn:</Text>
      <View style={styles.chuThich}>
        <View style={{ flexDirection: 'row', padding: 10, }}>
          <Text style={styles.stt}>STT</Text>
          <Text style={styles.time}>Thời gian</Text>
        </View>
        <FlatList
          data={bill}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.replace('Chi tiết hóa đơn', { id: item.id })
              }>
              <View style={styles.thongtinmonan}>
                <Text style={styles.doUong}>{item.id}</Text>
                <Text style={styles.gia}>{item.time}</Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteItem(item.id)}>
                  <Text style={styles.deleteButtonText}>Xoá</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  thanhToanImage: {
    width: 40,
    height: 40,
  },
  image: {
    flex: 1,
    backgroundColor: '#E6F1FE',
  },
  thongtinmonan: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,111,238,0.2)',
    borderRadius: 10,
    marginBottom: 5,
    marginLeft: '2%',
    height: 35,
    width: '96%',
    alignItems: 'center',
  },
  chuThich: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    height:420,
    
  },
  stt: {
    fontWeight: 'bold',
    marginLeft: '2%',
  },
  time: {
    fontWeight: 'bold',
    marginLeft: '30%',
  },
  doUong: {
    marginLeft: 10,
  },
  gia: {
    marginLeft: '35%',
    position: 'absolute',
  },
  chuThichTieuDe: {
    borderRadius: 30,
    marginLeft: 55,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cumThanhToan: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
    marginTop: 10,
    backgroundColor: 'white',
    alignItems: 'center',
    height: 60,
    width: 250,
    borderRadius: 10,
    shadowColor: 'primary',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  chuThanhToan: {
    fontSize: 20,
    fontWeight: '600',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 4,
    padding:2,
    position:'absolute',
    marginLeft:'89%',
     shadowColor: 'primary',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
