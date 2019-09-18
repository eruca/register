import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

export default function EnteralNutritionTolerance() {
    return (
        <View>
            <View className="at-row at-row__align--center at-row__justify--center">
                <View className="at-col at-col-2">评价内容</View>
                <View className="at-col at-col__offset-4">计分内容</View>
            </View>
            <View className="at-row at-row__align--center at-row__justify--center">
                <View className="at-col at-col-2">分值</View>
                <View className="at-col at-col-2">0</View>
                <View className="at-col at-col-2">1</View>
                <View className="at-col at-col-3">2</View>
                <View className="at-col at-col-3">5</View>
            </View>
            <View className="at-row at-row--wrap" style={{ fontSize: '0.7em' }}>
                <View className="at-col at-col-2">腹胀/腹痛</View>
                <View className="at-col at-col-2">无</View>
                <View className="at-col at-col-2 at-row at-row--wrap">
                    <View className="at-col at-col-6">轻度腹胀</View>
                    <View className="at-col at-col-6">无腹痛</View>
                </View>
                <View className="at-col at-col-3 at-row at-row--wrap">
                    <View className="at-col at-col-6">明显腹胀</View>
                    <View className="at-col at-col-6">腹痛自行缓解</View>
                    <View className="at-col at-col-6">腹内压15~20mmHg</View>
                </View>
                <View className="at-col at-col-3 at-row at-row--wrap">
                    <View className="at-col at-col-6">严重腹胀</View>
                    <View className="at-col at-col-6">腹痛不能自行缓解</View>
                    <View className="at-col at-col-6">腹内压>20mmHg</View>
                </View>
            </View>
            <View className="at-row at-row--wrap" style={{ fontSize: '0.7em' }}>
                <View className="at-col at-col-2">恶心/呕吐</View>
                <View className="at-col at-col-2 at-row at-row--wrap">
                    <View className="at-col at-col-6">无/持续胃肠</View>
                    <View className="at-col at-col-6">减压无症状</View>
                </View>
                <View className="at-col at-col-2 at-row at-row--wrap">
                    <View className="at-col at-col-6">恶心</View>
                    <View className="at-col at-col-6">但无呕吐</View>
                </View>
                <View className="at-col at-col-3 at-row at-row--wrap">
                    <View className="at-col at-col-6">恶心呕吐</View>
                    <View className="at-col at-col-6">(不需胃肠减压)</View>
                    <View className="at-col at-col-6">GRV>250ml</View>
                </View>
                <View className="at-col at-col-3 at-row at-row--wrap">
                    <View className="at-col at-col-6">呕吐且需胃肠</View>
                    <View className="at-col at-col-6">减压或GRV>500ml/l</View>
                </View>
            </View>
            <View className="at-row at-row--wrap" style={{ fontSize: '0.7em' }}>
                <View className="at-col at-col-2">腹泻</View>
                <View className="at-col at-col-2">无</View>
                <View className="at-col at-col-2 at-row at-row--wrap">
                    <View className="at-col at-col-6">稀便3-5/d</View>
                    <View className="at-col at-col-6">{'且量<500ml'}</View>
                </View>
                <View className="at-col at-col-3 at-row at-row--wrap">
                    <View className="at-col at-col-6">稀便≥5/d</View>
                    <View className="at-col at-col-6">且量500~1500ml</View>
                </View>
                <View className="at-col at-col-3 at-row at-row--wrap">
                    <View className="at-col at-col-6">稀便≥5/d</View>
                    <View className="at-col at-col-6">且量≥1500ml</View>
                </View>
            </View>
            <View>
                <View>说明</View>
                <View>
                    <View style={{ color: 'red' }}>0~2分</View>
                    继续肠内营养，增加或维持原速度，对症治疗
                </View>
                <View>
                    <View style={{ color: 'red' }}>3~4分</View>
                    继续肠内营养，减慢速度，2h后重新评估
                </View>
                <View>
                    <View style={{ color: 'red' }}>≥5分</View>
                    暂停肠内营养，重新评估或者更换输注途径
                </View>
            </View>
        </View>
    );
}

EnteralNutritionTolerance.options = {
    addGlobalClass: true
}