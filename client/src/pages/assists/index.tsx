import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtListItem, AtList, AtGrid } from 'taro-ui';

export default function Assists() {
    return (
        <View>
            <AtList>
                <AtListItem
                    title="评分工具"
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'settings' }}
                />
            </AtList>
            <AtGrid
                mode="rect"
                onClick={onClick}
                data={[
                    { value: 'GCS评分' },
                    { value: 'APACHE Ⅱ' },
                    { value: 'SOFA' },
                    { value: 'qSOFA' },
                ]}
            />
        </View>
    );
}

const onClick = (item: object, index: number) => {
    console.log('item', item, 'index', index);
    switch (index) {
        case 0:
            Taro.navigateTo({ url: '/pages/scores/gcs/index' });
            break;
        case 1:
            Taro.navigateTo({ url: '/pages/scores/apache2/index' });
            break;
        case 2:
            Taro.navigateTo({ url: '/pages/scores/sofa/index' });
            break;
        case 3:
            Taro.navigateTo({ url: '/pages/scores/qsofa/index' });
            break;
        default:
    }
};

Assists.config = {
    navigationBarTitleText: '工具箱',
};
