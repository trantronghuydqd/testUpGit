import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// 1. Init State
const initState = {
  prod
      };
    case "DELETE_PRODUCT":
      return {
        ...state,
        products: state.products.filter(product => product.id !== action.payload)
      };
    case "ADD_TO_CART": {
      // const existingProductIndex = state.cart.findIndex(item => item.id === action.payload.id);
      // if (existingProductIndex >= 0) {
      //   const updatedCart = state.cart.map((item, index) =>
      //     index === existingProductIndex ? { ...item, quantity: item.quantity + 1 } : item
      //   );
      //   return { ...state, cart: updatedCart };
      // }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
    }
    case "UPDATE_CART_ITEM":
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    case "CLEAR_CART":
      return { ...state, cart: [] };
    default:
      return state;
  }
};

// API Functions with Axios
// 4. Dispatch in Async Actions
const fetchProducts = (dispatch) => {
  axios.get('https://671bdbea2c842d92c381892a.mockapi.io/PRODUCTS')
    .then(response => dispatch(fetchProductsSuccess(response.data)));
};

const addProduct = (dispatch, newProduct) => {
  axios.post('https://671bdbea2c842d92c381892a.mockapi.io/PRODUCTS', newProduct)
    .then(response => {
      dispatch(addProductSuccess(response.data));
      // return true;
    });
};


const updateProduct = (dispatch, updatedProduct) => {
  axios.put(`https://671bdbea2c842d92c381892a.mockapi.io/PRODUCTS/${updatedProduct.id}`, updatedProduct)
    .then(response => dispatch(updateProductSuccess(response.data)));
};

const deleteProduct = (dispatch, productId) => {
  axios.delete(`https://671bdbea2c842d92c381892a.mockapi.io/PRODUCTS/${productId}`)
    .then(response => dispatch(deleteProductSuccess(productId)));
};

const lorem = "biểu tượng trái tim màu trắng. Biểu tượng trên thẻ chơi cho trái tim. Thay thế phong cách cho từ tình yêu";
const Stack = createStackNavigator();
const ProductContext = createContext();


const mapImage = (nameProduct) => {
  switch (nameProduct) {
    case "product1": return require('./assets/product1.png');
    case "product2": return require("./assets/product2.png");
    case "product3": return require("./assets/product3.png");
    case "product4": return require('./assets/product4.png');
    case "product5": return require("./assets/product5.png");
    case "product6": return require("./assets/product6.png");
    default: return null;
  }
}

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.welcomeText}>Welcome to my store</Text>
      <Image source={mapImage('product1')} style={styles.homeImage} />
      <TouchableOpacity onPress={() => navigation.navigate('Products')} style={styles.startButton}>
        <Text style={styles.startButtonText}>Get started</Text>
      </TouchableOpacity>
    </View>
  )
}

