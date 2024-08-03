import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  DashboardScreen: undefined;
  FeedBack: undefined;
  Calander: undefined; // corrected 'undefined' spelling
  Profile: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, Screen>;
