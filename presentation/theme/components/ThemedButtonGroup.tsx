import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  options: string[];
  selectedOptions: string[];

  onSelect: (option: string) => void;
}

const ThemedButtonGroup = ({ options, selectedOptions, onSelect }: Props) => {
  return (
    <View style={styles.container}>
      {
        options.map((option) => (
          <TouchableOpacity
            onPress={() => onSelect(option)}
            key={option}
            style={[styles.button, selectedOptions.includes(option) && {
              backgroundColor: 'blue',
            }
            ]}
          >
            <Text
              adjustsFontSizeToFit
              numberOfLines={1}
              style={[
                styles.buttonText,
                selectedOptions.includes(option) && styles.selectedButtonText,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    flex: 1,
  },
  selectedButtonText: {
    color: 'white',
  }

})

export default ThemedButtonGroup;