import React, {useEffect} from 'react';
import {Dimensions} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import ApplyScreen from './screens/ApplyScreen';
import ViewScreen from './screens/ViewScreen';
import ViewScreenDetails from './screens/ViewScreenDetails';
import ViewScreenActionDetails from './screens/ViewScreenActionDetails';
import DateScreen from './screens/DateScreen';

const {width, height} = Dimensions.get('window');
const Stack = createNativeStackNavigator();
const App = () => {
  global.url = 'https://mobiledts.bacolodcity.gov.ph/android'
  const commonScreens = {
   
    LoginScreen: LoginScreen,
    HomeScreen: HomeScreen,
    ApplyScreen: ApplyScreen,
    ViewScreen: ViewScreen,
    ViewScreenDetails:ViewScreenDetails,
    ViewScreenActionDetails:ViewScreenActionDetails,
    DateScreen: DateScreen,
  };
  return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
        {Object.entries({
        ...(commonScreens),
          }).map(([name, component]) => (
            <Stack.Screen
              key={name}
              name={name}
              component={component}
              options={{headerShown: false}}
            />
          ))}
        
        </Stack.Navigator>
      </NavigationContainer>
    
  );
};

export default App;
