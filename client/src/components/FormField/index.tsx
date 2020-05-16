import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

interface IProps {
    name: string;
    value: any;
    valueColor?: string;
}

export default function FormField({ name, value, valueColor }: IProps) {
    return (
        <View className="at-input">
            <Text className="at-input__title">{name}:</Text>
            <Text
                className="at-input__input"
                style={{ color: valueColor ? valueColor : undefined }}
            >
                {value}
            </Text>
        </View>
    );
}

FormField.options = {
    addGlobalClass: true,
};
