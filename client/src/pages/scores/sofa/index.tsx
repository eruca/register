import Taro, { useState, useMemo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtListItem, AtList, AtRadio, AtNoticebar, AtInput, AtMessage, AtIcon } from 'taro-ui';

const pO2Unit = ['mmHg', 'kPa'];
const ecof = 7.50062;

export default function Sofa() {
    const [weight, setWeight] = useState(0);

    // 呼吸系统
    const [respBarOpen, setRespBarOpen] = useState<boolean>(false);
    const [pO2, setPO2] = useState(0);
    const [pO2UnitIndex, setpO2UnitIndex] = useState<0 | 1>(0);
    const [fio2, setFio2] = useState(21);
    const [respSupport, setRespSupport] = useState(false);

    const [platelets, setPletelets] = useState(0);
    const [gcs, setGCS] = useState(15);
    // 胆红素
    const [bilirubin, setBilirubin] = useState(0);
    const [bilirubinBarOpen, setBilirubinBarOpen] = useState(false);
    // 肌酐
    const [creatinine, setCreatinine] = useState(0);
    const [creatinieBarOpen, setCreatinineBarOpen] = useState(false);
    // 血流动力学开关
    const [dynSwitch, setDynSwitch] = useState(false);
    // 是否使用血管活性药物
    // const [useVasoactive, setUseVasoactive] = useState(false);
    // 平均动脉压 ≥ 70
    const [map70, setMap70] = useState(false);
    // 多巴酚丁胺是否使用
    const [DOBUTamine, setDOBUTamine] = useState(false);
    // 多巴胺
    const [useDOPamine, setUseDOPamine] = useState(false);
    const [dopamine, setDopamine] = useState<number>(0);
    const [dopamineSolute, setDopamineSolute] = useState<number>(0);
    const [dopamineVelocity, setDopamineVelocity] = useState<number>(0);
    // 肾上腺素
    const [useEPINEPHrine, setUseEPINEPHrine] = useState(false);
    const [EPINEPHrine, setEPINEPHrine] = useState<number>(0);
    const [EPINEPHrineSolute, setEPINEPHrineSolute] = useState<number>(0);
    const [EPINEPHrineVelocity, setEPINEPHrineVelocity] = useState<number>(0);
    // 去甲肾上腺素
    const [useNorEPINEPHrine, setUseNorEPINEPHrine] = useState(false);
    const [NorEPINEPHrine, setNorEPINEPHrine] = useState<number>(0);
    const [NorEPINEPHrineSolute, setNorEPINEPHrineSolute] = useState<number>(0);
    const [NorEPINEPHrineVelocity, setNorEPINEPHrineVelocity] = useState<number>(0);

    // 呼吸系统得分
    const respScores = useMemo(() => calcRespScore(pO2, pO2UnitIndex, fio2, respSupport), [
        pO2,
        pO2UnitIndex,
        fio2,
        respSupport,
    ]);

    const bloodDynamicScore = useMemo(
        () =>
            getBloodDynamicScore(
                map70, // MAP >70
                weight,
                DOBUTamine, // 多巴酚丁胺
                useDOPamine,
                dopamine,
                dopamineSolute,
                dopamineVelocity,
                useEPINEPHrine,
                EPINEPHrine,
                EPINEPHrineSolute,
                EPINEPHrineVelocity,
                useNorEPINEPHrine,
                NorEPINEPHrine,
                NorEPINEPHrineSolute,
                NorEPINEPHrineVelocity
            ),
        [
            map70, // MAP >70
            weight,
            DOBUTamine, // 多巴酚丁胺
            useDOPamine,
            dopamine,
            dopamineSolute,
            dopamineVelocity,
            useEPINEPHrine,
            EPINEPHrine,
            EPINEPHrineSolute,
            EPINEPHrineVelocity,
            useNorEPINEPHrine,
            NorEPINEPHrine,
            NorEPINEPHrineSolute,
            NorEPINEPHrineVelocity,
        ]
    );

    const noreepinephrineScores = getNorepinephrineScore(
        weight,
        useNorEPINEPHrine,
        NorEPINEPHrine,
        NorEPINEPHrineSolute,
        NorEPINEPHrineVelocity
    );

    const dopamineScores = getDopamineScore(
        weight,
        useDOPamine,
        dopamine,
        dopamineSolute,
        dopamineVelocity
    );
    const epinephrineScores = getEpinephrineScore(
        weight,
        useEPINEPHrine,
        EPINEPHrine,
        EPINEPHrineSolute,
        EPINEPHrineVelocity
    );

    return (
        <View>
            <AtMessage />
            <AtNoticebar>
                {genNoticeBar(
                    pO2,
                    platelets,
                    weight,
                    useDOPamine,
                    useNorEPINEPHrine,
                    useEPINEPHrine,
                    gcs,
                    bloodDynamicScore,
                    respScores,
                    creatinine,
                    bilirubin
                )}
            </AtNoticebar>
            <AtList>
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '10PX',
                    }}
                >
                    <AtIcon size="25" color="#cc3399" value="settings" />
                    <AtInput
                        name="weight"
                        title="体重"
                        type="digit"
                        placeholder="请输入体重（kg)"
                        value={weight ? weight.toString() : ''}
                        onChange={(v: string) => setWeight(parseFloat(v))}
                        onBlur={() =>
                            weight > 200 && Taro.atMessage({ message: '体重错误', type: 'error' })
                        }
                    >
                        <View style={{ marginRight: '10PX' }}>kg</View>
                    </AtInput>
                </View>
                <AtListItem
                    title={`呼吸系统: ${pO2 > 0 ? respScores : '❌'}`}
                    isSwitch={true}
                    switchIsCheck={respBarOpen}
                    onSwitchChange={() => setRespBarOpen(!respBarOpen)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
                {respBarOpen && (
                    <View>
                        <AtInput
                            clear={true}
                            name="po2"
                            title="PO2"
                            type="digit"
                            placeholder="氧分压"
                            value={pO2 ? pO2.toString() : ''}
                            onChange={(v: string) => setPO2(parseFloat(v))}
                        >
                            <View
                                style={{ fontSize: '25', color: '#79A4FA' }}
                                onClick={() => {
                                    if (pO2UnitIndex === 0) {
                                        setPO2(pO2 / ecof);
                                    } else {
                                        setPO2(pO2 * ecof);
                                    }
                                    setpO2UnitIndex(pO2UnitIndex === 0 ? 1 : 0);
                                }}
                            >
                                {pO2Unit[pO2UnitIndex]}
                                <View
                                    className="at-icon at-icon-repeat-play"
                                    style={{ fontSize: '1.3em' }}
                                />
                            </View>
                        </AtInput>
                        <AtInput
                            name="fio2"
                            title="FiO2"
                            type="number"
                            placeholder="吸氧浓度"
                            value={fio2 ? fio2.toString() : ''}
                            onChange={(v: string) => setFio2(v ? parseInt(v, 10) : 0)}
                            onBlur={() =>
                                (fio2 > 100 || fio2 < 21) &&
                                Taro.atMessage({ message: '吸氧浓度错误', type: 'error' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>%</View>
                        </AtInput>
                        <AtListItem
                            title="呼吸支持"
                            isSwitch={true}
                            switchIsCheck={respSupport}
                            onSwitchChange={() => setRespSupport(!respSupport)}
                        />
                    </View>
                )}
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '12PX',
                    }}
                >
                    <AtIcon size="25" color="#79A4FA" value="lightning-bolt" />
                    <AtInput
                        name="platelets"
                        title="血小板计数"
                        type="digit"
                        placeholder="血小板计数"
                        value={platelets ? platelets.toString() : ''}
                        onChange={(v: string) => setPletelets(v ? parseInt(v, 10) : 0)}
                    >
                        <View style={{ marginRight: '10PX' }}>×10³/µL</View>
                    </AtInput>
                </View>
                <View
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginLeft: '5PX',
                    }}
                >
                    <AtIcon size="25" color="#79A4FA" value="lightning-bolt" />
                    <AtInput
                        name="gcs"
                        title="GCS评分"
                        type="number"
                        placeholder="GCS评分"
                        value={gcs ? gcs.toString() : ''}
                        onChange={(v: string) => setGCS(v ? parseInt(v, 10) : 0)}
                        onBlur={() =>
                            (gcs < 3 || gcs > 15) &&
                            Taro.atMessage({ message: 'gcs输入错误', type: 'error' })
                        }
                    >
                        <View style={{ marginRight: '10PX' }}>分</View>
                    </AtInput>
                </View>
                <AtListItem
                    title={`胆红素: ${bilirubin}`}
                    isSwitch={true}
                    switchIsCheck={bilirubinBarOpen}
                    onSwitchChange={() => setBilirubinBarOpen(!bilirubinBarOpen)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
                {bilirubinBarOpen && (
                    <AtRadio
                        options={[
                            { label: '➊ <1.2mg/dl(<20μmol/L) 单位下同', value: 0 },
                            { label: '➋ 1.2-1.9(20-30)', value: 1 },
                            { label: '➌ 2.0-5.9(33-101)', value: 2 },
                            { label: '➍ 6.0-11.9(102-204)', value: 3 },
                            { label: '➎ ≥12.0(>204)', value: 4 },
                        ]}
                        value={bilirubin}
                        onClick={(v) => setBilirubin(v)}
                    />
                )}
                <AtListItem
                    title={`肌酐: ${creatinine}`}
                    isSwitch={true}
                    switchIsCheck={creatinieBarOpen}
                    onSwitchChange={() => setCreatinineBarOpen(!creatinieBarOpen)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
                {creatinieBarOpen && (
                    <AtRadio
                        options={[
                            { label: '➊ <1.2mg/dl(<110μmol/L) 单位下同', value: 0 },
                            { label: '➋ 1.2-1.9(110-170)', value: 1 },
                            { label: '➌ 2.0-3.4(171-299)', value: 2 },
                            { label: '➍ 3.5-4.9(300-440) 或 24小时尿量<500ml', value: 3 },
                            { label: '➎ ≥12.0(>204) 或 24小时尿量<200ml', value: 4 },
                        ]}
                        value={creatinine}
                        onClick={(v) => setCreatinine(v)}
                    />
                )}
                <AtListItem
                    title={`血流动力学: ${bloodDynamicScore}`}
                    isSwitch={true}
                    switchIsCheck={dynSwitch}
                    onSwitchChange={() => setDynSwitch(!dynSwitch)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
                {dynSwitch && (
                    <View>
                        <AtListItem
                            title={`平均动脉压 ${map70 ? '≤' : '≥'} 70mmHg: ${Number(map70)}`}
                            isSwitch={true}
                            switchIsCheck={map70}
                            onSwitchChange={() => setMap70(!map70)}
                        />
                        <AtListItem
                            title={`多巴酚丁胺: ${DOBUTamine ? 2 : 0}`}
                            isSwitch={true}
                            switchIsCheck={DOBUTamine}
                            onSwitchChange={() => setDOBUTamine(!DOBUTamine)}
                        />
                        <AtListItem
                            title={`多巴胺: ${dopamineScores[1].toFixed(2)}ug/kg/min->${
                                dopamineScores[0]
                            }`}
                            isSwitch={true}
                            switchIsCheck={useDOPamine}
                            onSwitchChange={() => setUseDOPamine(!useDOPamine)}
                        />
                        {useDOPamine && (
                            <View>
                                <AtInput
                                    name="dopamine"
                                    title="多巴胺剂量:"
                                    type="digit"
                                    placeholder="多巴胺剂量"
                                    value={dopamine ? dopamine.toString() : ''}
                                    onChange={(v: string) => setDopamine(v ? parseInt(v, 10) : 0)}
                                >
                                    <View style={{ marginRight: '10PX' }}>微克(mcg)</View>
                                </AtInput>
                                <AtInput
                                    name="dopamineSolute"
                                    title="溶剂剂量:"
                                    type="digit"
                                    placeholder="水的剂量"
                                    value={dopamineSolute ? dopamineSolute.toString() : ''}
                                    onChange={(v: string) =>
                                        setDopamineSolute(v ? parseInt(v, 10) : 0)
                                    }
                                >
                                    <View style={{ marginRight: '10PX' }}>毫升(ml)</View>
                                </AtInput>
                                <AtInput
                                    name="dopamineVelocity"
                                    title="多巴胺走速:"
                                    type="digit"
                                    placeholder="多巴胺溶液走速"
                                    value={dopamineVelocity ? dopamineVelocity.toString() : ''}
                                    onChange={(v: string) =>
                                        setDopamineVelocity(v ? parseInt(v, 10) : 0)
                                    }
                                >
                                    <View style={{ marginRight: '10PX' }}>毫升/小时(ml/h)</View>
                                </AtInput>
                            </View>
                        )}
                        <AtListItem
                            title={`去甲肾上腺素: ${noreepinephrineScores[1].toFixed(
                                2
                            )}ug/kg/min->${noreepinephrineScores[0]}`}
                            isSwitch={true}
                            switchIsCheck={useNorEPINEPHrine}
                            onSwitchChange={() => setUseNorEPINEPHrine(!useNorEPINEPHrine)}
                        />
                        {useNorEPINEPHrine && (
                            <View>
                                <AtInput
                                    name="NorEPINEPHrine"
                                    title="去甲肾上腺素剂量:"
                                    type="digit"
                                    placeholder="去甲肾上腺素剂量"
                                    value={NorEPINEPHrine ? NorEPINEPHrine.toString() : ''}
                                    onChange={(v: string) =>
                                        setNorEPINEPHrine(v ? parseInt(v, 10) : 0)
                                    }
                                >
                                    <View style={{ marginRight: '10PX' }}>微克μg(mcg)</View>
                                </AtInput>
                                <AtInput
                                    name="NorEPINEPHrineSolute"
                                    title="溶剂剂量:"
                                    type="digit"
                                    placeholder="水的剂量"
                                    value={
                                        NorEPINEPHrineSolute ? NorEPINEPHrineSolute.toString() : ''
                                    }
                                    onChange={(v: string) =>
                                        setNorEPINEPHrineSolute(v ? parseInt(v, 10) : 0)
                                    }
                                >
                                    <View style={{ marginRight: '10PX' }}>毫升(ml)</View>
                                </AtInput>
                                <AtInput
                                    name="NorEPINEPHrineVelocity"
                                    title="去甲肾上腺素走速:"
                                    type="digit"
                                    placeholder="去甲肾上腺素溶液走速"
                                    value={
                                        NorEPINEPHrineVelocity
                                            ? NorEPINEPHrineVelocity.toString()
                                            : ''
                                    }
                                    onChange={(v: string) =>
                                        setNorEPINEPHrineVelocity(v ? parseInt(v, 10) : 0)
                                    }
                                >
                                    <View style={{ marginRight: '10PX' }}>毫升/小时(ml/h)</View>
                                </AtInput>
                            </View>
                        )}
                        <AtListItem
                            title={`肾上腺素: ${epinephrineScores[1].toFixed(2)}ug/kg/min->${
                                epinephrineScores[0]
                            }`}
                            isSwitch={true}
                            switchIsCheck={useEPINEPHrine}
                            onSwitchChange={() => setUseEPINEPHrine(!useEPINEPHrine)}
                        />
                        {useEPINEPHrine && (
                            <View>
                                <AtInput
                                    name="EPINEPHrine"
                                    title="肾上腺素剂量:"
                                    type="digit"
                                    placeholder="肾上腺素剂量"
                                    value={EPINEPHrine ? EPINEPHrine.toString() : ''}
                                    onChange={(v: string) =>
                                        setEPINEPHrine(v ? parseInt(v, 10) : 0)
                                    }
                                >
                                    <View style={{ marginRight: '10PX' }}>微克(mcg)</View>
                                </AtInput>
                                <AtInput
                                    name="EPINEPHrineSolute"
                                    title="溶剂剂量:"
                                    type="digit"
                                    placeholder="水的剂量"
                                    value={EPINEPHrineSolute ? EPINEPHrineSolute.toString() : ''}
                                    onChange={(v: string) =>
                                        setEPINEPHrineSolute(v ? parseInt(v, 10) : 0)
                                    }
                                >
                                    <View style={{ marginRight: '10PX' }}>毫升(ml)</View>
                                </AtInput>
                                <AtInput
                                    name="EPINEPHrineVelocity"
                                    title="肾上腺素走速:"
                                    type="digit"
                                    placeholder="肾上腺素溶液走速"
                                    value={
                                        EPINEPHrineVelocity ? EPINEPHrineVelocity.toString() : ''
                                    }
                                    onChange={(v: string) =>
                                        setEPINEPHrineVelocity(v ? parseInt(v, 10) : 0)
                                    }
                                >
                                    <View style={{ marginRight: '10PX' }}>毫升/小时(ml/h)</View>
                                </AtInput>
                            </View>
                        )}
                    </View>
                )}
            </AtList>
        </View>
    );
}

// 计算呼吸系统得分
function calcRespScore(
    pO2: number,
    pO2UnitIndex: 0 | 1,
    fiO2: number,
    respSupport: boolean
): number {
    // 如果是kpa需要转化为mmHg
    if (pO2UnitIndex === 1) {
        pO2 *= ecof;
    }
    const oxygenation_index = pO2 / (fiO2 / 100); // 21 => 0.21

    let score = 0;
    if (oxygenation_index >= 400) {
        score = 0;
    } else if (oxygenation_index >= 300) {
        score = 1;
    } else if (oxygenation_index >= 200) {
        score = 2;
    } else if (oxygenation_index >= 100) {
        score = 3;
    } else {
        score = 4;
    }

    if (respSupport) {
        score = Math.max(score, 3);
    }
    return score;
}
// 多巴胺得分
function getDopamineScore(
    weight: number,
    useDOPamine: boolean,
    dopamine: number,
    dopamineSolute: number,
    dopamineVelocity: number
): [number, number] {
    // 溶剂/速度 * 60
    let dopamineScore = 0;
    let dopamineLevel = 0;
    if (useDOPamine) {
        if (dopamine === 0 || dopamineSolute === 0 || dopamineVelocity === 0) {
            return [3, 0];
        }
        dopamineLevel = dopamine / weight / ((dopamineSolute / dopamineVelocity) * 60);
        dopamineScore = dopamineLevel <= 5 ? 2 : dopamineLevel > 15 ? 4 : 3;
    }
    return [dopamineScore, dopamineLevel];
}

// 肾上腺素得分
function getEpinephrineScore(
    weight: number,
    useEPINEPHrine: boolean,
    EPINEPHrine: number,
    EPINEPHrineSolute: number,
    EPINEPHrineVelocity: number
): [number, number] {
    let epinephrineScore = 0;
    let epinephrineLevel = 0;
    if (useEPINEPHrine) {
        if (EPINEPHrine === 0 || EPINEPHrineSolute === 0 || EPINEPHrineVelocity === 0) {
            return [3, 0];
        }
        epinephrineLevel = EPINEPHrine / weight / ((EPINEPHrineSolute / EPINEPHrineVelocity) * 60);
        epinephrineScore = epinephrineLevel <= 0.1 ? 3 : 4;
    }
    return [epinephrineScore, epinephrineLevel];
}

// 去甲肾上腺素得分
function getNorepinephrineScore(
    weight: number,
    useNorEPINEPHrine: boolean,
    NorEPINEPHrine: number,
    NorEPINEPHrineSolute: number,
    NorEPINEPHrineVelocity: number
): [number, number] {
    let norepinephrineScore = 0;
    let norepinephrineLevel = 0;
    if (useNorEPINEPHrine) {
        if (NorEPINEPHrine === 0 || NorEPINEPHrineSolute === 0 || NorEPINEPHrineVelocity === 0) {
            return [3, 0];
        }
        norepinephrineLevel =
            NorEPINEPHrine / weight / ((NorEPINEPHrineSolute / NorEPINEPHrineVelocity) * 60);
        norepinephrineScore = norepinephrineLevel <= 0.1 ? 3 : 4;
    }
    return [norepinephrineScore, norepinephrineLevel];
}

// 计算血流动力学系统得分
function getBloodDynamicScore(
    map70: boolean, // MAP<70
    weight: number,
    DOBUTamine: boolean, // 多巴酚丁胺
    useDOPamine: boolean,
    dopamine: number,
    dopamineSolute: number,
    dopamineVelocity: number,
    useEPINEPHrine: boolean,
    EPINEPHrine: number,
    EPINEPHrineSolute: number,
    EPINEPHrineVelocity: number,
    useNorEPINEPHrine: boolean,
    NorEPINEPHrine: number,
    NorEPINEPHrineSolute: number,
    NorEPINEPHrineVelocity: number
): number {
    // 没有使用血管活性药物
    const mapScore = map70 ? 1 : 0;

    // 使用血管活性药物

    // 多巴酚丁胺得分
    const dobutamineScore = DOBUTamine ? 2 : 0;
    // 多巴胺得分 溶剂/速度 * 60
    let dopamineScore = getDopamineScore(
        weight,
        useDOPamine,
        dopamine,
        dopamineSolute,
        dopamineVelocity
    );

    // 肾上腺素得分
    let epinephrineScore = getEpinephrineScore(
        weight,
        useEPINEPHrine,
        EPINEPHrine,
        EPINEPHrineSolute,
        EPINEPHrineVelocity
    );

    // 去甲肾上腺素得分
    let norepinephrineScore = getNorepinephrineScore(
        weight,
        useNorEPINEPHrine,
        NorEPINEPHrine,
        NorEPINEPHrineSolute,
        NorEPINEPHrineVelocity
    );

    return Math.max(
        mapScore,
        dobutamineScore,
        dopamineScore[0],
        epinephrineScore[0],
        norepinephrineScore[0]
    );
}

function getGcsScore(gcs: number): number {
    if (gcs === 15) {
        return 0;
    } else if (gcs >= 13) {
        return 1;
    } else if (gcs >= 10) {
        return 2;
    } else if (gcs >= 6) {
        return 3;
    } else {
        return 4;
    }
}

function getPlatteleteScore(platelets: number): number {
    if (platelets > 149) {
        return 0;
    } else if (platelets >= 100) {
        return 1;
    } else if (platelets >= 50) {
        return 2;
    } else if (platelets >= 20) {
        return 3;
    } else {
        return 4;
    }
}

// 产生计算结果的公式
function genNoticeBar(
    pO2: number,
    platelets: number,
    weight: number,
    useDOPamine: boolean,
    useNorEPINEPHrine: boolean,
    useEPINEPHrine: boolean,
    gcs: number,
    bloodDynamicScore: number,
    respScores: number,
    creatinine: number,
    bilirubin: number
): string {
    if (pO2 === 0 || platelets === 0) {
        return '请填写完整';
    }
    if ((useDOPamine || useNorEPINEPHrine || useEPINEPHrine) && weight === 0) {
        return '请填写体重';
    }

    return `GCS:${getGcsScore(
        gcs
    )}+血压:${bloodDynamicScore}+呼吸:${respScores}+肌酐:${creatinine}+胆红素:${bilirubin}+血小板:${getPlatteleteScore(
        platelets
    )} = ${
        getGcsScore(gcs) +
        bloodDynamicScore +
        respScores +
        creatinine +
        bilirubin +
        getPlatteleteScore(platelets)
    }`;
}

Sofa.config = {
    navigationBarTitleText: 'SOFA评分',
};
