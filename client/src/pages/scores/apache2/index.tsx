import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSwitch, AtInput, AtCard, AtMessage, AtTabs, AtTabsPane, AtButton } from 'taro-ui';

import CPicker from '../../../components/CPicker';
import Chronic from './chronic';
import {
    gen_ages,
    gen_map,
    gen_respirateRate,
    gen_retalTemp,
    gen_heartRate,
    gen_fio2,
    gen_ph,
    gen_na,
    gen_k,
    gen_cr,
    rbc_compress_volume,
    wbc_count,
} from './config';
import './style.css';

const tabs = [{ title: '急性生理评分' }, { title: '年龄评分+GCS' }, { title: '慢性病评分' }];

const chronicScores = [0, 2, 5];

const isDigit = /^\d+$/;

const diseaseArray: Array<[string, number]> = [
    ['哮喘/过敏', -2.108],
    ['COPD', -0.367],
    ['非心源性肺水肿', -0.251],
    ['呼吸骤停后', -0.168],
    ['误吸/中毒', -0.142],
    ['肺栓塞', -0.128],
    ['呼吸道感染', 0],
    ['呼吸道肿瘤', 0.891],

    ['高血压', -1.798],
    ['心律失常', -1.368],
    ['充血性心力衰竭', -0.424],
    ['低血容量/失血性休克', 0.493],
    ['冠状动脉疾病', -0.191],
    ['脓毒症', 0.113],
    ['心脏停搏后', 0.393],
    ['心源性休克', -0.259],
    ['胸/腹动脉夹层', 0.731],

    ['多发伤保守治疗', -1.228],
    ['头部创伤保守治疗', -0.517],

    ['癫痫', -0.584],
    ['蛛血/脑出血/硬膜下血肿', 0.723],

    ['药物过量', -3.353],
    ['糖尿病酮症酸中毒', -1.507],
    ['胃肠道出血', 0.334],

    ['代谢性/肾内疾病', -0.885],
    ['其他呼吸疾病', -0.89],
    ['其他神经病学疾病', -0.759],
    ['其他心血管疾病', 0.47],
    ['其他消化道疾病', 0.501],

    ['多发伤', -1.684],
    ['慢性心血管病术后', -1.376],
    ['外周血管手术', -1.315],
    ['心脏瓣膜术后', -1.261],
    ['颅内肿瘤术后', -1.245],
    ['肾脏肿瘤术后', -1.204],
    ['肾移植术后', -1.042],
    ['头部创伤', -0.955],
    ['胸部肿瘤术后', -0.802],
    ['颅内出血术后', -0.788],
    ['椎板切除及其他脊随术后', -0.699],
    ['失血性休克', -0.682],
    ['胃肠道出血术后', -0.617],
    ['胃肠道肿瘤术后', -0.248],
    ['术后呼吸功能不全', -0.14],
    ['消化道穿孔/梗阻', 0.06],
    ['术后脓毒症', 0.113],
    ['术后心肺骤停后', 0.393],

    ['其他神经疾病术后', -1.15],
    ['其他心血管术后', -0.797],
    ['其他呼吸道术后', -0.61],
    ['其他消化道术后', -0.613],
    ['其他代谢/肾术后', -0.196],
];

const diseaseMapCoefficient = new Map<string, number>(diseaseArray);

const admissionDisease = Array.from(diseaseMapCoefficient.keys());
const admissionScores = Array.from(diseaseMapCoefficient.values());

