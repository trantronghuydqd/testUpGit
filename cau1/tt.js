// tt
import React, { createContext, useReducer, useContext, useEffect, useState } from 'react';
import { View, FlatList, StyleSheet, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';

// 1. Init State
const initState = {
  
};

// 2 Action Creators



// 3. Reducer
const productReducer = (state, action) => {
  
};


// 4 api


const lorem = "biểu tượng trái tim màu trắng. Biểu tượng trên thẻ chơi cho trái tim. Thay thế phong cách cho từ tình yêu";
const Stack = createStackNavigator();
const ProductContext = createContext();


const HomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>App</Text>
      
    </View>
  )
}

const Products = ({ navigation }) => {
  const renderItem = ({ item }) => (
    <TouchableOpacity>
    
    </TouchableOpacity>
  );

  return (
    <View>
      
    </View>
  );
};

const AddProduct = ({ navigation }) => {

  return (
    <View >
      
    </View>
  );
};



const ProductDetails = ({ route, navigation }) => {

  return (
    <View>
      
    </View>
  );
};

const CartScreen = ({ navigation }) => {
  
  const renderCartItem = ({ item }) => (
    <View >
     
    </View>
  );

  return (
    <SafeAreaView>
      
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
        </Stack.Navigator>
      </NavigationContainer>
    </ProductContext.Provider>
  );
}

const styles = StyleSheet.create({

});