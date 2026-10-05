import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert, Image } from 'react-native';

// 1. Menerapkan Type & Interface
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

// Memperluas interface Product untuk item keranjang yang memiliki jumlah (quantity)
interface CartItem extends Product {
  quantity: number;
}

// 2. Menerapkan Array of Objects
const products: Product[] = [
  { id: 1, name: 'Kopi Hitam', price: 5000, image: 'https://picsum.photos/100?random=1' },
  { id: 2, name: 'Es Teh Manis', price: 4000, image: 'https://picsum.photos/100?random=2' },
  { id: 3, name: 'Mie Goreng Telur', price: 12000, image: 'https://picsum.photos/100?random=3' },
  { id: 4, name: 'Nasi Goreng', price: 15000, image: 'https://picsum.photos/100?random=4' },
];

export default function WarungPOS() {
  // State untuk menyimpan daftar barang di keranjang
  // Konsep ini menggunakan React Hooks (useState) untuk melacak perubahan data secara real-time
  const [cart, setCart] = useState<CartItem[]>([]);

  // 3. Menerapkan Custom Function (Tambah ke keranjang)
  const handleBuy = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        // Jika sudah ada di keranjang, tambah jumlahnya (quantity + 1)
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      // Jika belum ada, masukkan sebagai barang baru dengan quantity 1
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Custom Function untuk mengurangi barang dari keranjang
  const handleRemove = (productId: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (existingItem && existingItem.quantity > 1) {
        // Jika jumlahnya lebih dari 1, kurangi jumlahnya
        return prevCart.map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      // Jika jumlahnya sisa 1, hapus dari keranjang (filter menghilangkan item tersebut)
      return prevCart.filter((item) => item.id !== productId);
    });
  };

  // Menghitung total harga dan total item menggunakan perulangan/reduksi pada array keranjang
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  // Custom Function untuk menangani proses pembayaran
  const handleCheckout = () => {
    if (cart.length === 0) {
      Alert.alert("Keranjang Kosong", "Silakan pilih menu terlebih dahulu.");
      return;
    }
    Alert.alert(
      "Pembayaran Berhasil", 
      `Total yang dibayar: Rp${totalPrice.toLocaleString('id-ID')}\n\nTerima kasih telah berbelanja!`,
      [{ text: "OK", onPress: () => setCart([]) }] // Kosongkan keranjang setelah bayar
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* Bagian Menu (Kiri/Atas) */}
      <ScrollView style={styles.container}>
        <Text style={styles.headerTitle}>Menu WarungPOS</Text>

        <View style={styles.productList}>
          {/* 4. Menerapkan Loop dengan .map() untuk Menu */}
          {products.map((item) => (
            // Menerapkan key yang unik pada setiap iterasi
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              
              <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.name}</Text>
                {/* Menerapkan Inline Style */}
                <Text style={{ color: '#27ae60', fontWeight: 'bold', fontSize: 16 }}>
                  Rp {item.price.toLocaleString('id-ID')}
                </Text>
              </View>

              <Pressable 
                style={styles.button}
                onPress={() => handleBuy(item)}
              >
                <Text style={styles.buttonText}>+ Tambah</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <View style={{ height: 100 }} /> {/* Padding bawah agar konten tidak tertutup UI keranjang */}
      </ScrollView>

      {/* Bagian UI Keranjang (Menempel di Bawah) */}
      <View style={styles.cartContainer}>
        <Text style={styles.cartTitle}>Keranjang ({totalItems} item)</Text>
        
        {/* Kondisi jika keranjang kosong */}
        {cart.length === 0 ? (
          <Text style={styles.emptyCartText}>Belum ada pesanan</Text>
        ) : (
          <ScrollView style={styles.cartList}>
            {/* 4. Menerapkan Loop dengan .map() untuk Keranjang */}
            {cart.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <Text style={styles.cartItemPrice}>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</Text>
                </View>
                
                {/* Tombol Plus dan Minus untuk kontrol pesanan */}
                <View style={styles.quantityControl}>
                  <Pressable style={styles.qtyBtn} onPress={() => handleRemove(item.id)}>
                    <Text style={styles.qtyBtnText}>-</Text>
                  </Pressable>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <Pressable style={styles.qtyBtn} onPress={() => handleBuy(item)}>
                    <Text style={styles.qtyBtnText}>+</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        )}

        {/* Bagian Total Harga dan Tombol Checkout */}
        <View style={styles.checkoutSection}>
          <View>
            <Text style={styles.totalText}>Total Pembayaran:</Text>
            <Text style={styles.totalPrice}>Rp {totalPrice.toLocaleString('id-ID')}</Text>
          </View>
          <Pressable 
            // Jika keranjang kosong, ubah warna tombol menjadi abu-abu
            style={[styles.checkoutBtn, cart.length === 0 && { backgroundColor: '#bdc3c7' }]} 
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutBtnText}>Bayar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// 5. Menerapkan External Styling menggunakan StyleSheet.create()
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2f3640',
  },
  productList: {
    gap: 12, 
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row', 
    alignItems: 'center',
    elevation: 3, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  productInfo: {
    flex: 1, 
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#353b48',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  
  // ----- STYLES KHUSUS UNTUK KERANJANG -----
  cartContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    maxHeight: '40%', // Maksimal keranjang memakan 40% layar bagian bawah
  },
  cartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2f3640',
    marginBottom: 12,
  },
  emptyCartText: {
    textAlign: 'center',
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginBottom: 16,
  },
  cartList: {
    marginBottom: 12,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cartItemName: {
    fontSize: 16,
    color: '#353b48',
  },
  cartItemPrice: {
    fontSize: 14,
    color: '#27ae60',
    fontWeight: 'bold',
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
  },
  qtyBtnText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  qtyText: {
    marginHorizontal: 12,
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 12,
  },
  totalText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  totalPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  checkoutBtn: {
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  checkoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
