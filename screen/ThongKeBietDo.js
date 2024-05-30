import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Dimensions } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown'; // Thư viện Dropdown
import { LineChart } from 'react-native-chart-kit'; // Thư viện LineChart

// Dữ liệu các năm cho dropdown
const dataNam = [
  { label: '2023', value: '2023' },
  { label: '2024', value: '2024' },
  { label: '2025', value: '2025' },
  { label: '2026', value: '2026' },
  { label: '2027', value: '2027' },
  { label: '2028', value: '2028' },
  { label: '2029', value: '2029' },
  { label: '2030', value: '2030' },
];

// Hàm chuyển đổi chuỗi ngày tháng sang đối tượng Date
const parseDate = (dateStr) => {
  const [timePart, datePart] = dateStr.split(' ');
  const [day, month, year] = datePart.split('/');
  return new Date(`${year}-${month}-${day}T${timePart}`);
};

// Thành phần chính của ứng dụng
const DropdownComponent = () => {
  const [nam, setNam] = useState('2023'); // Trạng thái cho năm được chọn
  const [dataThang, setDataThang] = useState(Array(12).fill(0)); // Trạng thái cho dữ liệu thống kê hàng tháng

  // Hàm gọi api về để lấy dữ liệu hóa đơn
  const layDuLieuHoaDon = useCallback(async () => {
    const dataThangTemp = Array(12).fill(0);
    try {
      // Lấy dữ liệu hóa đơn từ mock API
      const responseBills = await fetch('https://663653b5415f4e1a5e27083f.mockapi.io/bill');
      const billsData = await responseBills.json();
      console.log('Bills data:', billsData);

      // Lọc các hóa đơn theo năm được chọn
      const filteredBills = billsData.filter(item => item.time && parseDate(item.time).getFullYear() === parseInt(nam));
      console.log('Filtered bills:', filteredBills);

      // Lấy chi tiết hóa đơn từ mock API
      const billDetailsPromises = filteredBills.map(async (bill) => {
        const responseDetails = await fetch(`https://663653b5415f4e1a5e27083f.mockapi.io/detai_bill`);
        const billDetails = await responseDetails.json();
        const detailsWithTime = billDetails.filter(e => e.id_bill === bill.id).map(detail => ({ ...detail, time: bill.time }));
        return detailsWithTime;
      });

      const billDetails = await Promise.all(billDetailsPromises);
      const allBillDetails = billDetails.flat();
      console.log('All bill details:', allBillDetails);

      // Lấy thông tin sản phẩm từ mock API
      const productDetailsPromises = allBillDetails.map(async (detail) => {
        const responseProduct = await fetch(`https://66388d184253a866a24e340d.mockapi.io/product/${detail.id_product}`);
        const productData = await responseProduct.json();
        return {
          ...detail,
          price: parseFloat(productData.price),
        };
      });

      const detailedProducts = await Promise.all(productDetailsPromises);
      console.log('Detailed products:', detailedProducts);

      // Tính toán dữ liệu thống kê hàng tháng
      detailedProducts.forEach(item => {
        if (item.time) {
          const monthIndex = parseDate(item.time).getMonth();
          dataThangTemp[monthIndex] += item.price * item.quantity;
        }
      });

      // Cập nhật dữ liệu thống kê
      console.log('Data by month:', dataThangTemp);
      setDataThang(dataThangTemp);
    } catch (error) {
      console.error('Lỗi lấy dữ liệu:', error);
    }
  }, [nam]);

  useEffect(() => {
    layDuLieuHoaDon(); // Gọi hàm lấy dữ liệu hóa đơn khi năm được chọn thay đổi
  }, [nam, layDuLieuHoaDon]);

  // Hàm render một mục trong dropdown
  const renderItem = (item) => (
    <View style={styles.item}>
      <Text style={styles.textItem}>{item.label}</Text>
    </View>
  );

  return (
    <View>
      {/* Dropdown cho phép chọn năm */}
      <View style={styles.chonNgay}>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={dataNam}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Chọn năm"
          value={nam}
          onChange={(item) => setNam(item.value)}
          renderItem={renderItem}
        />
      </View>
      <View>
        {/* Hiển thị tiêu đề thống kê năm */}
        <Text style={styles.title}>Thống kê năm {nam}</Text>
        
        {/* LineChart để hiển thị biểu đồ */}
        <LineChart
          data={{
            labels:[
              '1', '2', '3', '4',
              '5', '6', '7', '8',
              '9', '10', '11', '12',
            ],
            datasets: [
              {
                data: dataThang,
              },
            ],
          }}
          width={Dimensions.get('window').width - 16}
          height={500}
          yAxisLabel=" T "
          yAxisSuffix="k"
          yAxisInterval={1}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: 'lightblue',
            backgroundGradientTo: 'pink',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
            marginHorizontal: 8,
          }}
        />
      </View>
    </View>
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    width: 120,
    elevation: 2,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  title:{
    marginLeft:'2%',
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  chonNgay: {
    flexDirection: 'row',
  },
});
