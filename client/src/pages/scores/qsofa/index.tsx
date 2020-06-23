import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtListItem, AtList, AtNoticebar } from 'taro-ui';

export default function Qsofa() {
    const [gcs, setGCS] = useState(false);
    const [respiratory_rate, setRespiratoryRate] = useState(false);
    const [systolicBP, setSystolicBP] = useState(false);

    return (
        <View>
            <AtNoticebar>{`qSOFA: ${gcs ? 1 : 0} + ${respiratory_rate ? 1 : 0} + ${systolicBP ? 1 : 0} = ${
                Number(gcs) + Number(respiratory_rate) + Number(systolicBP)
            }`}</AtNoticebar>
            <AtList>
                <AtListItem
                    title="意识改变 GCS<15"
                    isSwitch={true}
                    switchIsCheck={gcs}
                    onSwitchChange={() => setGCS(!gcs)}
                />
                <AtListItem
                    title="呼吸频率≥22次/分"
                    isSwitch={true}
                    switchIsCheck={respiratory_rate}
                    onSwitchChange={() => setRespiratoryRate(!respiratory_rate)}
                />
                <AtListItem
                    title="收缩压≤100mmHg"
                    isSwitch={true}
                    switchIsCheck={systolicBP}
                    onSwitchChange={() => setSystolicBP(!systolicBP)}
                />
            </AtList>
            <View style={{ fontSize: '0.5em', margin: '10PX' }}>
                <View>注: qSofa 2-3分可能导致3-14倍死亡率增加。</View>
                <View>来源: https://www.mdcalc.com/qsofa-quick-sofa-score-sepsis</View>
            </View>
        </View>
    );
}

Qsofa.config = {
    navigationBarTitleText: 'qSOFA评分',
};
