import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import {ToastAndroid} from 'react-native';

export default function App() {
  const [tableId, setTableId] = useState('');
  const [tableName, setTableName] = useState('');
  const [tableCondition, setTableCondition] = useState('on');
  const [tableList, setTableList] = useState([]);
  const [allowInput, setAllowInput] = useState(false);

  useEffect(() => {
    fetchTable();
  }, []);

  // Lấy danh sách bàn từ API
  const fetchTable = async () => {
    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/table'
      );
      const data = await response.json();
      setTableList(data);
    } catch (error) {
      console.error('Lỗi khi tìm nạp danh sách bàn:', error);
    }
  };

  // Thêm bàn mới
  const addTable = async () => {
    const newTable = {
      id_bill: '',
      name: 'Bàn ' + (tableList.length + 1),
    };

    try {
      const response = await fetch(
        'https://647afa13d2e5b6101db0b2c3.mockapi.io/table',
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
        setTableId('');
        setTableName('');
        ToastAndroid.show(`Đã thêm ${createdTable.name} vào danh sách ✅`, ToastAndroid.SHORT);
      } else {
        console.error('Lỗi khi thêm bàn:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi thêm bàn:', error);
    }
  };

  // Xử lý cập nhật thông tin bàn
  const updateTable = async () => {
    if (tableName !== '' && tableCondition !== '') {
      const updatedTable = {
        name: tableName,
        condition: tableCondition,
      };

      try {
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
          const updatedTableList = tableList.map((table) => {
            if (table.id === parseInt(tableId)) {
              return {
                id: table.id,
                name: tableName,
                condition: tableCondition,
              };
            }
            fetchTable();
            return table;
          });
          setTableList(updatedTableList);
          setTableId('');
          setTableName('');
          setTableCondition('');
          ToastAndroid.show('Đã cập nhật bàn thành công ✅', ToastAndroid.SHORT);
          // Reload lại trang
        } else {
          // Xử lý lỗi khi cập nhật không thành công
          console.error('Lỗi khi cập nhật bàn:', response.status);
        }
      } catch (error) {
        console.error('Lỗi khi cập nhật bàn:', error);
      }
    } else {
      ToastAndroid.show('Hãy chọn bàn để chỉnh sửa 🛠', ToastAndroid.SHORT);
      console.error('Vui lòng nhập tên bàn và tình trạng bàn.');
    }
  };

  // Xử lý xóa bàn
  const deleteTable = async () => {
    try {
      const response = await fetch(
        `https://647afa13d2e5b6101db0b2c3.mockapi.io/table/${tableId}`,
        {
          method: 'DELETE',
        }
      );

      if (response.ok) {
        await fetchTable();
        setTableId('');
        setTableName('');
        setTableCondition('');
        ToastAndroid.show(`Đã xóa ${tableName} khỏi danh sách ❌`, ToastAndroid.SHORT);
        console.log('Bàn đã được xóa thành công.');
        // Reload lại trang
      } else {
        ToastAndroid.show(`Hãy chọn bàn để xóa ⚠️`, ToastAndroid.SHORT);
        console.error('Lỗi khi xóa bàn:', response.status);
      }
    } catch (error) {
      console.error('Lỗi khi xóa bàn:', error);
    }
  };

  // Xử lý chỉnh sửa bàn
  const handleEdit = (table) => {
    setTableId(table.id.toString());
    setTableName(table.name);
    setTableCondition(table.condition);
  };

  return (
    <View style={styles.viewcontent}>
      <View style={styles.container}>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Tên bàn:</Text>
          <TextInput
            style={styles.input}
            onChangeText={(text) => setTableName(text)}
            value={tableName}
            placeholder="Tên bàn"
            placeholderTextColor="rgba(0,111,238,0.4)"
            editable={allowInput} // Sử dụng editable để kiểm soát tính năng chỉnh sửa
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'blue' }]}
              onPress={addTable}>
              <Text style={styles.buttonText}>Thêm</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'green' }]}
              onPress={updateTable}>
              <Text style={styles.buttonText}>Sửa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: 'red' }]}
              onPress={deleteTable}>
              <Text style={styles.buttonText}>Xóa</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.tableList}>
          <Text style={styles.tableListTitle}>Danh sách bàn:</Text>
          <FlatList
            data={tableList}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.tableItemContainer}
                onPress={() => {
                  handleEdit(item);
                  setAllowInput(true); // Khi chọn một mục từ danh sách bàn, cho phép nhập liệu
                }}>
                <Image source={require('../assets/table.png')} />
                <Text style={styles.tableItemText}>{item.name}</Text>
                <View style={styles.groupState}>
                  <Text style={styles.tableItemText}>
                    Trạng thái: {item.condition}
                  </Text>
                  {item.id_bill === '' ? (
                    <View style={styles.greenBox} />
                  ) : (
                    <View style={styles.redBox} />
                  )}
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  formContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    width: 320,
    borderWidth: 2,
    borderColor: '#006FEE',
    marginBottom: 16,
    borderRadius: 10,
    paddingHorizontal: 8,
    backgroundColor: '#E6F1FE',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 8,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  tableList: {
    flex: 1,
  },
  tableListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tableItemContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    borderWidth: 2,
    margin: 2,
    borderRadius: 10,
    borderColor: '#006FEE',
    backgroundColor: '#E6F1FE',
    alignItems: 'center',
  },
  tableItemText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
  groupState: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    marginLeft: 180,
  },
  viewcontent: {
    flex: 1,
    resizeMode: 'cover',
    backgroundColor: '#fff',
    borderTopWidth: 1,
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
