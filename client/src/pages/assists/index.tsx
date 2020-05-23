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
            <AtList>
                <AtListItem
                    title="评分说明"
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'loading-2' }}
                />
                <AtGrid
                    mode="rect"
                    onClick={onClick2}
                    data={[
                        { value: '耐受性评分' },
                        { value: 'NRS2002' },
                        { value: 'AGI' },
                        { value: 'RASS评分' },
                    ]}
                />
            </AtList>

            <AtList>
                <AtListItem
                    title="计算"
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'money' }}
                />
                <AtGrid
                    mode="rect"
                    onClick={onClick3}
                    data={[{ value: '体重指数(BMI)' }, { value: '营养计算' }]}
                />
            </AtList>
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
        // case 4:
        //     Taro.navigateTo({ url: '/pages/scores/bmi/index' });
        //     break;
        default:
    }
};

const onClick2 = (item: object, index: number) => {
    console.log('item', item, 'index', index);
    switch (index) {
        case 0:
            Taro.navigateTo({ url: '/pages/assess/entolerance/index' });
            break;
        case 1:
            Taro.navigateTo({ url: '/pages/assess/nrs2002/index' });
            break;
        case 2:
            Taro.navigateTo({ url: '/pages/assess/agi/index' });
            break;
        case 3:
            Taro.navigateTo({ url: '/pages/assess/rass/index' });
            break;
        default:
    }
};

// 计算
const onClick3 = (item: object, index: number) => {
    console.log('item', item, 'index', index);
    switch (index) {
        case 0:
            Taro.navigateTo({ url: '/pages/scores/bmi/index' });
            break;
        case 1:
            Taro.navigateTo({ url: '/pages/scores/nutrition/index' });
            break;
        // case 2:
        //     Taro.navigateTo({ url: '/pages/assess/agi/index' });
        //     break;
        // case 3:
        //     Taro.navigateTo({ url: '/pages/assess/rass/index' });
        //     break;
        default:
    }
};

Assists.config = {
    navigationBarTitleText: '工具箱',
};
