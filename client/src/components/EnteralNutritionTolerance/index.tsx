import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

const color = 'lightblue';

export default function ENT() {
    return (
        <View>
            <View className="at-row at-row__align--center at-row__justify--center">
                <View
                    className="at-col at-col-8"
                    style={{ display: 'flex', justifyContent: 'center' }}
                >
                    评价内容
                </View>
                <View className="at-col" style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    计分内容
                </View>
            </View>
            <View className="at-row at-row__align--center at-row__justify--center">
                <View className="at-col at-col-3">腹胀/腹痛</View>
                <View className="at-col at-col-4">恶心/呕吐</View>
                <View className="at-col at-col-4">腹泻</View>
                <View className="at-col at-col-1">分值</View>
            </View>
            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color }}
            >
                <View className="at-col at-col-3">无</View>
                <View className="at-col at-col-4 at-row at-row--wrap">
                    <View className="at-col">无</View>
                    <View className="at-col">持续胃肠减压无症状</View>
                </View>
                <View className="at-col at-col-4">无</View>
                <View className="at-col at-col-1" style={{ color: 'red' }}>
                    0
                </View>
            </View>
            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: '#EEEEEE' }}
            >
                <View className="at-col at-col-3">轻度腹胀无腹痛</View>
                <View className="at-col at-col-4">恶心无呕吐</View>
                <View className="at-col at-col-4 at-row at-row--wrap">
                    <View className="at-col">稀便3-5次/天</View>
                    <View className="at-col">量小于500ml</View>
                </View>
                <View className="at-col at-col-1" style={{ color: 'red' }}>
                    1
                </View>
            </View>
            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: color }}
            >
                <View className="at-col at-col-3 at-row at-row--wrap">
                    <View className="at-col">明显腹胀或腹</View>
                    <View className="at-col">痛能自行缓解</View>
                    <View className="at-col">或腹内压15-</View>
                    <View className="at-col">20mmHg</View>
                </View>
                <View className="at-col at-col-4 at-row at-row--wrap">
                    <View className="at-col">恶心呕吐(不需胃</View>
                    <View className="at-col">{'肠减压)或250ml'}</View>
                    <View className="at-col">{'<GRV<500ml'}</View>
                </View>
                <View className="at-col at-col-4 at-row at-row--wrap">
                    <View className="at-col">稀便>5/d</View>
                    <View className="at-col">且量500-1500ml</View>
                </View>
                <View className="at-col at-col-1" style={{ color: 'red' }}>
                    2
                </View>
            </View>
            <View
                className="at-row at-row--wrap"
                style={{ fontSize: '0.7em', backgroundColor: '#EEEEEE' }}
            >
                <View className="at-col at-col-3 at-row at-row--wrap">
                    <View className="at-col">严重腹胀或腹</View>
                    <View className="at-col">痛不能自行缓</View>
                    <View className="at-col">解或腹内压</View>
                    <View className="at-col">>20mmHg</View>
                </View>
                <View className="at-col at-col-4 at-row at-row--wrap">
                    <View className="at-col">呕吐且需胃肠减压</View>
                    <View className="at-col">{'或>500ml'}</View>
                </View>
                <View className="at-col at-col-4 at-row at-row--wrap">
                    <View className="at-col">稀便>5/d</View>
                    <View className="at-col">且量>1500ml</View>
                </View>
                <View className="at-col at-col-1" style={{ color: 'red' }}>
                    5
                </View>
            </View>
            <View>
                <View style={{ color: '#FF9900', marginTop: '10PX' }}>说明:</View>
                <View style={{ fontSize: '0.7em', color: '#CCCCCC' }}>
                    <View>GRV: 胃残余量</View>
                    以上标准计算总分，初始行肠内营养，每4-6h评估一次，根据评分结果进行EN输注调整
                </View>
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

ENT.options = {
    addGlobalClass: true,
};
