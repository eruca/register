import Taro from '@tarojs/taro';
import { View, Text } from '@tarojs/components';

interface IProps {
    name: string;
    value: string;
}

export default function FormField({ name, value }: IProps) {
    return (
        <View className="at-input">
            <Text className="at-input__title">{name}:</Text>
            <Text className="at-input__input">{value}</Text>
        </View>
    );
}

FormField.options = {
    addGlobalClass: true,
};
