import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';

// import AGI from '../../../components/Agi';
import './index.scss';

const odd = 'lightblue';
const even = '#DDDDDD';

export default function AGIPage() {
    return (
        <View style={{ margin: '5PX' }}>
            <View className="gridcontainer">
                <View>AGI</View>
                <View>定义</View>
                <View>原理</View>
                <View>举例</View>

                <View style={{ backgroundColor: odd }}>Ⅰ</View>
                <View style={{ backgroundColor: odd }}>有明确病因、胃肠道功能部分受损</View>
                <View style={{ backgroundColor: odd }}>
                    胃肠道症状常常发生在机体经历一个打击（如手术、休克等）之后，具有暂时性和自限性的特点
                </View>
                <View style={{ backgroundColor: odd }}>
                    术后早期恶心、呕吐；休克早期肠鸣音消失、肠动力减弱
                </View>

                <View style={{ backgroundColor: even }}>Ⅱ</View>
                <View style={{ backgroundColor: even }}>
                    胃肠道不具备完整的消化和吸收功能，无法满足机体对营养物质和水的需求
                </View>
                <View style={{ backgroundColor: even }}>
                    AGI通常发生在没有针对胃肠道的干预的基础上，或者当腹部手术造成的胃肠道并发症较预期更严重时
                </View>
                <View style={{ backgroundColor: even }}>
                    胃轻瘫伴大量胃潴留或返流；下消化道麻痹、腹泻；腹腔内高压Ⅰ级：12-15mmHg；胃内容物或粪便中可见出血；存在喂养不耐受（尝试肠内营养途径72小时未达到20kcal/kg
                    BW/day目标）
                </View>

                <View style={{ backgroundColor: odd }}>Ⅲ</View>
                <View style={{ backgroundColor: odd }}>
                    给予干预处理后，胃肠功能仍不能恢复，整体状况没有改善
                </View>
                <View style={{ backgroundColor: odd }}>
                    临床常见于肠内喂养（红霉素、放置幽门后管等）后，喂养不耐受持续得不到改善，导致MODS进行性恶化
                </View>
                <View style={{ backgroundColor: odd }}>
                    持续喂养不耐受：大量胃潴留、持续胃肠道麻痹、肠道扩张出现或恶化；IAH进展至Ⅱ（IAP
                    15-20mmHg）、腹腔灌注压下降（APP）（＜60mmHg）；喂养不耐受状态出现，可能与MODS的持续或恶化相关
                </View>

                <View style={{ backgroundColor: even }}>Ⅳ</View>
                <View style={{ backgroundColor: even }}>
                    AGI逐步进展，MODS和休克进行性恶化，随时有生命危险
                </View>
                <View style={{ backgroundColor: even }}>一般状况急剧恶化，伴远隔器官功能障碍</View>
                <View style={{ backgroundColor: even }}>
                    肠道缺血坏死、导致失血性休克的胃肠道出血、Ogilvies综合征、需要积极减压的腹腔间隔室综合症（ACS）
                </View>
            </View>
        </View>
    );
}

AGIPage.config = {
    navigationBarTitleText: 'AGI评分',
};
