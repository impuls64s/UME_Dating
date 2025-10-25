import { StyleSheet, Text, TouchableOpacity } from 'react-native';


type Props = {
  text: string;
  backgroundColor?: string;
  handleOnPress: () => void;
};


export default function BasicButton({ text, backgroundColor = '#007bff', handleOnPress }: Props) {
  return (
    <TouchableOpacity style={[styles.Button, {backgroundColor: backgroundColor}]} onPress={handleOnPress}>
      <Text style={styles.ButtonText}>{text}</Text>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
  Button: {
    // backgroundColor: '#007bff',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 25,
    shadowColor: '#007bff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
