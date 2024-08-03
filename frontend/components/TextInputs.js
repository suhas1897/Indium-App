import React, { useState } from 'react';
import { TextInput, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import FontSize from '../constants/FontSize';
import Font from '../constants/Font';
import Spacing from '../constants/Spacing';

const CustomTextInput = ({ ...otherProps }) => {
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={[
        styles.input,
        focused && styles.focusedInput,
      ]}
      {...otherProps}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    fontFamily: Font["poppins-regular"],
    fontSize: FontSize.medium,
    padding: Spacing * 2,
    backgroundColor: Colors.lightPrimary,
    borderRadius: Spacing,
    marginVertical: Spacing,
  },
  focusedInput: {
    borderWidth: 3,
    borderColor: Colors.primary,
    shadowOffset: { width: 4, height: Spacing },
    shadowColor: Colors.primary,
    shadowOpacity: 0.2,
    shadowRadius: Spacing,
  },
});

export default CustomTextInput;
