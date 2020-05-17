import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import ENT from '../../../components/EnteralNutritionTolerance';

export default function ENTolerance() {
    return (
        <View style={{ margin: '15PX' }}>
            <ENT />
        </View>
    );
}

ENTolerance.config = {
    navigationBarTitleText: '肠内营养耐受性评分',
};
