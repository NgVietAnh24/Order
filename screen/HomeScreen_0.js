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
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function App() {
  const [tables, setTables] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const reload = navigation.addListener('focus', () => {
      fetchTable();
    });
    return reload;
  }, [navigation]);

  const fetchTable = async () => {
    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/table'
      );
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Lỗi khi tải danh sách bàn:', error);
    }
  };

  const showTable = ({ item }) => {
    if (item.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return (
        <View style={tableStyles.table}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Đặt món', {
                tableId: item.id,
                billId: item.id_bill,
              });
            }}>
            <View style={tableStyles.tableContent}>
              <Image
                style={tableStyles.img}
                source={require('../assets/table.png')}
              />
              <Text style={tableStyles.tableName}>{item.name}</Text>
              <View style={tableStyles.groupState}>
                <Text style={tableStyles.tableName}>Trạng thái: </Text>
                {item.id_bill === '' ? (
                  
                  <View style={tableStyles.greenBox} />
                ) : (
                  <View style={tableStyles.redBox} />
                )}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      );
    }
    return null; // Trả về null nếu sản phẩm không phù hợp với từ khóa tìm kiếm
  };

  const handlePickerChange = (itemValue) => {
    setSelectedOption(itemValue);
    setDropdownOpen(false); // Đóng dropdown sau khi chọn
    switch (itemValue) {
      case 'themSP':
        navigation.navigate('Quản lý món ăn');
        break;
      case 'themNV':
        navigation.navigate('Quản lý nhân viên');
        break;
      case 'themban':
        navigation.navigate('Quản lý bàn');
        break;
      case 'qldon':
        navigation.navigate('Quản lý hóa đơn');
        break;
      case 'bd':
        navigation.navigate('Thống kê');
        break;
      case 'dangxuat':
        navigation.navigate('Login');
        break;
    }
  };

  const options = [
    { label: 'Quản Lý Món Ăn', value: 'themSP' },
    { label: 'Quản Lý Nhân Viên', value: 'themNV' },
    { label: 'Quản Lý Bàn', value: 'themban' },
    { label: 'Quản Lý Đơn', value: 'qldon' },
    { label: 'Biểu Đồ', value: 'bd' },
    { label: 'Đăng Xuất', value: 'dangxuat' },
  ];

  return (
    <ImageBackground
      source={require('../assets/background_home.jpeg')}
      style={headerStyles.backgroundImage}>
      <View>
        <View style={headerStyles.container}>
          <TouchableOpacity style={headerStyles.backButton}>
            <Image
              source={require('../assets/logo_home.png')}
              style={headerStyles.backIcon}
            />
          </TouchableOpacity>
          <View style={headerStyles.searchContainer}>
            <TextInput
              style={headerStyles.searchInput}
              placeholder="Tìm kiếm..."
              placeholderTextColor='#000'
              onChangeText={(text) => setSearchKeyword(text)}
            />
          </View>

          <TouchableOpacity
            onPress={() => setDropdownOpen(!dropdownOpen)}
            style={headerStyles.dropdown}>
            <Image
              source={require('../assets/dropdown.png')}
              style={headerStyles.dropdownIcon}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          style={tableStyles.container}
          data={tables}
          renderItem={showTable}
          keyExtractor={(item) => item.id.toString()}
          ListFooterComponent={
            dropdownOpen && <View style={headerStyles.dropdownList} />
          }
        />
        {dropdownOpen && (
          <View style={headerStyles.dropdownList}>
            {options.map((option) => (
              <TouchableOpacity
                style={headerStyles.option}
                onPress={() => handlePickerChange(option.value)}
                key={option.value}>
                <Text style={headerStyles.optionText}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const tableStyles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    height: '88%',
    width: '100%',
    marginRight: 100,
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
    width:'98%',
  },
  tableContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width:'100%',
  },
  img: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  tableName: {
    fontSize: 20,
    position:'absolute',
    marginLeft: '120%',
    fontWeight: 'bold',
    color: '#000',
  },
  groupState: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    marginLeft: '200%',
  },
  greenBox: {
    width: 20,
    height: 20,
    backgroundColor: '#228B22',
    marginLeft: '700%',
    borderRadius: 10,
  },
  redBox: {
    width: 20,
    height: 20,
    backgroundColor: '#FF0000',
    marginLeft: '700%',
    borderRadius: 10,
  },
});

const headerStyles = StyleSheet.create({
  container: {
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
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  dropdown: {
    marginTop: 25,
    marginRight: 10,
  },
  dropdownList: {
    position: 'absolute',
    top: Dimensions.get('window').height * 0.1, // Điều chỉnh vị trí của dropdownList
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  dropdownIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  option: {
    backgroundColor: '#8ED1C6',
    borderRadius: 8,
    padding: 10,
    margin: 5,
  },
  optionText: {
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold',
  },
});
