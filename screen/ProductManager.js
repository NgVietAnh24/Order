import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import {ToastAndroid} from 'react-native';

export default function App() {
  const [id, changeID] = useState('');
  const [name, changeName] = useState('');
  const [price, changePrice] = useState('');
  const [tableList, setTableList] = useState([]);

  useEffect(() => {
    fetchTable();
  }, []);

  const Click = (item) => {
    changeID(item.id);
    changeName(item.name);
    changePrice(item.price);
  };

  const fetchTable = async () => {
    try {
      const response = await fetch(
        'https://66388d184253a866a24e340d.mockapi.io/product'
      );
      const data = await response.json();
      setTableList(data);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách món ăn:', error);
    }
  };

  const addTable = async () => {
    if(!name || !price){
      ToastAndroid.show('Hãy điền đầy đủ các trường ❌🚫', ToastAndroid.SHORT);
      return;
    }
    const newTable = {
      name: name,
      price: price,
    };

    try {
      const response = await fetch(
        'https://66388d184253a866a24e340d.mockapi.io/product',
        {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newTable),
        }
      );

      if (response.ok) {
        const createdTable = await response.json();
        setTableList([...tableList, createdTable]);
        changeID('');
        changeName('');
        changePrice('');
        fetchTable();
      } else {
        console.error('Lỗi khi thêm món ăn:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi thêm món ăn:', error);
    }
  };

  const updateTable = async () => {
    if (name !== '' && price !== '') {
      const updatedTable = {
        name: name,
        price: price,
      };

      try {
        const response = await fetch(
          `https://66388d184253a866a24e340d.mockapi.io/product/${id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTable),
          }
        );

        if (response.ok) {
          const updatedTableList = tableList.map((table) => {
            if (table.id === parseInt(id)) {
              return {
                id: table.id,
                name: name,
                price: price,
              };
            }
            return table;
          });
          setTableList(updatedTableList);
          changeID('');
          changeName('');
          changePrice('');
          fetchTable();
        } else {
          console.error('Lỗi khi cập nhật món ăn:', response.status);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật món ăn:', error);
      }
    } else {
      ToastAndroid.show('Chọn món ăn để chỉnh sửa 🛠', ToastAndroid.SHORT);
      console.error('Vui lòng nhập tên món ăn và giá.');
    }
  };

  const deleteTable = async () => {
    try {
      const response = await fetch(
        `https://66388d184253a866a24e340d.mockapi.io/product/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        await fetchTable();
        changeID('');
        changeName('');
        changePrice('');
        fetchTable();
        ToastAndroid.show('Xóa món ăn thành công 👍👌', ToastAndroid.SHORT);
        console.log('món ăn đã được xóa thành công.');
      } else {
        ToastAndroid.show('Hãy chọn món cần xóa 👎👎👎', ToastAndroid.SHORT);
        console.error('Lỗi khi xóa món ăn:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi xóa món ăn:', error);
    }
  };

  return (
    <ImageBackground
      source={require('../assets/background_food.png')}
      style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={{ alignItems: 'center' }}>
          <Text style={styles.sectionTitle}>Danh sách đồ ăn, uống</Text>
        </View>
        <FlatList
          style={styles.tableList}
          data={tableList}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.tableItem,
                id === item.id ? styles.selectedTableItem : null,
              ]}
              onPress={() => Click(item)}>
              <Text style={styles.tableItemText}>{item.name}</Text>
              <Text style={styles.tableItemText}>{item.price}K</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
        />
        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Tên món ăn"
            placeholderTextColor="rgba(0,111,238,0.5)"
            onChangeText={changeName}
            value={name}
          />
          <TextInput
            style={styles.input}
            placeholder="Giá"
            placeholderTextColor="rgba(0,111,238,0.5)"
            onChangeText={changePrice}
            value={price}
          />
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, styles.addButton]}
              onPress={addTable}>
              <Text style={styles.buttonText}>Thêm</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={updateTable}>
              <Text style={styles.buttonText}>Cập nhật</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={deleteTable}>
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    backgroundColor: 'rgba(217,217,217,0.4)',
    textAlign: 'center',
    color: '#fff',
    borderColor: 'rgba(41,45,50,0.5)',
    borderWidth: 2,
    width: 228,
    height: 27,
    borderRadius: 5,
    shadowColor: 'white',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
  },
  tableList: {
    flex: 1,
    marginBottom: 16,
  },
  tableItem: {
    padding: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedTableItem: {
    backgroundColor: '#8ED1C6',
  },
  tableItemText: {
    fontSize: 16,
  },
  form: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 10,
  },
  input: {
    marginBottom: 8,
    padding: 8,
    borderRadius: 8,
    borderColor: '#006FEE',
    borderWidth: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    shadowColor: 'primary',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  addButton: {
    backgroundColor: '#338EF7',
  },
  updateButton: {
    backgroundColor: '#60DF5D',
  },
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});
