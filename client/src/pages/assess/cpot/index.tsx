import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSwitch } from 'taro-ui';

import './index.scss';

const odd = { backgroundColor: 'lightblue' };
const even = { backgroundColor: '#DDDDDD' };

export default function CpotPage() {
    const [isTube, setIsTube] = useState(false);

    return (
        <View style={{ margin: '5PX' }}>
            <View className="gridcontainer">
                <View>指标</View>
                <View>描述</View>
                <View></View>
                <View>分值</View>

                <View style={odd}></View>
                <View style={odd}>无明显面部肌肉紧张</View>
                <View style={odd}>放松、自然</View>
                <View style={odd}>0</View>

                <View style={odd}>面部表情</View>
                <View style={odd}>皱眉、眉头降低、眼眶紧绷、提上睑肌收缩</View>
                <View style={odd}>紧张</View>
                <View style={odd}>1</View>

                <View style={odd}></View>
                <View style={odd}>以上所有的面部动作 + 眼睑紧闭</View>
                <View style={odd}>痛苦</View>
                <View style={odd}>2</View>

                <View style={even}></View>
                <View style={even}>无运动(并不意味着没有疼痛)</View>
                <View style={even}>无运动</View>
                <View style={even}>0 </View>

                <View style={even}>肢体动作</View>
                <View style={even}>缓慢、谨慎移动、触碰痛处，通过运动寻求关注</View>
                <View style={even}>防护</View>
                <View style={even}>1 </View>

                <View style={even}></View>
                <View style={even}>拔管，试图坐起，挥臂，不听指令，反抗，试图爬行</View>
                <View style={even}>坐立不安</View>
                <View style={even}>2</View>

                <View style={odd}></View>
                <View style={odd}>被动运动无抵抗</View>
                <View style={odd}>放松</View>
                <View style={odd}>0</View>

                <View style={odd}>肌肉紧张度</View>
                <View style={odd}>被动运动有抵抗</View>
                <View style={odd}>紧张、僵直</View>
                <View style={odd}>1</View>

                <View style={odd}></View>
                <View style={odd}>被动运动强烈抵抗，无法完成</View>
                <View style={odd}>非常紧张、僵直</View>
                <View style={odd}>2</View>

                <View style={even}></View>
                {isTube ? (
                    <View style={even}>通气正常，无报警</View>
                ) : (
                    <View style={even}>交谈正常，语调正常或不出声</View>
                )}
                {isTube ? (
                    <View style={even}>可耐受操作</View>
                ) : (
                    <View style={even}>发声正常或不发声</View>
                )}
                <View style={even}>0</View>

                {isTube ? (
                    <View style={even}>插管病人的依从性</View>
                ) : (
                    <View style={even}>拔管病人的发声情况</View>
                )}
                {isTube ? (
                    <View style={even}>警报自发终止</View>
                ) : (
                    <View style={even}>叹息、呻吟</View>
                )}
                {isTube ? (
                    <View style={even}>紧张、僵直</View>
                ) : (
                    <View style={even}>叹息、呻吟</View>
                )}
                <View style={even}>1</View>

                <View style={even}></View>
                {isTube ? (
                    <View style={even}>异步：通气中断，频繁报警</View>
                ) : (
                    <View style={even}>尖叫、哭泣</View>
                )}
                {isTube ? (
                    <View style={even}>抗拒、挣脱</View>
                ) : (
                    <View style={even}>尖叫、哭泣</View>
                )}
                <View style={even}>2</View>
            </View>
            <AtSwitch title="插管状态" checked={isTube} onChange={() => setIsTube(!isTube)} />
        </View>
    );
}

CpotPage.config = {
    navigationBarTitleText: 'CPOT评分',
};
