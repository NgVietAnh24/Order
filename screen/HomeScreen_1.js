import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  TextInput,
  ImageBackground,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [tables, setTables] = useState([]); // State lưu trữ danh sách bàn
  const [search, setSearch] = useState('');
  const navigation = useNavigation(); // Sử dụng hook useNavigation để điều hướng màn hình

  useEffect(() => {
    const reload = navigation.addListener('focus', () => {
      fetchTable();
    }); // Gọi hàm fetchTable() khi component được tạo
    return reload;
  }, [navigation]);

  const fetchTable = async () => {
    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/table'
      );
      const data = await response.json();
      setTables(data); // Cập nhật danh sách bàn vào state
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };

  const showTable = ({ item }) => {
    return (
      <View style={styles.table}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Đặt món.', {
              tableId: item.id,
              billId: item.id_bill,
            }); // Điều hướng đến màn hình 'order' và truyền id bàn qua tham số
          }}>
          <View style={styles.tableContent}>
            <Image
              style={styles.img}
              source={require('../assets/table.png')} // Hiển thị ảnh bàn
            />
            <Text style={styles.tableName}>{item.name}</Text>
            <View style={styles.groupState}>
              <Text style={styles.tableName}>Trạng thái: </Text>
              {item.id_bill === '' ? (
                <View style={styles.greenBox} />
              ) : (
                <View style={styles.redBox} />
              )}
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const handleLogout = () => {
    navigation.navigate('Login');
  };

  // Lọc danh sách bàn theo từ khóa tìm kiếm
  const filteredTables = tables.filter((table) =>
    table.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <ImageBackground
      source={require('../assets/background_home.jpeg')}
      style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Image
            source={require('../assets/logo_home.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="rgba(0,111,238,0.4)"
            value={search}
            onChangeText={(text) => setSearch(text)}
          />
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Image
            source={require('../assets/logout.png')}
            style={styles.logoutButtonText}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.tableList}
        data={filteredTables}
        renderItem={showTable}
        keyExtractor={(item) => item.id.toString()}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#338EF7',
    paddingBottom: 10,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    marginTop: 20,
    width: 60,
    height: 60,
    resizeMode: 'contain',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E6F1FE',
    borderRadius: 8,
    paddingHorizontal: 8,
    marginTop: 25,
    marginRight: 20,
  },
  searchInput: {
    flex: 1,
  },
  logoutButton: {
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    marginTop: 24,
    marginRight: 10,
  },
  groupState: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    marginLeft: '90%',
  },
  tableList: {
    flex: 1,
  },
  table: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 5,
    borderColor: '#006FEE',
    borderWidth: 2,
    padding: 5,
    backgroundColor: '#E6F1FE',
    marginLeft: '1%',
    width: '98%',
  },
  tableContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  img: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
    marginRight: 16,
  },
  tableName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: '15%',
  },
  greenBox: {
    width: 20,
    height: 20,
    backgroundColor: '#228B22',
    borderRadius: 10,
    marginLeft: 10,
  },
  redBox: {
    width: 20,
    height: 20,
    backgroundColor: '#FF0000',
    borderRadius: 10,
    marginLeft: 10,
  },
});
