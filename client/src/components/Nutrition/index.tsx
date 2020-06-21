import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtList, AtMessage, AtNoticebar, AtInput, AtListItem } from 'taro-ui';

export default function Nutrition() {
    // 肠外葡萄糖
    const [pnGs, setPnGs] = useState(false);
    const [pngs5, setPnGs5] = useState(0);
    const [pngs10, setPnGs10] = useState(0);
    const [pngs50, setPnGs50] = useState(0);

    // 肠内葡萄糖
    const [enGs, setEnGs] = useState(false);
    const [engs5, setEnGs5] = useState(0);
    const [engs10, setEnGs10] = useState(0);
    const [engs50, setEnGs50] = useState(0);

    // 氨基酸
    const [useAmino, setUseAmino] = useState(false);
    const [amino5, setAmino5] = useState(0);
    const [amino8_5, setAmino8_5] = useState(0);
    const [amino10, setAmino10] = useState(0);

    // 肠内制剂
    const [useEN, setUseEN] = useState(false);
    const [百普力, set百普力] = useState(0);
    const [能全力, set能全力] = useState(0);
    const [高能能全力, set高能能全力] = useState(0);
    const [康全力, set康全力] = useState(0);
    const [瑞代, set瑞代] = useState(0);

    // 肠外制剂
    const [usePN, setUsePN] = useState(false);
    const [卡文, set卡文] = useState(0);
    const [力保肪宁, set力保肪宁] = useState(0);

    const pngsCalories = (0.05 * pngs5 + 0.1 * pngs10 + 0.5 * pngs50) * 4;
    const engsCalories = (0.05 * engs5 + 0.1 * engs10 + 0.5 * engs50) * 4;

    const amino = 0.05 * amino5 + 0.085 * amino8_5 + 0.1 * amino10;
    const enCalories = 百普力 + 能全力 + 1.5 * 高能能全力 + 0.75 * 康全力 + 0.9 * 瑞代;
    const enAmino =
        (20 / 500) * 百普力 +
        (20 / 500) * 能全力 +
        (30 / 500) * 高能能全力 +
        (16 / 500) * 康全力 +
        (17 / 500) * 瑞代;

    const pnCalories = (卡文 / 1440) * 1000 + 力保肪宁 * 1.908;
    const pnAmino = (卡文 / 1440) * 34;

    return (
        <View>
            <AtMessage />
            <AtNoticebar>{`热卡:${(pngsCalories + engsCalories + enCalories + pnCalories).toFixed(
                2
            )}kcal,蛋白:${(amino + enAmino + pnAmino).toFixed(2)}g`}</AtNoticebar>
            <AtList>
                <AtListItem
                    title={`肠外葡萄糖: ${pngsCalories.toFixed(2)}kcal `}
                    isSwitch={true}
                    switchIsCheck={pnGs}
                    onSwitchChange={() => setPnGs(!pnGs)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
                {pnGs && (
                    <View>
                        <AtInput
                            clear={true}
                            name="5%gs"
                            title="5%GS"
                            type="digit"
                            placeholder="请输入注射5%GS(ml)"
                            value={pngs5 ? pngs5.toString() : ''}
                            onChange={(v: string) => setPnGs5(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                engs5 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                        <AtInput
                            clear={true}
                            name="10%gs"
                            title="10%GS"
                            type="digit"
                            placeholder="请输入注射10%GS(ml)"
                            value={pngs10 ? pngs10.toString() : ''}
                            onChange={(v: string) => setPnGs10(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                pngs10 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>

                        <AtInput
                            clear={true}
                            name="50%gs"
                            title="50%GS"
                            type="digit"
                            placeholder="请输入注射50%GS(ml)"
                            value={pngs50 ? pngs50.toString() : ''}
                            onChange={(v: string) => setPnGs50(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                pngs50 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                    </View>
                )}

                <AtListItem
                    title={`肠内葡萄糖: ${engsCalories.toFixed(2)}kcal`}
                    isSwitch={true}
                    switchIsCheck={enGs}
                    onSwitchChange={() => setEnGs(!enGs)}
                    iconInfo={{ size: 25, color: 'orangered', value: 'lightning-bolt' }}
                />
                {enGs && (
                    <View>
                        <AtInput
                            name="5%gs"
                            title="1. 5%GS"
                            type="digit"
                            placeholder="请输入肠内5%GS(ml)"
                            value={engs5 ? engs5.toString() : ''}
                            onChange={(v: string) => setEnGs5(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                engs5 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                        <AtInput
                            name="10%gs"
                            title="2. 10%GS"
                            type="digit"
                            placeholder="请输入肠内10%GS(ml)"
                            value={engs10 ? engs10.toString() : ''}
                            onChange={(v: string) => setEnGs10(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                engs10 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                        <AtInput
                            name="50%gs"
                            title="3. 50%GS"
                            type="digit"
                            placeholder="请输入肠内50%GS(ml)"
                            value={engs50 ? engs50.toString() : ''}
                            onChange={(v: string) => setEnGs50(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                engs50 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                    </View>
                )}

                <AtListItem
                    title={`注射氨基酸: ${amino.toFixed(2)}g`}
                    isSwitch={true}
                    switchIsCheck={useAmino}
                    onSwitchChange={() => setUseAmino(!useAmino)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
                {useAmino && (
                    <View>
                        <AtInput
                            clear={true}
                            name="5%amino"
                            title="5%氨基酸"
                            type="digit"
                            placeholder="请输入5%氨基酸(ml)"
                            value={amino5 ? amino5.toString() : ''}
                            onChange={(v: string) => setAmino5(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                amino5 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                        <AtInput
                            clear={true}
                            name="8.5%amino"
                            title="8.5%氨基酸"
                            type="digit"
                            placeholder="请输入8.5%氨基酸(ml)"
                            value={amino8_5 ? amino8_5.toString() : ''}
                            onChange={(v: string) => setAmino8_5(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                amino8_5 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                        <AtInput
                            clear={true}
                            name="10%amino"
                            title="10%氨基酸"
                            type="digit"
                            placeholder="请输入10%氨基酸(ml)"
                            value={amino10 ? amino10.toString() : ''}
                            onChange={(v: string) => setAmino10(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                amino10 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                    </View>
                )}

                <AtListItem
                    title={`肠内制剂: ${enCalories.toFixed(2)}kcal,${enAmino.toFixed(2)}g`}
                    isSwitch={true}
                    switchIsCheck={useEN}
                    onSwitchChange={() => setUseEN(!useEN)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
                {useEN && (
                    <View>
                        <AtInput
                            name="百普力"
                            title="百普力"
                            type="digit"
                            placeholder="请输入百普力(ml)"
                            value={百普力 ? 百普力.toString() : ''}
                            onChange={(v: string) => set百普力(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                百普力 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>

                        <AtInput
                            name="能全力"
                            title="能全力"
                            type="digit"
                            placeholder="请输入能全力(ml)"
                            value={能全力 ? 能全力.toString() : ''}
                            onChange={(v: string) => set能全力(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                能全力 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>

                        <AtInput
                            name="高能能全力"
                            title="高能能全力"
                            type="digit"
                            placeholder="请输入高能能全力(ml)"
                            value={高能能全力 ? 高能能全力.toString() : ''}
                            onChange={(v: string) => set高能能全力(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                高能能全力 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>

                        <AtInput
                            name="康全力"
                            title="康全力"
                            type="digit"
                            placeholder="请输入康全力(ml)"
                            value={康全力 ? 康全力.toString() : ''}
                            onChange={(v: string) => set康全力(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                康全力 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                        <AtInput
                            name="瑞代"
                            title="瑞代"
                            type="digit"
                            placeholder="请输入瑞代(ml)"
                            value={瑞代 ? 瑞代.toString() : ''}
                            onChange={(v: string) => set瑞代(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                瑞代 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                    </View>
                )}

                <AtListItem
                    title={`肠外制剂: ${pnCalories.toFixed(2)}kcal, ${pnAmino.toFixed(2)}g`}
                    isSwitch={true}
                    switchIsCheck={usePN}
                    onSwitchChange={() => setUsePN(!usePN)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
                {usePN && (
                    <View>
                        <AtInput
                            name="卡文"
                            title="卡文(1440ml)"
                            type="digit"
                            placeholder="请输入卡文(ml)"
                            value={卡文 ? 卡文.toString() : ''}
                            onChange={(v: string) => set卡文(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                卡文 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                        <AtInput
                            name="力保肪宁"
                            title="力保肪宁"
                            type="digit"
                            placeholder="请输入力保肪宁(ml)"
                            value={力保肪宁 ? 力保肪宁.toString() : ''}
                            onChange={(v: string) => set力保肪宁(v ? parseFloat(v) : 0)}
                            onBlur={() =>
                                力保肪宁 > 10000 &&
                                Taro.atMessage({ message: '输入是否错误', type: 'warning' })
                            }
                        >
                            <View style={{ marginRight: '10PX' }}>ml</View>
                        </AtInput>
                    </View>
                )}
            </AtList>
        </View>
    );
}
