import Taro, { useState } from '@tarojs/taro';
import { View, Picker, Text } from '@tarojs/components';
import { AtMessage, AtTabs, AtTabsPane, AtList, AtListItem } from 'taro-ui';

// import Title from '../../../components/Title';
import { tabs } from './conf';
import './style.css';

export default function Apache2() {
    // Tabs 切换
    const [currTab, setCurrTab] = useState<number>(0);
    return (
        <View>
            <AtMessage />
            <View className="fix_view">分值</View>
            <View style={{ marginTop: '20PX' }}>
                <AtTabs tabList={tabs} current={currTab} onClick={(v) => setCurrTab(v)}>
                    <AtTabsPane current={currTab} index={0}>
                        <View className="page-section">
                            <Text>生命体征</Text>
                            <View>
                                <Picker
                                    mode="selector"
                                    range={['a', 'b']}
                                    value={0}
                                    onChange={() => {}}
                                >
                                    <AtList>
                                        <AtListItem title="国家" extraText={'a'} />
                                    </AtList>
                                </Picker>
                            </View>
                        </View>
                    </AtTabsPane>
                    <AtTabsPane current={currTab} index={1}></AtTabsPane>
                    <AtTabsPane current={currTab} index={2}></AtTabsPane>
                </AtTabs>
            </View>
        </View>
    );
}

Apache2.config = {
    navigationBarTitleText: 'APACHE Ⅱ',
};

Apache2.options = {
    addGlobalClass: true,
};
