import Taro, { useState } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtInput, AtMessage, AtList, AtNoticebar } from 'taro-ui';

export default function BMI() {
    const [weight, setWeight] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);

    return (
        <View>
            <AtMessage />
            <AtNoticebar>{genBarNote(weight, height)}</AtNoticebar>
            <AtList>
                <AtInput
                    clear={true}
                    name="weight"
                    title="体重"
                    type="digit"
                    placeholder="请输入体重(kg)"
                    value={weight ? weight.toString() : ''}
                    onChange={(v: string) => setWeight(v ? parseFloat(v) : 0)}
                    onBlur={() =>
                        weight > 200 && Taro.atMessage({ message: '体重错误', type: 'error' })
                    }
                />
                <AtInput
                    clear={true}
                    name="height"
                    title="身高"
                    type="digit"
                    placeholder="请输入身高(cm)"
                    value={height ? height.toString() : ''}
                    onChange={(v: string) => setHeight(v ? parseFloat(v) : 0)}
                    onBlur={() =>
                        (height < 30 || height > 300) &&
                        Taro.atMessage({ message: '身高错误', type: 'error' })
                    }
                />
            </AtList>
            <View style={{ margin: '15PX' }}>
                <View style={{ color: '#FF9900', marginTop: '10PX' }}>说明:</View>
                <View>
                    <Text style={{ color: '#FF9900' }}>理想体重: </Text>
                    身高 — 105
                </View>
                <View>
                    <Text style={{ color: 'red' }}>过轻体重: </Text>
                    BMI ＜ 18.5
                </View>
                <View>
                    <Text style={{ color: 'red' }}>正常体重: </Text>
                    {'18.5 ≤ BMI < 24'}
                </View>
                <View>
                    <Text style={{ color: 'red' }}>过重: </Text>
                    {'24 ≤ BMI < 27'}
                </View>
                <View>
                    <Text style={{ color: 'red' }}>轻度肥胖: </Text>
                    {'27 ≤ BMI < 30'}
                </View>
                <View>
                    <Text style={{ color: 'red' }}>中度肥胖: </Text>
                    {'30 ≤ BMI < 35'}
                </View>
                <View>
                    <Text style={{ color: 'red' }}>重度肥胖: </Text>
                    BMI ≥ 35
                </View>
            </View>
        </View>
    );
}

function genBarNote(weight: number, height: number): string {
    if (!weight || !height) {
        return '请填写完整';
    }
    return `bmi: ${(weight / height / height) * 10000}`;
}

BMI.config = {
    navigationBarTitleText: 'BMI',
};
