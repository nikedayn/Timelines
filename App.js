import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';

// Наші екрани
import MainScreen from './src/screens/MainScreen';
import AddEventScreen from './src/screens/AddEventScreen';
import EventDetailScreen from './src/screens/EventDetailScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <PaperProvider theme={MD3LightTheme}>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Main"
          screenOptions={{
            headerShown: false, // Ми використовуємо Appbar з React Native Paper
          }}
        >
          <Stack.Screen name="Main" component={MainScreen} />
          <Stack.Screen name="AddEvent" component={AddEventScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}