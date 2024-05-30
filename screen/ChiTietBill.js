import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
} from 'react-native';

import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
export default function ChiTietHoaDon({ route }) {
  const navigation = useNavigation();
  const id = route.params.id;
  const [banGoi, setBanGoi] = useState([]);
  const [monAn, setTableMon] = useState([]);
  const [chiTietMonAn, setChiTietTableMon] = useState([]);
  const [sieuMon, setSieuMon] = useState([]);
  const [tongBill, setTongBill] = useState();
  useEffect(() => {
    fetchTable();
    layDuLieuPhong();
  }, []);

  useEffect(() => {
    fetchMonAn();
  }, [monAn]);

  useEffect(() => {
    tinhTong();
  }, [chiTietMonAn]);

  const tinhTong = async () => {
    var tong = 0;
    for (var i = 0; i < chiTietMonAn.length; i++) {
      tong += parseInt(chiTietMonAn[i].price) * parseInt(monAn[i].quantity);
    }
    setTongBill(tong);
  };

  const layDuLieuPhong = async () => {
    try {
      const response2 = await fetch(
        `https://647afa13d2e5b6101db0b2c3.mockapi.io/table?id_bill=${id}`
      );
      const data1 = await response2.json();
      setBanGoi(data1);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }

    setSieuMon([...monAn, ...chiTietMonAn]);
  };
  const fetchMonAn = async () => {
    for (var i = 0; i < monAn.length; i++) {
      try {
        const response2 = await fetch(
          `https://66388d184253a866a24e340d.mockapi.io/product/${monAn[i].id_product}`
        );
        const data1 = await response2.json();
        setChiTietTableMon((chiTietMonAn) => [...chiTietMonAn, data1]);
      } catch (error) {
        console.error('Lỗi khi tìm nạp danh sách bàn:', error);
      }
    }
    setSieuMon([...monAn, ...chiTietMonAn]);
  };
  // Lấy danh các món ở trong bàn
  const fetchTable = async () => {
    try {
      const response = await fetch(
        `https://663653b5415f4e1a5e27083f.mockapi.io/detai_bill/?id_bill=${id}`
      );

      const data = await response.json();
      setTableMon(data);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };
  const imageQR = require('../assets/qr_code.jpg');
  const [show_Hide, setShowHide] = useState('none');
  const letToggle = () => {
    if (show_Hide === 'flex') {
      setShowHide('none');
    } else {
      setShowHide('flex');
    }
  };
  return (
    <View style={styles.image}>
      <Image
        source={imageQR}
        style={[
          styles.momo,
          {
            width: 300,
            height: 250,
            resizeMode: 'contain',
            display: show_Hide,
          },
        ]}
        onPress={() => letToggle()}
      />

      <View style={styles.cumThanhToan}>
        <Image
          style={styles.thanhToanImage}
          source={require('../assets/logo_bill.png')}
        />
        <Text style={styles.chuThanhToan}>Hóa đơn: {id}</Text>
      </View>
      <Text style={styles.chuThichTieuDe}>Danh sách các món của hóa đơn:</Text>
      <View style={styles.chuThich}>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={styles.doAn}>Đồ ăn</Text>
          <Text style={styles.gia}>Giá</Text>
          <Text style={styles.soLuong}>SL</Text>
        </View>
        <FlatList
          data={sieuMon}
          renderItem={({ item, index }) => (
            <View style={styles.thongTinDoAn}>
              <Text style={styles.tenMon}>{chiTietMonAn[index].name}</Text>
              <Text style={styles.giatt}>{chiTietMonAn[index].price}K</Text>
              <Text style={styles.soLuongtt}>{item.quantity}</Text>
            </View>
          )}
        />
      </View>
      <Text style={{fontSize:20}}>Tổng tiền: {tongBill}K</Text>
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
    alignItems:'center'
  },
  thongTinDoAn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,111,238,0.2)',
    borderRadius: 10,
    marginBottom: 5,
    marginLeft:'2%',
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
    height: 420,
  },
  doAn: {
    fontWeight: 'bold',
    marginLeft: 10,
  },
  tenMon: {
    marginLeft: 7,
  },
  gia: {
    fontWeight: 'bold',
    marginLeft: 120,
  },
  soLuong: {
    fontWeight: 'bold',
    marginLeft: 80,
  },
  giatt: {
    position: 'absolute',
    marginLeft: 170,
  },
  soLuongtt: {
    position: 'absolute',
    marginLeft: 270,
  },
  chuThichTieuDe: {
    alignItems: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom:5,
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
});
