import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

export default function Result() {
    return <View>Result</View>;
}

Result.options = {
    addGlobalClass: true,
};

Result.config = {
    navigationBarTitleText: '结果统计',
};