const Products = ({ navigation }) => {
  const { state, dispatch } = useContext(ProductContext);
  const { products } = state;
  const [cateSelec, setCateSelec] = useState('All');
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
      fetchProducts(dispatch);
  }, []);

  const cates = ['All', ...new Set(products.map(pro => pro.category))];

  const filterCateSelec = products.filter(pro => {
    if (cateSelec === "All") return true;
    return (pro.category === cateSelec);
  });

  const disPlayProducts = showAll ? filterCateSelec : filterCateSelec.slice(0, 4);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productItem}
      onPress={() => navigation.navigate("ProductDetails", { item })}
    >
      <Image style={styles.productImage} source={mapImage(item.name)} />
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
      <TouchableOpacity style={styles.heartIcon}>
        <Text style={styles.heartIconText}>♡</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.productsContainer}>
      <Text style={styles.productsHeader}>Danh sách sản phẩm</Text>
      <View style={styles.categoryContainer}>
        {cates.map(cate => (
          <TouchableOpacity
            key={cate}
            onPress={() => setCateSelec(cate)}
            style={styles.categoryButton}
          >
            <Text>{cate}</Text>
          </TouchableOpacity>
        ))}
        <View>
          <TouchableOpacity onPress={() => setShowAll(true)}>
            <Text>See all</Text>
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={disPlayProducts}
        renderItem={renderItem}
        numColumns={2}
        style={styles.productsList}
        keyExtractor={item => item.id}
      />
      <View style={styles.addProductButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('AddProduct')} style={styles.addProductButton}>
          <Text>Thêm sản phẩm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const AddProduct = ({ navigation }) => {
  const { dispatch } = useContext(ProductContext);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const handleAddProduct = async () => {
    if (!name || !price || !category) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const newProduct = {
      name,
      price: Number(price),
      category,
      image
    };

    addProduct(dispatch, newProduct);
    navigation.goBack();
  };


  return (
    <View style={styles.addProductContainer}>
      <Text style={styles.addProductHeader}>Thêm sản phẩm mới</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Tên sản phẩm:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
          placeholder="VD: product6"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Giá:</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
          placeholder="VD: 20000"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Danh mục:</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          style={styles.input}
          placeholder="VD: Xe hơi"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Tên hình ảnh:</Text>
        <TextInput
          value={image}
          onChangeText={setImage}
          style={styles.input}
          placeholder="VD: product6"
        />
      </View>

      <TouchableOpacity
        onPress={handleAddProduct}
        style={styles.addProductButton}
      >
        <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

const EditProduct = ({ route, navigation }) => {
  const { dispatch } = useContext(ProductContext);
  const { product } = route.params;
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));
  const [category, setCategory] = useState(product.category);
  const [image, setImage] = useState(product.image);

  const handleUpdateProduct = async () => {

    if (!name || !price || !category) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const updatedProduct = {
      id: product.id,
      name,
      price: Number(price),
      category,
      image
    };

    updateProduct(dispatch, updatedProduct)
    alert('Cập nhật sản phẩm thành công!');
    navigation.navigate('Products');

  };

  return (
    <View style={styles.editProductContainer}>
      <Text style={styles.editProductHeader}>Chỉnh sửa sản phẩm</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Tên sản phẩm:</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Giá:</Text>
        <TextInput
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Danh mục:</Text>
        <TextInput
          value={category}
          onChangeText={setCategory}
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Tên hình ảnh:</Text>
        <TextInput
          value={image}
          onChangeText={setImage}
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        onPress={handleUpdateProduct}
        style={styles.updateProductButton}
      >
        <Text style={styles.updateButtonText}>Cập nhật sản phẩm</Text>
      </TouchableOpacity>
    </View>
  );
};

const ProductDetails = ({ route, navigation }) => {

  const { dispatch } = useContext(ProductContext);
  const { item } = route.params;

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigation.navigate('CartScreen');
  };

  const handleDelete = async (productId) => {
    deleteProduct(dispatch, productId)
    alert('Xóa sản phẩm thành công!');
    navigation.navigate('Products');
};

  return (
    <View style={styles.productDetailsContainer}>
      <Image style={styles.productDetailsImage} source={mapImage(item.name)} />
      <Text style={styles.productDetailsName}>{item.name}</Text>
      <Text style={styles.productDetailsDescription}>{lorem}</Text>
      <Text style={styles.productDetailsPrice}>{item.price}</Text>
      <View style={styles.productDetailsActions}>
        <TouchableOpacity>
          <Text style={styles.productDetailsHeart}>♡</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addToCartButton} onPress={() => handleAddToCart(item)}>
          <Text style={styles.addToCartButtonText}>Nhấn để mua</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.editDeleteContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProduct', { product: item })}
          style={styles.editButton}
        >
          <Text>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Xóa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const { state, dispatch } = useContext(ProductContext);
  const { cart } = state;

  const updateQuantity = (itemId, quantity) => {
    dispatch(updateCartItem({ id: itemId, quantity })); // Dispatch action creator
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handlePayment = () => {
    alert("Thanh toán thành công!");
    dispatch(clearCart()); // Dispatch action creator
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={mapImage(item.name)} style={styles.cartItemImage} />
      <View style={styles.cartItemInfo}>
        <Text>{item.name}</Text>
        <Text>$ {item.price}</Text>
      </View>
      <View style={styles.cartItemQuantity}>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity - 1)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{item.quantity}</Text>
        <TouchableOpacity onPress={() => updateQuantity(item.id, item.quantity + 1)} style={styles.quantityButton}>
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.cartContainer}>
      <View style={styles.cartHeader}>
        <Text style={styles.cartHeaderText}>My Basket</Text>
        <View />
      </View>

      <FlatList
        data={cart}
        renderItem={renderCartItem}
        keyExtractor={item => item.id.toString()}
      />

      <View style={styles.cartTotal}>
        <Text style={styles.cartTotalText}>Total:</Text>
        <Text style={styles.cartTotalPrice}>$ {calculateTotal().toFixed(2)}</Text>
        <TouchableOpacity onPress={handlePayment} style={styles.paymentButton}>
          <Text style={styles.paymentButtonText}>Payment</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};







