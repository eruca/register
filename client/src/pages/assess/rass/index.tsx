import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss';

const odd = { backgroundColor: 'lightblue' };
const even = { backgroundColor: '#DDDDDD' };

export default function RassPage() {
    return (
        <View style={{ margin: '5PX' }}>
            <View className="gridcontainer">
                <View>术语</View>
                <View>描述</View>
                <View>评分</View>

                <View style={odd}>有攻击性</View>
                <View style={odd}>明显的暴力行为，对工作人员有威胁</View>
                <View style={odd}>+4</View>

                <View style={even}>非常躁动</View>
                <View style={even}>试着拔出呼吸管，胃管或静脉点滴</View>
                <View style={even}>+3</View>

                <View style={odd}>躁动焦虑</View>
                <View style={odd}>身体无意义的频繁移动，无法配合呼吸机</View>
                <View style={odd}>+2</View>

                <View style={even}>不安焦虑</View>
                <View style={even}>焦虑紧张但身体只有轻微的移动</View>
                <View style={even}>+1</View>

                <View style={odd}>清醒平静</View>
                <View style={odd}> 清醒自然状态</View>
                <View style={odd}>0</View>

                <View style={even}>昏昏欲睡</View>
                <View style={even}>
                    没有完全清醒，但可声音唤醒并维持清醒（睁眼且有眼神交流），＞10s
                </View>
                <View style={even}>-1</View>

                <View style={odd}>轻度镇静</View>
                <View style={odd}>声音唤醒后短暂维持清醒，＜10s</View>
                <View style={odd}>-2</View>

                <View style={even}>中度镇静</View>
                <View style={even}>对声音有反应或睁眼（但无眼神交流）</View>
                <View style={even}>-3</View>

                <View style={odd}> 重度镇静</View>
                <View style={odd}>对物理刺激有反应或睁眼</View>
                <View style={odd}>-4</View>

                <View style={even}>昏迷</View>
                <View style={even}>对声音和物理刺激均无反应</View>
                <View style={even}>-5</View>
            </View>
            <View style={{ color: 'red', marginTop: '5PX' }}>结果解读:</View>
            <View className="result">
                <View>第1步：观察病人</View>
                <View className='ritem'>病人清醒、不安焦虑、或躁动？——>评分0~+4</View>
                <View>第2步：若病人不清醒，用名字唤醒病人并令其睁眼看着说话人</View>
                <View className='ritem'>病人可睁眼，有眼神交流，并维持该状态——>评分-1</View>
                <View className='ritem'>病人可睁眼，有眼神交流，但无法维持——>评分-2</View>
                <View className='ritem'>病人可睁眼，或有其他有反应，但无眼神交流——>评分-3</View>
                <View>第3步：若病人对声音无反应，摇晃肩膀或抚摸胸口唤醒病人</View>
                <View className='ritem'>病人对物理刺激有反应或睁眼——>评分-4</View>
                <View className='ritem'>病人对所有刺激均无反应——>评分-5</View>
            </View>
            <View className="reference">
                参考来源:Sessler CN, et al. The Richmond Agitation-Sedation Scale: validity and
                reliability in adult intensive care unit patients. Am J Respir Crit Care Med. 2002
                Nov 15; 166(10): 1338-44.
            </View>
        </View>
    );
}

RassPage.config = {
    navigationBarTitleText: 'RASS镇静评分',
};