export default function Apache2() {
    const [currentTab, setCurrentTab] = useState<number>(0);

    const ages = gen_ages();

    const maps = gen_map();
    const [isMap, setIsMap] = useState(true);
    const [bp, setBp] = useState<string>('');
    const [bpCharCnt, setBpCharCnt] = useState<number>(0);
    const bpChange = (e) => {
        // 如果是删除键，保持原样
        if (e.length < bpCharCnt) {
            setBpCharCnt(e.length);
            setBp(e);
            return;
        }

        const parts = (e as string).split('/');
        if (parts.length === 1) {
            if (!isDigit.test(parts[0])) {
                Taro.atMessage({ message: '请输入血压值', type: 'error' });
            } else if (parseInt(parts[0], 10) > 30) {
                setBp(e + '/');
                setBpCharCnt(e.length + 1);
                return;
            }
        } else if (!isDigit.test(parts[0]) || !isDigit.test(parts[1])) {
            Taro.atMessage({ message: '请输入血压值2', type: 'error' });
        }

        setBpCharCnt(e.length);
        setBp(e);
    };
    const onBlur = () => {
        setIsMap(true);
        const parts = bp.split('/').map((p) => parseInt(p, 10));
        const _map = (parts[0] + 2 * parts[1]) / 3;
        console.log('map', _map);

        if (_map < 49) {
            maps.setIndex(0);
        } else if (_map >= 50 && _map < 70) {
            maps.setIndex(1);
        } else if (_map >= 70 && _map < 110) {
            maps.setIndex(2);
        } else if (_map >= 110 && _map < 130) {
            maps.setIndex(3);
        } else if (_map >= 130 && _map < 160) {
            maps.setIndex(4);
        } else {
            maps.setIndex(5);
        }
    };

    const respirateRate = gen_respirateRate();
    const retalTemps = gen_retalTemp();
    const heartRate = gen_heartRate();

    const [fio2, setFio2] = useState(false);
    const [index, setIndex] = useState(fio2 ? 0 : 3);
    const fio2Config = gen_fio2(fio2);

    const [ph, setPh] = useState(false);
    const [phIndex, setPhIndex] = useState(3);
    const phConfig = gen_ph(ph);

    const na = gen_na();
    const k = gen_k();

    const [acuteRenalFailure, setAcuteRenalFailure] = useState(false);
    const cr = gen_cr();

    const compress_volume = rbc_compress_volume();

    const wbc = wbc_count();
    const [gcs, setGcs] = useState(15);

    // 是否无手术、急诊手术、择期
    const [surgicalIndex, setSurgicalIndex] = useState(0);

    // 入院疾病索引
    const [admiDiseaseIndex, setAdmiDiseaseIndex] = useState(13);
    const [chronicIndex, setChronicIndex] = useState(0);
    const [admiExplanation, setAdmiExplanation] = useState(false);

    // 慢性病说明显示
    const [showChronic, setShowChronic] = useState(false);

    const score1 =
        Math.abs(maps.scores[maps.index]) +
        Math.abs(respirateRate.scores[respirateRate.index]) +
        Math.abs(retalTemps.scores[retalTemps.index]) +
        Math.abs(heartRate.scores[heartRate.index]) +
        Math.abs(fio2Config.scores[index]) +
        Math.abs(phConfig.scores[phIndex]) +
        Math.abs(na.scores[na.index]) +
        Math.abs(k.scores[k.index]) +
        Math.abs(acuteRenalFailure ? 2 * cr.scores[cr.index] : cr.scores[cr.index]) +
        Math.abs(compress_volume.scores[compress_volume.index]) +
        Math.abs(wbc.scores[wbc.index]);
    const score2 = Math.abs(15 - gcs);

    const allScore =
        score1 + score2 + Math.abs(ages.scores[ages.index]) + chronicScores[chronicIndex];

    const x =
        -3.517 +
        0.146 * allScore +
        (surgicalIndex === 1 ? 0.603 : 0) +
        admissionScores[admiDiseaseIndex];
    const R = (Math.exp(x) / (1 + Math.exp(x))) * 100;
    // console.log('allscore',allScore,admissionScores[admiDiseaseIndex],'x',x,'R',R,typeof admiDiseaseIndex,admiDiseaseIndex);

    return (
        <View style={{ paddingTop: '3PX' }}>
            <AtMessage />
            <View className="fix_view">
                {`A:${Math.abs(ages.scores[ages.index])} + B:${
                    chronicScores[chronicIndex]
                } + C:${score2} + D:${score1} = ${allScore} 死亡率: ${R.toFixed(3)}%`}
            </View>
            <View style={{ marginTop: '20PX' }}>
                <AtTabs tabList={tabs} current={currentTab} onClick={(v) => setCurrentTab(v)}>
                    <AtTabsPane current={currentTab} index={0}>
                        <CPicker {...retalTemps} />
                        <View style={{ margin: 'auto -5PX -10PX -5PX' }}>
                            <AtSwitch
                                title={isMap ? '平均动脉压' : '血压'}
                                checked={isMap}
                                onChange={(v) => setIsMap(v)}
                                border={false}
                            />
                        </View>
                        {isMap ? (
                            <CPicker {...maps} />
                        ) : (
                            <View style={{ marginLeft: '-5PX', marginRight: '10PX' }}>
                                <AtInput
                                    name="bp"
                                    title="血压"
                                    value={bp}
                                    type="digit"
                                    placeholder="输入血压"
                                    onChange={bpChange}
                                    clear={true}
                                    onBlur={onBlur}
                                >
                                    mmHg
                                </AtInput>
                            </View>
                        )}
                        <CPicker {...respirateRate} />
                        <CPicker {...heartRate} />

                        <View style={{ margin: 'auto -5PX -10PX -5PX' }}>
                            <AtSwitch
                                title={`吸氧浓度${fio2 ? '≥' : '<'}50%`}
                                checked={fio2}
                                onChange={(v) => {
                                    setFio2(v);
                                    setIndex(v ? 0 : 3);
                                }}
                                border={false}
                            />
                        </View>
                        <CPicker index={index} setIndex={setIndex} {...fio2Config} />

                        <View style={{ margin: 'auto -5PX -10PX -5PX' }}>
                            <AtSwitch
                                title={phConfig.text.slice(0, 3)}
                                checked={ph}
                                onChange={(v) => {
                                    setPh(v);
                                    setPhIndex(3);
                                }}
                                border={false}
                            />
                        </View>
                        <CPicker index={phIndex} setIndex={setPhIndex} {...phConfig} />
                        <CPicker {...na} />
                        <CPicker {...k} />

                        <View style={{ margin: 'auto -5PX -10PX -5PX' }}>
                            <AtSwitch
                                title="急性肾功能衰竭"
                                checked={acuteRenalFailure}
                                onChange={(v) => {
                                    setAcuteRenalFailure(v);
                                }}
                                border={false}
                            />
                        </View>
                        <CPicker {...cr} />

                        <CPicker {...compress_volume} />
                        <CPicker {...wbc} />
                    </AtTabsPane>
                    <AtTabsPane current={currentTab} index={1}>
                        <View style={{ marginLeft: '-5PX' }}>
                            <AtInput
                                name="gcs"
                                title="GCS评分"
                                type="number"
                                value={gcs ? gcs.toString() : ''}
                                clear={true}
                                onChange={(v) =>
                                    v ? setGcs(parseInt(v as string, 10)) : setGcs(0)
                                }
                                onBlur={(v) => {
                                    const v1 = parseInt(v as string, 10);
                                    if (Number.isNaN(v1)) {
                                        Taro.atMessage({
                                            message: '请输入数字3~15',
                                            type: 'error',
                                        });
                                        return;
                                    }
                                    if (v1 < 3 || v1 > 15) {
                                        Taro.atMessage({
                                            message: 'GCS必须在3~15之间, 将重置为15',
                                            type: 'error',
                                        });
                                        setGcs(15);
                                    }
                                }}
                            />
                        </View>
                        <CPicker {...ages} />
                        <CPicker
                            items={['无手术', '急诊手术', '择期手术']}
                            index={surgicalIndex}
                            setIndex={(v) => {
                                setSurgicalIndex(v);
                                v === 0 ? setAdmiDiseaseIndex(13) : setAdmiDiseaseIndex(29);
                                Taro.atMessage({ message: '入科原因改为多发伤', type: 'info' });
                            }}
                            scores={[]}
                            text="是否手术治疗"
                        />
                        <View style={{ margin: 'auto -5PX -10PX -5PX' }}>
                            <AtSwitch
                                title="查看入科原因说明"
                                checked={admiExplanation}
                                onChange={(v) => {
                                    setAdmiExplanation(v);
                                }}
                                border={false}
                            />
                        </View>
                        <CPicker
                            items={
                                surgicalIndex === 0
                                    ? admissionDisease.slice(0, 29)
                                    : admissionDisease.slice(29)
                            }
                            index={surgicalIndex === 0 ? admiDiseaseIndex : admiDiseaseIndex - 29}
                            setIndex={(v) =>
                                surgicalIndex === 0
                                    ? setAdmiDiseaseIndex(v)
                                    : setAdmiDiseaseIndex(v + 29)
                            }
                            scores={
                                surgicalIndex === 0
                                    ? admissionScores.slice(0, 29)
                                    : admissionScores.slice(29)
                            }
                            text="入科原因"
                            abs={false}
                        />
                        <AtButton
                            type="secondary"
                            onClick={() => Taro.navigateTo({ url: '/pages/scores/gcs/index' })}
                            customStyle={{ margin: '5PX' }}
                        >
                            去计算GCS
                        </AtButton>
                        {admiExplanation && surgicalIndex === 0 && (
                            <View style={{ marginTop: '15PX' }}>
                                <AtCard title="呼吸功能不全或呼吸衰竭:">
                                    {diseaseArray.slice(0, 8).map((item, i) => (
                                        <View
                                            style={{
                                                color: i === admiDiseaseIndex ? '#cc3399' : 'black',
                                            }}
                                        >
                                            {item[0]}: {item[1]}
                                        </View>
                                    ))}
                                </AtCard>
                                <AtCard title="心血管功能不全或衰竭:">
                                    {diseaseArray.slice(8, 17).map((item, i) => (
                                        <View
                                            style={{
                                                color:
                                                    i + 8 === admiDiseaseIndex
                                                        ? '#cc3399'
                                                        : 'black',
                                            }}
                                        >
                                            {item[0]}: {item[1]}
                                        </View>
                                    ))}
                                </AtCard>
                                <AtCard title="创伤（非手术）">
                                    {diseaseArray.slice(17, 19).map((item, i) => (
                                        <View
                                            style={{
                                                color:
                                                    i + 17 === admiDiseaseIndex
                                                        ? '#cc3399'
                                                        : 'black',
                                            }}
                                        >
                                            {item[0]}: {item[1]}
                                        </View>
                                    ))}
                                </AtCard>
                                <AtCard title="神经系统(非手术）">
                                    {diseaseArray.slice(19, 21).map((item, i) => (
                                        <View
                                            style={{
                                                color:
                                                    i + 19 === admiDiseaseIndex
                                                        ? '#cc3399'
                                                        : 'black',
                                            }}
                                        >
                                            {item[0]}: {item[1]}
                                        </View>
                                    ))}
                                </AtCard>
                                <AtCard title="其他(非手术）">
                                    {diseaseArray.slice(21, 29).map((item, i) => (
                                        <View
                                            style={{
                                                color:
                                                    i + 21 === admiDiseaseIndex
                                                        ? '#cc3399'
                                                        : 'black',
                                            }}
                                        >
                                            {item[0]}: {item[1]}
                                        </View>
                                    ))}
                                </AtCard>
                            </View>
                        )}
                        {admiExplanation && surgicalIndex > 0 && (
                            <View style={{ marginTop: '15PX' }}>
                                <AtCard title="术后(手术类）">
                                    {diseaseArray.slice(29, 47).map((item, i) => (
                                        <View
                                            style={{
                                                color:
                                                    i + 29 === admiDiseaseIndex
                                                        ? '#cc3399'
                                                        : 'black',
                                            }}
                                        >
                                            {item[0]}: {item[1]}
                                        </View>
                                    ))}
                                </AtCard>
                                <AtCard title="其他(手术类）">
                                    {diseaseArray.slice(47).map((item, i) => (
                                        <View
                                            style={{
                                                color:
                                                    i + 47 === admiDiseaseIndex
                                                        ? '#cc3399'
                                                        : 'black',
                                            }}
                                        >
                                            {item[0]}: {item[1]}
                                        </View>
                                    ))}
                                </AtCard>
                            </View>
                        )}
                    </AtTabsPane>
                    <AtTabsPane current={currentTab} index={2}>
                        <View style={{ margin: 'auto -5PX -10PX -5PX' }}>
                            <AtSwitch
                                title="查看慢性病说明"
                                checked={showChronic}
                                onChange={(v) => {
                                    setShowChronic(v);
                                }}
                                border={false}
                            />
                        </View>
                        <Chronic
                            index={chronicIndex}
                            setIndex={setChronicIndex}
                            scores={chronicScores}
                            showExplanation={showChronic}
                        />
                    </AtTabsPane>
                </AtTabs>
            </View>
        </View>
    );
}
