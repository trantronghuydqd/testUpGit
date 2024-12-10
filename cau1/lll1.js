//lll1
import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// init state
const initState = {
  products: [],
  cart: []
}

// action
const fetchProductsSS = payload => ({type: "FETCH_PRODUCTS", payload})
const addProductSS = payload => ({type: "ADD_PRODUCT", payload})
const addToCart = payload => ({type: "ADD_TO_CART", payload})
const updateCartItem = payload => ({type: "UPDATE_CART_ITEM", payload})


// reducer
const productReducer = (state, action) => {
  switch (action.type){
    case "FETCH_PRODUCTS": 
      return {...state, products: action.payload}
    case "ADD_PRODUCT": 
      return {...state, products: [...state.products, action.payload]}
    case "ADD_TO_CART": 
      return {...state, cart: [...state.cart, {...action.payload, quantity: 1}]}
    case "UPDATE_CART_ITEM": 
      return {...state, cart: state.cart.map(item => item.id === action.payload.id ? {...item, quantity: action.payload.quantity} : item)}
  }
}
// api

const fetchProducts = (dispatch) => {
  axios.get("https://671bdbea2c842d92c381892a.mockapi.io/PRODUCTS").then(res => dispatch(fetchProductsSS(res.data)))
}
const addProduct = (dispatch, newProduct) => {
  axios.post(`https://671bdbea2c842d92c381892a.mockapi.io/PRODUCTS/`, newProduct).then(res => dispatch(addProductSS(res.data)))
}

const lorem = "biểu tượng trái tim màu trắng. Biểu tượng trên thẻ chơi cho trái tim. Thay thế phong cách cho từ tình yêu";

const Stack = createStackNavigator()
const ProductContext = createContext()

const mapImage = (nameImage) => {
  switch (nameImage){
    case "product1": return require('./assets/product1.png')
    case "product2": return require('./assets/product2.png')
    case "product3": return require('./assets/product3.png')
    case "product4": return require('./assets/product4.png')
    case "product5": return require('./assets/product5.png')
    case "product6": return require('./assets/product6.png')
  }
}

const HomeScreen = ({ navigation }) => {
  return (
    <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
      <Text style = {{fontSize: 24, fontWeight: "bold", color: "red"}}>Welcome to my store</Text>
      <Image source = {mapImage('product1')} style = {{width: 200, height: 200, margin: 50}}></Image>
      <TouchableOpacity onPress = {() => navigation.navigate('Products')} style = {{ backgroundColor: "black", borderRadius: 50, padding: 20}}><Text style = {{color: "white"}}>Get Started</Text></TouchableOpacity>
    </View>
  )
}

const Products = ({ navigation }) => {
  const {state, dispatch} = useContext(ProductContext)
  const {products} = state
  const [cateSelec, setCateSelec] = useState("All")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    fetchProducts(dispatch)
  },[])

  const cates = ["All", ...new Set(products.map(pro => pro.category))]

  const filterCateSelec = products.filter(pro => {
    if (cateSelec === "All") return true;
    return (pro.category === cateSelec)
  })

  const disPlayProducts = showAll? filterCateSelec : filterCateSelec.slice(0, 4)

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress = {()=> navigation.navigate('ProductDetails', {item})} style ={{flex: 1, backgroundColor: "white", padding: 20, margin: 5, alignItems: "center"}}>
     
      <Image source = {mapImage(item.name)} style = {{width: 100, height: 100}}></Image>
       <Text>{item.name}</Text>
      <Text>{item.price}</Text>
      <Text style= {{position: "absolute", top: 4, left: 5, fontSize: 24}}>♡	</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{flex: 1, alignItems: "center"}}>
      <Text style = {{fontSize: 24, fontWeight: "Bold"}}>Danh sách sản phẩm</Text>
      <View style = {{flexDirection: "row"}}>
      {cates.map(cate => (
        <TouchableOpacity onPress = {() => setCateSelec(cate)} style = {{borderRadius: 50, marginHorizontal: 5}}><Text>{cate}</Text></TouchableOpacity>
      ))}
       <TouchableOpacity onPress = {() => setShowAll(true)}><Text>Show All</Text></TouchableOpacity>
      </View>

       <FlatList data = {disPlayProducts} renderItem = {renderItem} numColumns = {2} keyExtractor = {item => item.id}></FlatList>
       <TouchableOpacity onPress = {() => navigation.navigate('AddProduct')} style = {{borderWidth: 1, padding: 20, borderRadius: 50}}><Text>Thêm sản phẩm</Text></TouchableOpacity>
    </View>
  );
};

