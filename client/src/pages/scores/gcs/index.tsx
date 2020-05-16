import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtListItem, AtList, AtRadio, AtNoticebar } from 'taro-ui';

export default function GCS() {
    const [eyeValue, setEyeValue] = useState(4);
    const [eyeBarOpen, setEyeBarOpen] = useState(true);
    const [voiceValue, setVoiceValue] = useState(5);
    const [voiceBarOpen, setVoiceBarOpen] = useState(true);
    const [actionValue, setActionValue] = useState(6);
    const [actionBarOpen, setActionBarOpen] = useState(true);

    return (
        <View>
            <AtNoticebar>{`${eyeValue} + ${voiceValue} + ${actionValue} = ${
                eyeValue + voiceValue + actionValue
            }`}</AtNoticebar>
            <AtList>
                <AtListItem
                    title={`眨眼: ${eyeValue}`}
                    isSwitch={true}
                    switchIsCheck={eyeBarOpen}
                    onSwitchChange={() => setEyeBarOpen(!eyeBarOpen)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'eye' }}
                />
            </AtList>
            {eyeBarOpen && (
                <AtRadio
                    options={[
                        { label: '正常睁眼(4)', value: 4 },
                        { label: '呼唤睁眼(3)', value: 3 },
                        { label: '刺痛睁眼(2)', value: 2 },
                        { label: '无睁眼(1)', value: 1 },
                    ]}
                    value={eyeValue}
                    onClick={(v) => setEyeValue(v)}
                />
            )}
            <AtList>
                <AtListItem
                    title={`语言: ${voiceValue}`}
                    isSwitch={true}
                    switchIsCheck={voiceBarOpen}
                    onSwitchChange={() => setVoiceBarOpen(!voiceBarOpen)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'volume-plus' }}
                />
            </AtList>
            {voiceBarOpen && (
                <AtRadio
                    options={[
                        { label: '正常回答(5)', value: 5 },
                        { label: '错误回答(4)', value: 4 },
                        { label: '语言错乱(3)', value: 3 },
                        { label: '含糊不清(2)', value: 2 },
                        { label: '无反应(1)', value: 1 },
                    ]}
                    value={voiceValue}
                    onClick={(v) => setVoiceValue(v)}
                />
            )}
            <AtList>
                <AtListItem
                    title={`动作: ${actionValue}`}
                    isSwitch={true}
                    switchIsCheck={actionBarOpen}
                    onSwitchChange={() => setActionBarOpen(!actionBarOpen)}
                    iconInfo={{ size: 25, color: '#79A4FA', value: 'lightning-bolt' }}
                />
            </AtList>
            {actionBarOpen && (
                <AtRadio
                    options={[
                        { label: '遵嘱动作(6)', value: 6 },
                        { label: '刺痛定位(5)', value: 5 },
                        { label: '刺痛躲避(4)', value: 4 },
                        { label: '刺痛屈曲(3)', value: 3 },
                        { label: '刺痛过伸(2)', value: 2 },
                        { label: '刺痛无反应(1)', value: 1 },
                    ]}
                    value={actionValue}
                    onClick={(v) => setActionValue(v)}
                />
            )}
        </View>
    );
}

GCS.config = {
    navigationBarTitleText: 'GCS评分',
};
