import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Oder({ route }) {
  const navigation = useNavigation();

  const tableId = route.params.tableId;
  const bill_Id = route.params.billId;
  console.log(bill_Id);

  useEffect(() => {
    fetchProducts(); // Gọi hàm fetchProducts thay vì fetchProduct
    console.log(bill_Id);
  }, []);

  const [products, setProducts] = useState([]); // Sử dụng tên products thay vì product
  const [selectedItems, setSelectedItems] = useState([]);
  const [billList, setBillList] = useState([]); // Thêm khai báo biến setBillList
  const [searchKeyword, setSearchKeyword] = useState('');

  const calculateTotal = () => {
    let total = 0;
    selectedItems.forEach((item) => {
      total += item.price * item.quantity;
    });
    return total;
  };

  const addItemToCart = (item) => {
    const existingItem = selectedItems.find(
      (selectedItem) => selectedItem.id === item.id
    );

    if (existingItem) {
      const updatedItems = selectedItems.map((selectedItem) => {
        if (selectedItem.id === item.id) {
          return { ...selectedItem, quantity: selectedItem.quantity + 1 };
        }
        return selectedItem;
      });
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, { ...item, quantity: 1 }]);
    }
  };

  const removeItemFromCart = (item) => {
    const existingItem = selectedItems.find(
      (selectedItem) => selectedItem.id === item.id
    );

    if (existingItem.quantity === 1) {
      const updatedItems = selectedItems.filter(
        (selectedItem) => selectedItem.id !== item.id
      );
      setSelectedItems(updatedItems);
    } else {
      const updatedItems = selectedItems.map((selectedItem) => {
        if (selectedItem.id === item.id) {
          return { ...selectedItem, quantity: selectedItem.quantity - 1 };
        }
        return selectedItem;
      });
      setSelectedItems(updatedItems);
    }
  };

  // Lấy dữ liệu sản phẩm từ mock API
  const fetchProducts = async () => {
    try {
      const response = await fetch(
        'https://66388d184253a866a24e340d.mockapi.io/product'
      );
      const data = await response.json();
      setProducts(data); // Cập nhật danh sách sản phẩm vào state
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
    }
  };

  const addOrUpdateBill = async () => {
    try {
      // Kiểm tra xem đã chọn món ăn hay chưa
      if (selectedItems.length === 0) {
      Alert.alert(
        'Thông báo',
        'Hãy chọn món ăn 🥗',
        [
          { text: 'OK', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
      return;
    }
      // Kiểm tra xem bàn đã có bill hay chưa
      const response = await fetch(
        `https://663653b5415f4e1a5e27083f.mockapi.io/bill/${tableId}`
      );
      if (response.ok) {
        const bills = await response.json();
        console.log(bills[0]);
        if (bills.length > 0) {
          await createDetailBills(selectedItems, bills[0].id);
          console.log('thêm bill thành công' + 'sua');
        } else {
          // Bàn chưa có bill, thực hiện thêm bill mới
          const newBill = {
            id_table: tableId,
            id_staff: '', // Giá trị id_staff mới
            time: '', // Giá trị thời gian mới
            // Thêm các trường khác vào bill mới
          };

          const addResponse = await fetch(
            'https://663653b5415f4e1a5e27083f.mockapi.io/bill',
            {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(newBill),
            }
          );

          if (addResponse.ok) {
            const createdBill = await addResponse.json();
            setBillList([...billList, createdBill]);

            // Cập nhật trường id_bill trong table
            await updateTableIdBill(tableId, createdBill.id);
            console.log('thêm bill thành công!');
            Alert.alert(
              'Thông báo',
              'Đặt bàn thành công ✅',
              [{ text: 'OK', onPress: () => navigation.navigate('Home') }],
              { cancelable: false }
            );
            idBill = createdBill.id;
            await createDetailBills(selectedItems, createdBill.id);
          } else {
            console.error('Lỗi khi thêm bill:', addResponse.status);
          }
        }
      } else {
        console.error('Lỗi khi kiểm tra bill:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi thêm hoặc cập nhật bill:', error);
    }
  };

  const updateTableIdBill = async (tableId, billId) => {
    try {
      const updatedTable = {
        id_bill: billId,
      };

      const response = await fetch(
        `https://647afa13d2e5b6101db0b2c3.mockapi.io/table/${tableId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedTable),
        }
      );

      if (response.ok) {
        // Cập nhật thành công
        console.log('Cập nhật trường id_bill thành công');
      } else {
        console.error('Lỗi khi cập nhật id_bill:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật id_bill:', error);
    }
  };

  const createDetailBills = async (selectedItems, idBill) => {
    try {
      for (const item of selectedItems) {
        const detailBill = {
          id_bill: idBill,
          id_product: item.id,
          quantity: item.quantity,
        };

        const response = await fetch(
          'https://663653b5415f4e1a5e27083f.mockapi.io/detai_bill',
          {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(detailBill),
          }
        );

        if (response.ok) {
          const createdDetailBill = await response.json();
          console.log('Đã tạo chi tiết hóa đơn:', createdDetailBill);
        } else {
          console.error('Lỗi khi tạo chi tiết hóa đơn:', response.status);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tạo chi tiết hóa đơn:', error);
    }
  };

  const renderItem = ({ item }) => {
    if (item.name.toLowerCase().includes(searchKeyword.toLowerCase())) {
      return (
        <TouchableOpacity onPress={() => addItemToCart(item)}>
          <View style={styles.itemContainer}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{item.price}K</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }
    return null; // Trả về null nếu sản phẩm không phù hợp với từ khóa tìm kiếm
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.img}
        source={require('../assets/background_food.png')}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm..."
            placeholderTextColor="rgba(0,111,238,0.4)"
            onChangeText={(text) => setSearchKeyword(text)}
          />
        </View>
        <View style={styles.listContent}>
          <FlatList
            data={products} // Sử dụng danh sách sản phẩm từ state "products"
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
        <View style={styles.cartContainer}>
          <Text style={styles.cartTitle}>Danh sách đã chọn:</Text>
          <ScrollView>
            {selectedItems.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <Text style={styles.cartItemName}>{item.name}</Text>
                <View style={styles.cartItemQuantity}>
                  <TouchableOpacity onPress={() => removeItemFromCart(item)}>
                    <Text style={styles.cartItemQuantityText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.cartItemQuantityText}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity onPress={() => addItemToCart(item)}>
                    <Text style={styles.cartItemQuantityText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
          <Text style={styles.cartTotal}>Tổng tiền: {calculateTotal()}K</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => addOrUpdateBill()}>
              <Text style={styles.buttonText}>Đặt bàn</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                navigation.navigate('Thanh toán.', { id: bill_Id });
              }}>
              <Text style={styles.buttonText}>Thanh toán</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  img: {
    resizeMode: 'cover',
    height: '100%',
  },
  searchContainer: {
    alignItems: 'center',
  },
  searchInput: {
    borderRadius: 10,
    height: 38,
    width: 260,
    paddingHorizontal: 7,
    backgroundColor: '#fff',
    borderColor: '#006FEE',
    borderWidth: 2,
    marginTop: 10,
    marginBottom: 10,
  },
  itemContainer: {
    alignItems: 'center',
  },
  listContent: {
    height: 400,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 45,
    width: 330,
    marginBottom: 5,
  },
  itemName: {
    flex: 1,
    marginLeft: 5,
  },
  itemPrice: {
    fontWeight: 'bold',
    marginRight: 8,
    color: '#000000',
  },
  cartContainer: {
    marginBottom: 20,
    height: 250,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cartItemName: {
    flex: 1,
    color: '#000000',
  },
  cartItemQuantity: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  cartItemQuantityText: {
    paddingHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  cartTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#000000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 10,
    backgroundColor: '#338EF7',
  },
  buttonText: {
    textAlign: 'center',
    color: '#000000',
  },
});
