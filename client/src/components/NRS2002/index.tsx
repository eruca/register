import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtButton } from 'taro-ui';

const color = 'lightblue';
const color2 = '#EEEEEE';

export default function NRS2002() {
    return (
        <View>
            <View className="at-row at-row__align--center at-row__justify--center">
                <View className="at-col at-col-10">状况</View>
                <View className="at-col at-col-2">分值</View>
            </View>
            <View style={{ color: '#6699FF' }}>疾病状态</View>
            <View
                className="at-row at-row__align--center at-row__justify--center"
                style={{ fontSize: '0.7em', backgroundColor: color2 }}
            >
                <View className="at-col at-col-10 at-row at-row--wrap">
                    <View className="at-col at-col-6">骨盆骨折或慢性病患者合并以下:肝硬化</View>
                    <View className="at-col at-col-6">慢阻肺、长期血透、糖尿病、肿瘤</View>
                </View>
                <View className="at-col at-col-2">1</View>
            </View>

            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color }}
            >
                <View className="at-col at-col-10">腹部重大手术、中风、重症肺炎、血液系统种类</View>
                <View className="at-col at-col-2">2</View>
            </View>

            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color2 }}
            >
                <View className="at-col at-col-10">颅脑损伤、骨髓抑制、加护病患(APACHEⅡ≥10)</View>
                <View className="at-col at-col-2">3</View>
            </View>

            <View style={{ color: '#6699FF' }}>营养状况</View>
            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color2 }}
            >
                <View className="at-col at-col-10">正常营养状况</View>
                <View className="at-col at-col-2">0</View>
            </View>

            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color }}
            >
                <View className="at-col at-col-10 at-row at-row--wrap">
                    <View className="at-col at-col-6">3个月内体重减轻＞5%</View>
                    <View className="at-col at-col-6">最近1周进食量(与需要量比较)减少20~50%</View>
                </View>
                <View className="at-col at-col-2">1</View>
            </View>

            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color2 }}
            >
                <View className="at-col at-col-10 at-row at-row--wrap">
                    <View className="at-col at-col-6">2个月内体重减轻＞5%、BMI=18.5~20.5</View>
                    <View className="at-col at-col-6">最近1周进食量(与需要量比较)减少50~75%</View>
                </View>
                <View className="at-col at-col-2">2</View>
            </View>

            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color }}
            >
                <View className="at-col at-col-10 at-row at-row--wrap">
                    <View className="at-col at-col-6">1个月内体重减轻＞5%或3个月内减少>15%</View>
                    <View className="at-col at-col-6">BMI小于18.5或血清蛋白小于35g/L、</View>
                    <View className="at-col at-col-6">最近1周进食量(与需要量比较)减少70~100%</View>
                </View>
                <View className="at-col at-col-2">3</View>
            </View>

            <View style={{ color: '#6699FF' }}>年龄状况</View>
            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color2 }}
            >
                <View className="at-col at-col-10">年龄>75岁</View>
                <View className="at-col at-col-2">1</View>
            </View>

            <View>
                <View style={{ color: '#FF9900', marginTop: '10PX' }}>说明:</View>
                <View>
                    <View style={{ color: 'red' }}>{'<3分'}</View>
                    如果接受重大手术，则每周重新评估营养状况
                </View>
                <View>
                    <View style={{ color: 'red' }}>≥3分</View>
                    有营养不良风险，需要营养支持治疗
                </View>
            </View>
            <View>
                <AtButton
                    type="secondary"
                    onClick={() => Taro.navigateTo({ url: '/pages/scores/apache2/index' })}
                >
                    去计算APACHEⅡ
                </AtButton>
                <View style={{ marginTop: '5PX' }}>
                    <AtButton
                        type="secondary"
                        onClick={() => Taro.navigateTo({ url: '/pages/scores/bmi/index' })}
                    >
                        去计算体重指数(BMI)
                    </AtButton>
                </View>
            </View>
        </View>
    );
}

NRS2002.options = {
    addGlobalClass: true,
};
