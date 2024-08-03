import React, { useState } from "react";
import { StyleSheet, TextInput } from "react-native";
import Colors from "../constants/Colors";
import Font from "../constants/Font";
import FontSize from "../constants/FontSize";
import Spacing from "../constants/Spacing";

const AppTextInput = ({ style, ...otherProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        {
          fontFamily: Font["poppins-regular"],
          fontSize: FontSize.small,
          padding: Spacing * 2,
          backgroundColor: Colors.lightPrimary,
          borderRadius: Spacing,
          marginVertical: Spacing,
          color: Colors.darkText,
        },
        focused && {
          borderWidth: 3,
          borderColor: Colors.primary,
          shadowOffset: { width: 4, height: Spacing },
          shadowColor: Colors.primary,
          shadowOpacity: 0.2,
          shadowRadius: Spacing,
        },
        style,
      ]}
      placeholderTextColor="#000000" // Placeholder text color set to black
      {...otherProps}
    />
  );
};

export default AppTextInput;

const styles = StyleSheet.create({});
