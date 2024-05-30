import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
} from 'react-native';

import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
export default function ThanhToan({ route }) {
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

  // Tính tổng tiền
  const tinhTong = async () => {
    var tong = 0;
    for (var i = 0; i < chiTietMonAn.length; i++) {
      tong += parseInt(chiTietMonAn[i].price) * parseInt(monAn[i].quantity);
      console.log(chiTietMonAn);
    }
    setTongBill(tong);
  };
  //Lấy danh sách tên giá các món ăn
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
      console.log(id);
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
  const ThanhToan = async () => {
    if (chiTietMonAn.length < 1) {
      alert('Không có món để thanh toán');
    } else {
      let now = new Date();
      let nowString = moment(now).format('HH:mm DD/MM/YYYY');
      try {
        let response = await fetch(
          `https://647afa13d2e5b6101db0b2c3.mockapi.io/table/${banGoi[0].id}`,
          {
            method: 'PUT',
            headers: {
              Accept: 'application/json;harset=UTF-8',
              authorization: 'Basic ZHBhbG1hQGljZy5jb20uZ3Q6Z3VhdGU1MDI==',
              'Content-Type': 'application/json;harset=UTF-8',
            },
            body: JSON.stringify({ id_bill: '' }),
          }
        );
        if (response.ok) {
          // Cập nhật thành công
          const update = {
            time: nowString,
            id_staff: 2,
          };
          try {
            let response1 = await fetch(
              `https://663653b5415f4e1a5e27083f.mockapi.io/bill/${id}`,
              {
                method: 'PUT',
                headers: {
                  authorization: 'Basic ZHBhbG1hQGljZy5jb20uZ3Q6Z3VhdGU1MDI==',
                  'Content-Type': 'application/json;harset=UTF-8',
                },
                body: JSON.stringify(update),
              }
            );
            response = await response.json();
            if (response1.ok) {
              // Cập nhật thành công
              Alert.alert(
                'Thông báo',
                'Thanh toán thành công 💸💵💰',
                [{ text: 'OK', onPress: () => navigation.navigate('Home') }],
                { cancelable: false }
              );
            } else {
              // Xử lý lỗi khi cập nhật không thành công
              console.error('Lỗi khi cập nhật bill 123:', response.status);
            }
          } catch (error) {
            console.error('Lỗi khi cập nhật bàn:', error);
          }
        } else {
          // Xử lý lỗi khi cập nhật không thành công
          console.error('Lỗi khi cập nhật bàn 123:', response.status);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật bàn:', error);
      }
      //END CẬP NHẬT THANH TOÁN
      ban = new Ban(id + 1, nowString);
      for (var i = 0; i < ql.getTongSoMonTrongBan(id); i++) {
        ban.addMon(ql.getMonAn(id, i), ql.getSoLuongMon(id, i));
      }
      bill.addBill(ban);
      ql.removeDoAn(id);
    }
  };
  return (
    <View style={styles.image}>
      <Image
        source={imageQR}
        style={[
          styles.momo,
          {
            width: 250,
            height: 290,
            resizeMode: 'contain',
            display: show_Hide,
          },
        ]}
        onPress={() => letToggle()}
      />
      <View style={{ alignItems: 'center' }}>
        <View style={styles.cumThanhToan}>
          <Image
            style={styles.thanhToanImage}
            source={require('../assets/logo_thanhtoan.png')}
          />
          <Text style={styles.chuThanhToan}>Thanh toán</Text>
        </View>
      </View>
      <Text style={styles.chuThichTieuDe}>Danh sách hóa đơn:</Text>
      <View style={styles.chuThich}>
        <View style={{ flexDirection: 'row', padding: 10 }}>
          <Text style={styles.mon}>Món</Text>
          <Text style={styles.price}>Giá</Text>
          <Text style={styles.quantity}>SL</Text>
        </View>
        <FlatList
          data={sieuMon}
          renderItem={({ item, index }) => (
            <View style={styles.thongTinDoAn}>
              <Text style={styles.doAn}>{chiTietMonAn[index].name}</Text>
              <Text style={styles.gia}>{chiTietMonAn[index].price}K</Text>
              <Text style={styles.soLuong}>{item.quantity}</Text>
            </View>
          )}
        />
      </View>
      <View>
        <View style={styles.cumTongBill}>
          <Text style={styles.chuTongBill}>Tổng tiền:</Text>
          <Text style={styles.soTongBill}>{tongBill}K</Text>
        </View>
        <View style={styles.chuPhuongThuc}>
          <Text style={{ fontWeight: 'bold', marginLeft: 2 }}>
            Phương thức thanh toán:
          </Text>
        </View>
        <View style={styles.cacPT}>
          <View style={styles.ptThanhToan}>
            <Image
              style={styles.icon}
              source={require('../assets/icon_tien.png')}
            />
            <Text>Tiền mặt</Text>
          </View>
          <TouchableOpacity
            style={styles.ptThanhToan}
            onPress={() => letToggle()}>
            <Image
              style={styles.icon}
              source={require('../assets/icon_bank.png')}
            />
            <Text onPress={() => letToggle()}>Banking</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.cumXuatBill}>
          <TouchableOpacity
            onPress={() => ThanhToan()}
            style={styles.thanhToan}>
            <Text style={styles.xuatBill}>Thanh toán</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cumXuatBill: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  momo: {
    borderRadius: 10,
    position: 'absolute',
    right: 52,
    top: 150,
    zIndex: 999,
  },
  thanhToan: {
    width: 100,
    backgroundColor: '#338EF7',
    borderRadius: 10,
    padding: 5,
    shadowColor: 'primary',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  xuatBill: {
    textAlign: 'center',
  },
  cacPT: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  ptThanhToan: {
    flexDirection: 'col',
    width: 100,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 5,
    margin: 10,
    shadowColor: 'primary',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    alignItems: 'center',
  },
  chuPhuongThuc: {
    marginLeft: 20,
  },
  thanhToanImage: {
    width: 40,
    height: 40,
  },
  image: {
    flex: 1,
    backgroundColor: 'rgba(0,111,238,0.1)',
  },
  icon: {
    marginTop: 5,
    width: 30,
    height: 30,
  },
  thongTinDoAn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,111,238,0.2)',
    borderRadius: 10,
    marginBottom: 5,
    marginLeft: '1%',
    height: 35,
    width: '98%',
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
  mon: {
    fontWeight: 'bold',
    marginLeft: '1%',
  },
  price: {
    fontWeight: 'bold',
    marginLeft: '46%',
  },
  quantity: {
    fontWeight: 'bold',
    marginLeft: '26%',
  },
  doAn: {
    marginLeft: 7,
  },
  gia: {
    position: 'absolute',
    marginLeft: '56%',
  },
  soLuong: {
    position: 'absolute',
    marginLeft: '88%',
  },
  chuThichTieuDe: {
    borderRadius: 30,
    marginLeft: 55,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  cumTongBill: {
    flexDirection: 'row',
    marginLeft: 22,
  },
  chuTongBill: {
    fontWeight: 'bold',
  },
  soTongBill: {
    position: 'absolute',
    marginLeft: '19%',
    fontWeight: 'bold',
  },
  cumThanhToan: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
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
