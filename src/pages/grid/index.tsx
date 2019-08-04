import Taro, { useState } from '@tarojs/taro';
import { View, Picker, Text } from '@tarojs/components';
import dayjs from 'dayjs';

import { AtGrid, AtDivider, AtButton } from 'taro-ui';
import './index.scss';

export default function Grid() {
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));

    return (
        <View>
            <Picker mode="date" value={date} onChange={e => setDate(e.detail.value)}>
                <View className="picker-item">
                    当前选择：<Text className="picker-value">{date}</Text>
                </View>
            </Picker>
            <AtButton type="primary">进行记录</AtButton>
            <AtDivider content="记录内容" />
            <AtGrid
                data={[
                    { value: '第1天' },
                    { value: '第2天' },
                    { value: '第3天' },
                    { value: '第4天' },
                    { value: '第5天' },
                    { value: '第6天' },
                    { value: '第7天' },
                ]}
            />
        </View>
    );
}

Grid.config = {
    navigationBarTitleText: '日期',
};

// Grid.options = {
//     addGlobalClass: true,
// };
