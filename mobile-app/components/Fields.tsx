import { KeyboardTypeOptions, StyleSheet, TextInput } from 'react-native';


type Props = {
    placeholder: string;
    isFocused: boolean;
    value: string;
    setFunc: (text: string) => void;
    setIsFocusedFunc: (value: boolean) => void;
    keyboardType?: KeyboardTypeOptions;
    secureTextEntry?: boolean;
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
    multiline?: boolean; // ← новый пропс
};


export function BasicTextField({
    placeholder,
    isFocused,
    value,
    setFunc,
    setIsFocusedFunc,
    keyboardType = 'default',
    secureTextEntry = false,
    autoCapitalize = 'none',
    multiline = false
}: Props) {
    return (
        <TextInput
            style={[styles.input, isFocused && styles.inputFocused, multiline && styles.multilineInput]}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={value}
            onChangeText={setFunc}
            onFocus={() => setIsFocusedFunc(true)}
            onBlur={() => setIsFocusedFunc(false)}
            autoCapitalize={autoCapitalize || "none"}
            keyboardType={keyboardType || 'default'}
            secureTextEntry={secureTextEntry}
            multiline={multiline} // ← включаем многострочность
            textAlignVertical={multiline ? 'top' : 'center'} // ← выравнивание для многострочности
        />
    );
}


type NumericFieldProps = {
    placeholder: string;
    isFocused: boolean;
    value: string;
    setFunc: (text: string) => void;
    setIsFocusedFunc: (value: boolean) => void;
    maxLength?: number;
    keyboardType?: KeyboardTypeOptions;
};


export function BasicNumericField({
    placeholder,
    isFocused,
    value,
    setFunc,
    setIsFocusedFunc,
    maxLength,
    keyboardType = 'numeric'
}: NumericFieldProps) {
    return (
        <TextInput
            style={[styles.input, isFocused && styles.inputFocused]}
            placeholder={placeholder}
            placeholderTextColor="#888"
            value={value}
            onChangeText={setFunc}
            onFocus={() => setIsFocusedFunc(true)}
            onBlur={() => setIsFocusedFunc(false)}
            keyboardType={keyboardType}
            maxLength={maxLength}
        />
    );
}


const styles = StyleSheet.create({
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 15,
        marginBottom: 20,
        color: '#ffffff',
        fontSize: 16,
    },
    inputFocused: {
        borderColor: '#007bff',
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        shadowColor: '#007bff',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    multilineInput: {
        height: 100, // ← в 2 раза больше
        paddingTop: 12, // ← добавляем отступ сверху для текста
        paddingBottom: 12,
    },
})
