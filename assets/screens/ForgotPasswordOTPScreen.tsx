import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import PhoneInput, { isValidNumber } from 'react-native-phone-number-input';
import { sendVerification } from '../../api/verify';
import { navigationType } from '../../types';
import { updateNotification } from '../../utils/helper';
import AnimatedAlert from '../components/AnimatedAlert';
import colors from '../../theme/colors';
import { WIDTH } from '../../constants/dimensions';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button: {
    marginTop: 20,
    height: 50,
    width: 300,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.buttons
  },
  buttonText: {
    color: colors.black,
    fontSize: 14
  },
  error: {
    alignItems: 'center',
    bottom: 20,
    width: WIDTH / 2
  }
});

function ForgotPasswordOTPScreen({ navigation }: navigationType) {
  const [value, setValue] = useState('');
  const [formattedValue, setFormattedValue] = useState('');
  const [message, setMessage] = useState({
    //TODO: Implement utilzing Redux.
    text: '',
    type: ''
  });

  const handleOTP = async (formattedValue: any) => {
    try {
      if (!isValidNumber(formattedValue, 'US'))
        return updateNotification(setMessage, 'Invalid Number');
      const res = await sendVerification(formattedValue);
      if (!res) return console.log('error');

      navigation.navigate('Verification', { phoneNumber: formattedValue });
      navigation.reset({
        //TODO: This is bad practice. We need to find a way to turn off gestures in this screen, aswell as implementing network aborts with redux-thunk.
        index: 0,
        routes: [{ name: 'Tabs' }]
      });
    } catch (error) {
      console.log(error); //TODO: Implement proper exception handling.
    }
  };
  //TODO: Integrate with custom formik component.
  return (
    <View style={styles.container}>
      {message.text ? (
        <AnimatedAlert style={styles.error} type={message.type} text={message.text} />
      ) : null}
      <PhoneInput
        defaultValue={value}
        defaultCode="US"
        layout="second"
        onChangeText={(text) => {
          setValue(text);
        }}
        onChangeFormattedText={(text) => {
          setFormattedValue(text);
        }}
        countryPickerProps={{ withAlphaFilter: true }}
        withShadow
        autoFocus
      />
      <TouchableOpacity style={styles.button} onPress={() => handleOTP(formattedValue)}>
        <Text style={styles.buttonText}>Send Code</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ForgotPasswordOTPScreen;
