import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import NRS2002 from '../../../components/NRS2002';

export default function NRS2002Page() {
    return (
        <View style={{ margin: '15PX' }}>
            <NRS2002 />
        </View>
    );
}

NRS2002Page.config = {
    navigationBarTitleText: 'NRS2002评分',
};
