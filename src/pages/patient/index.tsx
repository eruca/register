import Taro, { useState, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import dayjs from 'dayjs';

import { AtForm, AtInput, AtButton, AtSwitch, AtMessage, AtCalendar, AtModal } from 'taro-ui';
import {
    useStringField,
    test_100_299,
    test_1_99,
    test_20_299,
    selector,
    null_func,
    testNumber_16_139,
} from './config';

export default function Patient() {
    const [name, setName, validateName] = useStringField('', '名字不能为空');
    const [hospId, setHospID, validateHospId] = useStringField('', '病案号不能为空');
    const [isMale, setIsMale] = useState(true);
    const [age, setAge, validateAge] = useStringField('', '年龄需在16-139之间', testNumber_16_139);
    const [bed, setBed, validateBed] = useStringField('', '床号在1-100之间', test_1_99);
    const [height, setHeigt, validateHeight] = useStringField(
        '',
        '身高在100-299之间',
        test_100_299
    );

    const [admittime, setAdmittime] = useState(dayjs().format('YYYY-MM-DD'));
    const [isOpen, setIsOpen] = useState(false);
    const setOpen = useCallback(() => setIsOpen(true), [setIsOpen]);

    const [weight, setWeight, validateWeight] = useStringField('', '体重在20-299', test_20_299);

    const [pickerIndex, setPickerIndex] = useState(0);
    const [needVesopressor, setNeedVesopressor] = useState(false);
    const [needVentilation, setNeedVentilation] = useState(false);
    const [apache2, setApache2, validateApache2] = useStringField(
        '',
        'ApacheII分值在0~71分',
        (v: string) => {
            const num = parseInt(v, 10);
            return !Number.isNaN(num) && num >= 0 && num <= 71;
        }
    );
    const [agi, setAgi, validateAGI] = useStringField('', 'AGI评分0-4', (v: string) => {
        const num = parseInt(v, 10);
        return !Number.isNaN(num) && num >= 0 && num <= 4;
    });
    const [nrs2002, setNrs2002, validateNRS2002] = useStringField('', 'NRS2002评分不能为空');

    const onSubmit = () => {
        if (
            validateName() &&
            validateHospId() &&
            validateAge() &&
            validateBed() &&
            validateHeight() &&
            validateWeight() &&
            validateApache2() &&
            validateAGI() &&
            validateNRS2002()
        ) {
            console.log('submit');
        }
    };

    return (
        <View>
            <AtMessage />
            <AtForm onSubmit={onSubmit} onReset={() => {}}>
                <AtInput
                    name="name"
                    title="姓名:"
                    type="text"
                    value={name}
                    autoFocus={true}
                    onChange={(v: string) => setName(v)}
                />
                <AtInput
                    name="hospId"
                    title="病案号:"
                    type="text"
                    value={hospId}
                    onChange={(v: string) => setHospID(v)}
                />
                <AtSwitch
                    title={`性别: ${isMale ? '男' : '女'}`}
                    checked={isMale}
                    onChange={v => setIsMale(v)}
                />
                <AtInput
                    name="age"
                    title="年龄(岁):"
                    type="text"
                    placeholder="1-139"
                    value={age}
                    onChange={(v: string) => setAge(v)}
                />
                <AtInput
                    name="bed"
                    title="床号:"
                    type="text"
                    placeholder="1-100"
                    value={bed}
                    onChange={(v: string) => setBed(v)}
                />
                <AtInput
                    name="admittime"
                    title="入院时间"
                    type="text"
                    value={admittime}
                    onFocus={setOpen}
                    onChange={setOpen}
                />
                <AtInput
                    name="height"
                    title="身高(cm):"
                    type="text"
                    placeholder="100-250"
                    value={height}
                    onChange={(v: string) => setHeigt(v)}
                />
                <AtInput
                    name="weight"
                    title="体重(Kg):"
                    type="text"
                    placeholder="30-300"
                    value={weight}
                    onChange={(v: string) => setWeight(v)}
                />
                <AtModal isOpened={isOpen} onClose={() => setIsOpen(false)}>
                    <AtCalendar
                        onDayClick={(item: { value: string }) => {
                            setAdmittime(item.value);
                            setIsOpen(false);
                        }}
                    />
                </AtModal>
                <Picker
                    mode="selector"
                    range={selector}
                    value={pickerIndex}
                    onChange={e => setPickerIndex(e.detail.value)}
                >
                    <AtInput
                        name="disease"
                        title="主要诊断:"
                        type="text"
                        value={selector[pickerIndex]}
                        onChange={null_func}
                    />
                </Picker>
                <AtSwitch
                    title="需要升压药"
                    checked={needVesopressor}
                    onChange={v => setNeedVesopressor(v)}
                />
                <AtSwitch
                    title="需要机械通气"
                    checked={needVentilation}
                    onChange={v => setNeedVentilation(v)}
                />
                <AtInput
                    name="apache2"
                    title="Apache II:"
                    type="text"
                    placeholder="0-71"
                    value={apache2}
                    onChange={(v: string) => setApache2(v)}
                />
                <AtInput
                    name="agi"
                    title="AGI:"
                    type="text"
                    placeholder="0-4"
                    value={agi}
                    onChange={(v: string) => setAgi(v)}
                />
                <AtInput
                    name="nrs2002"
                    title="NRS2002:"
                    type="text"
                    placeholder="不能为空"
                    value={nrs2002}
                    onChange={(v: string) => setNrs2002(v)}
                />
                <AtButton type="primary" formType="submit">
                    提交
                </AtButton>
            </AtForm>
        </View>
    );
}

Patient.config = {
    navigationBarTitleText: '登记内容',
};

Patient.options = {
    addGlobalClass: true,
};
