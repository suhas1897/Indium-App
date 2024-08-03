import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Colors from "../constants/Colors";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import DashboardScreen from "../screens/(auth)/DashboardScreen";
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import VerifyOTPScreen from '../screens/VerifyOTPScreen';
import FeedBack from "../screens/(auth)/FeedBack";
import Calendar from "../screens/(auth)/CalendarScreen";
import ImageColorPicker from "../components/ImageColorPicker";
import Maps from "../screens/(auth)/Maps";
import ProfileScreen from "../screens/(auth)/ProfileScreen";
//import VerifyOTPScreen from "../screens/VerifyOTPScreen";
// import AddPhoto from "../components/AddPhoto";

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.background,
  },
};

export default function Navigation() {
  return (
    <NavigationContainer theme={theme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

const Stack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="DashboardScreen" component={DashboardScreen} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} />
      <Stack.Screen name="VerifyOTPScreen" component={VerifyOTPScreen} />
      
      <Stack.Screen name="FeedBack" component={FeedBack} />
      {/* <Stack.Screen name="AddPhoto" component={AddPhoto} /> */}
      <Stack.Screen name="calendar" component={Calendar} />
      <Stack.Screen name= "ImageColorPicker" component={ImageColorPicker} />
      <Stack.Screen name="Maps" component={Maps} />
      <Stack.Screen name = "Profile" component={ProfileScreen} />

    </Stack.Navigator>
  );
}
