import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtTabs, AtTabsPane } from 'taro-ui';

import Stats from './stats';
import Graph from './graph';

export default function Statistic() {
    const [segmentIndex, setSegmentIndex] = useState<number>(0);

    console.log('segmentIndex', segmentIndex);
    return (
        <View>
            <AtTabs
                current={segmentIndex}
                tabList={[{ title: '统计' }, { title: '图表' }]}
                onClick={(v) => setSegmentIndex(v)}
            >
                <AtTabsPane current={segmentIndex} index={0}>
                    <Graph />
                </AtTabsPane>
                <AtTabsPane current={segmentIndex} index={1}>
                    <Stats />
                </AtTabsPane>
            </AtTabs>
        </View>
    );
}