export default function App() {
  const [state, dispatch] = useReducer(productReducer, initState); // Using useReducer here
  return (
    <ProductContext.Provider value={{ state, dispatch }}> {/* Provide value directly */}
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="HomeSrceen" component={HomeScreen} />
          <Stack.Screen name="Products" component={Products} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
          <Stack.Screen name="EditProduct" component={EditProduct} />
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="CartScreen" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductContext.Provider>
  );
}
// ... (styles)

const styles = StyleSheet.create({
  // HomeScreen
  homeContainer: {
    flex: 1,
    margin: 10,
    justifyContent: "center",
    alignItems: "center"
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: "red",
    marginBottom: 50
  },
  homeImage: {
    width: 200,
    height: 200,
    margin: 50
  },
  startButton: {
    color: "white",
    backgroundColor: "black",
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 50,
    fontSize: 20
  },
  startButtonText: {
    color: "white"
  },
  // Products
  productsContainer: {
    flex: 1,
    alignItems: 'center'
  },
  productsHeader: {
    fontWeight: 'bold',
    fontSize: 24,
    marginVertical: 20
  },
  categoryContainer: {
    flexDirection: "row",
    marginBottom: 10
  },
  categoryButton: {
    paddingHorizontal: 20,
    borderRadius: 50,
    borderWidth: 1,
    marginHorizontal: 5
  },
  productsList: {
    marginBottom: 10
  },
  productItem: {
    flex: 1,
    margin: 10,
    backgroundColor: "white",
    padding: 10
  },
  productImage: {
    width: 100,
    height: 100
  },
  heartIcon: {
    position: 'absolute',
    top: 2,
    left: 5
  },
  heartIconText: {
    fontSize: 30
  },
  addProductButtonContainer: {
    marginBottom: 50,
    borderRadius: 50,
    borderWidth: 1,
    padding: 10
  },
  // AddProduct
  addProductContainer: {
    padding: 20,
    alignItems: 'center'
  },
  addProductHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  inputContainer: {
    marginBottom: 15
  },
  inputLabel: {
    marginBottom: 5
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10
  },
  addProductButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 50,
    alignItems: 'center'
  },
  addButtonText: {
    color: 'black'
  },
  // EditProduct
  editProductContainer: {
    padding: 20,
    alignItems: 'center'
  },
  editProductHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20
  },
  updateProductButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 50,
    alignItems: 'center'
  },
  updateButtonText: {
    color: 'black'
  },
  // ProductDetails
  productDetailsContainer: {
    margin: 10
  },
  productDetailsImage: {
    width: 300,
    height: 300,
    marginBottom: 10
  },
  productDetailsName: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10
  },
  productDetailsDescription: {
    fontSize: 20,
    marginBottom: 10
  },
  productDetailsPrice: {
    fontWeight: "bold",
    fontSize: 20,
    marginBottom: 10
  },
  productDetailsActions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: 'space-between'
  },
  productDetailsHeart: {
    fontSize: 30
  },
  addToCartButton: {
    fontWeight: "bold",
    fontSize: 20,
    borderWidth: 1,
    backgroundColor: "black",
    color: "white",
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 5
  },
  addToCartButtonText: {
    color: "white"
  },
  editDeleteContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  editButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'lightgreen'
  },
  deleteButton: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    backgroundColor: 'red'
  },
  deleteButtonText: {
    color: 'white'
  },
  // CartScreen
  cartContainer: {
    flex: 1
  },
  cartHeader: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  cartHeaderText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  cartItemImage: {
    width: 60,
    height: 60,
    marginRight: 10
  },
  cartItemInfo: {
    flex: 1
  },
  cartItemQuantity: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  quantityButton: {
    padding: 8
  },
  quantityButtonText: {
    fontSize: 18
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10
  },
  cartTotal: {
    padding: 20,
    alignItems: 'flex-end'
  },
  cartTotalText: {
    fontSize: 18
  },
  cartTotalPrice: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  paymentButton: {
    marginTop: 10,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5
  },
  paymentButtonText: {
    color: 'white',
    fontWeight: 'bold'
  }
});