const AddProduct = ({ navigation }) => {
  const {dispatch} = useContext(ProductContext)
  const [name,setName] = useState('product5')
  const [price,setPrice] = useState('50')
  const [category,setcategory] = useState('xe dap')
  const [image,setImage] = useState('product5')
  
  const handleAddProduct = () => {
    if (!name || !price || !category || !image){
      alert("Vui lòng điền đủ tt")
      return false
    }

    const newProduct = {
      name, price: Number(price), category, image
    } 

    addProduct(dispatch, newProduct)
    navigation.goBack()
  }

  return (
    <View style = {{flex: 1, justifyContent: "space-evenly", alignItems: "center"}}>
        <Text style = {{fontSize: 24, fontWeight: "Blod"}}>Thêm sản phẩm</Text>
        <View>
        <View><Text>Tên sản phẩm</Text><TextInput style = {{borderWidth: 1, padding: 10, borderRadius: 5}} value = {name} onChangeText = {setName} placeholder = "product6"></TextInput></View>
        <View><Text>Giá</Text><TextInput style = {{borderWidth: 1, padding: 10, borderRadius: 5}} value = {price} onChangeText = {setPrice} placeholder = "20"></TextInput></View>
        <View><Text>Danh mục</Text><TextInput style = {{borderWidth: 1, padding: 10, borderRadius: 5}} value = {category} onChangeText = {setcategory} placeholder = "xe hoi"></TextInput></View>
        <View><Text>Hình ảnh</Text><TextInput style = {{borderWidth: 1, padding: 10, borderRadius: 5}} value = {image} onChangeText = {setImage} placeholder = "product6"></TextInput></View>
        </View>
        <View><TouchableOpacity style = {{borderWidth: 1, padding: 10}} onPress = {handleAddProduct}><Text>Thêm sản phẩm</Text></TouchableOpacity></View>
    </View>
  );
};



const ProductDetails = ({ route, navigation }) => {

  const {dispatch } = useContext(ProductContext)
  const {item} = route.params
  const handleAddToCart = (product) => {
    dispatch(addToCart(product))
    navigation.navigate("CartScreen")
  }


  return (
    <View style={{flex: 1, justifyContent: "center", alignItems: "center"}} >
    <Image style = {{width: 400, height: 400}} source = {mapImage(item.name)}></Image>
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>

    <TouchableOpacity style = {{borderWidth: 1, padding: 10}} onPress = {() => handleAddToCart(item)}><Text>Thêm vào giỏ hàng</Text></TouchableOpacity>
    
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  const {state, dispatch} = useContext(ProductContext)
  const {cart} = state

  const handleUpdateQuantity = (itemId, quantity) => {
    dispatch(updateCartItem({id: itemId, quantity}))
  }
  const caculator = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const renderCartItem = ({ item }) => (
    <View style={{flexDirection: "row", justifyContent: "space-between", padding: 10, marginVertical: 10, backgroundColor: "white"}} >
    <Image source = {mapImage(item.name)} style = {{width: 50, height: 50}}></Image>
      <Text>{item.name}</Text>
      <Text>{item.price}</Text>
      <TouchableOpacity onPress = {()=>handleUpdateQuantity(item.id, item.quantity - 1)}><Text>-</Text></TouchableOpacity>
      <Text>{item.quantity}</Text>
      <TouchableOpacity onPress = {()=>handleUpdateQuantity(item.id, item.quantity + 1)}><Text>+</Text></TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <FlatList data = {cart} renderItem = {renderCartItem}></FlatList>
      <Text style = {{fontSize: 24, fontWeight: "Bold"}}>Total</Text>
      <Text style = {{fontSize: 24, fontWeight: "Bold"}}>${caculator().toFixed(2)}</Text>
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
          <Stack.Screen name="ProductDetails" component={ProductDetails} />
          <Stack.Screen name="CartScreen" component={CartScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ProductContext.Provider>
  );
}
// ... (styles)

const styles = StyleSheet.create({
  
});