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


// import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
// import Toast, {BaseToast, ErrorToast} from 'react-native-toast-message';

const {width, height} = Dimensions.get('window');
// const Stack = createNativeStackNavigator();
// const queryClient = new QueryClient();
// const toastConfig = {
//   success: props => (
//     <BaseToast
//       {...props}
//       style={{
//         borderLeftColor: 'green',
//         height: 75,
//         backgroundColor: '#e6fced',
//         width: width * 0.95,
//       }}
//       contentContainerStyle={{paddingHorizontal: 10}}
//       text1Style={{
//         fontSize: 15,
//         fontWeight: 'bold',
//       }}
//       text2NumberOfLines={2}
//       text2Style={{
//         color: '#000',
//         fontSize: 12,
//       }}
//     />
//   ),
//   error: props => (
//     <ErrorToast
//       {...props}
//       style={{
//         borderLeftColor: 'red',
//         height: 75,
//         backgroundColor: '#fce6e6',
//         width: width * 0.95,
//       }}
//       contentContainerStyle={{paddingHorizontal: 10}}
//       text1Style={{
//         fontSize: 15,
//         fontWeight: 'bold',
//       }}
//       text2NumberOfLines={2}
//       text2Style={{
//         color: '#000',
//         fontSize: 12,
//       }}
//     />
//   ),
// };
const Stack = createNativeStackNavigator();
const App = () => {
  global.url = 'https://mobiledts.bacolodcity.gov.ph/android'
  const commonScreens = {
    HomeScreen: HomeScreen,
    LoginScreen: LoginScreen,
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
