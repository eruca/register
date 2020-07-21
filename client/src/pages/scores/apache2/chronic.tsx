import Taro, { Dispatch } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtCard } from "taro-ui";
import CPicker from "../../../components/CPicker";

export interface IProps {
  scores: number[];
  index: number;
  setIndex: Dispatch<number>;
  showExplanation: boolean;
}

export default function Chronic({
  index,
  setIndex,
  scores,
  showExplanation,
}: IProps) {
  return (
    <View>
      <CPicker
        items={[
          "无明显疾病或免疫抑制",
          "择期手术后入ICU",
          "急诊手术或非手术后入ICU",
        ]}
        index={index}
        setIndex={setIndex}
        scores={scores}
        text="慢性病评分"
      />
      {showExplanation && (
        <View style={{ marginTop: "10PX" }}>
          <AtCard title="慢性健康评分说明">
            若不符合慢性器官功能不全或免疫功能抑制的诊断，无论入院情况如何，均没有慢性健康评分（即慢性健康评分为0）
            <View
              className="at-row at-row__align--center at-row__justify--center"
              style={{ marginTop: "5PX" }}
            >
              <View className="at-col at-col-2">脏器</View>
              <View className="at-col at-col-10">诊断</View>
            </View>
            <View className="at-row at-row--wrap" style={{ fontSize: "0.7em" }}>
              <View className="at-col at-col-2">肝脏</View>
              <View className="at-col at-col-10 at-row at-row--wrap">
                <View className="at-col at-col-6">
                  活检证实的肝硬化及明确的门脉高压；
                </View>
                <View className="at-col at-col-6">
                  既往因门脉高压引起的上消化道出血；
                </View>
                <View className="at-col at-col-6">
                  或既往发生肝功能衰竭/肝性脑病/肝昏迷
                </View>
              </View>
            </View>
            <View className="at-row at-row--wrap" style={{ fontSize: "0.7em" }}>
              <View className="at-col at-col-2">心脏</View>
              <View className="at-col at-col-10">纽约心脏病协会心功能IV级</View>
            </View>
            <View className="at-row at-row--wrap" style={{ fontSize: "0.7em" }}>
              <View className="at-col at-col-2">呼吸</View>
              <View className="at-col at-col-10 at-row at-row--wrap">
                <View className="at-col at-col-12">
                  慢性阻塞性、梗阻性或血管性肺疾病导致活动
                </View>
                <View className="at-col at-col-12">
                  重度受限,即不能上楼或不能做家务；或明确
                </View>
                <View className="at-col at-col-12">
                  的慢性低氧、CO2潴留、继发性真红细胞增多症、
                </View>
                <View className="at-col at-col-12">
                  重度肺动脉高压(&gt; 40mmHg)或呼吸肌依赖
                </View>
              </View>
            </View>
            <View className="at-row at-row--wrap" style={{ fontSize: "0.7em" }}>
              <View className="at-col at-col-2">肾脏</View>
              <View className="at-col at-col-10">接受长期透析治疗</View>
            </View>
            <View className="at-row at-row--wrap" style={{ fontSize: "0.7em" }}>
              <View className="at-col at-col-2">免疫抑制</View>
              <View className="at-col at-col-10 at-row at-row--wrap">
                <View className="at-col at-col-12">
                  应用治疗影响感染的抵抗力，如免疫功能
                </View>
                <View className="at-col at-col-12">
                  抑制治疗，化疗，放疗，长期或近期使用
                </View>
                <View className="at-col at-col-12">
                  大剂量激素，或罹患疾病影响感染的抵抗力，
                </View>
                <View className="at-col at-col-12">如白血病、淋巴瘤和AIDS</View>
              </View>
            </View>
            <View>
              数据参考:
              <View>https://clincalc.com/IcuMortality/APACHEII.aspx</View>
            </View>
          </AtCard>
        </View>
      )}
    </View>
  );
}

Chronic.options = {
  addGlobalClass: true,
};
