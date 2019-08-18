import Taro, { useState } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useDispatch, useSelector } from '@tarojs/redux';
import { AtForm, AtInput, AtButton, AtSwitch, AtMessage } from 'taro-ui';

import { add } from '../../actions/patient';
import { zeroValue } from '../../reducers/patient';
import { useStringField } from '../../utils';
import { test_100_299, test_1_99, test_20_299, selector, testNumber_16_139 } from './config';
import FormField from '../../components/FormField';
import './index.scss';
import uuid from '../../utils/uuid';
import { IReducers } from '../../reducers';

const dispatch = useDispatch();

export default function Patient() {
    const { index, data } = useSelector((state: IReducers) => state.patients);

    const defaultValue = index === undefined ? zeroValue() : data[index];

    const [name, setName, validateName] = useStringField(defaultValue.name, '名字不能为空');
    const [hospId, setHospID, validateHospId] = useStringField(
        defaultValue.hospId,
        '病案号不能为空'
    );
    const [isMale, setIsMale] = useState(true);
    const [age, setAge, validateAge] = useStringField(
        defaultValue.age === 0 ? '' : defaultValue.age.toString(),
        '年龄需在16-139之间',
        testNumber_16_139
    );
    const [bed, setBed, validateBed] = useStringField(
        defaultValue.bed === 0 ? '' : defaultValue.bed.toString(),
        '床号在1-100之间',
        test_1_99
    );
    const [height, setHeigt, validateHeight] = useStringField(
        defaultValue.height === 0 ? '' : defaultValue.height.toString(),
        '身高在100-299之间',
        test_100_299
    );

    const [admittime, setAdmittime] = useState(defaultValue.admittime);
    const [enrolltime, setEnrolltime] = useState(defaultValue.enrolltime);

    const [weight, setWeight, validateWeight] = useStringField(
        defaultValue.weight === 0 ? '' : defaultValue.weight.toFixed(2),
        '体重在20-299',
        test_20_299
    );

    const [pickerIndex, setPickerIndex] = useState(defaultValue.diagnoseIndex);
    const [needVesopressor, setNeedVesopressor] = useState(defaultValue.needVesopressor);
    const [needVentilation, setNeedVentilation] = useState(defaultValue.needVentilation);
    const [apache2, setApache2, validateApache2] = useStringField(
        defaultValue.apache2 === 0 ? '' : defaultValue.apache2.toString(),
        'ApacheII分值在0~71分',
        (v: string) => {
            const num = parseInt(v, 10);
            return !Number.isNaN(num) && num >= 0 && num <= 71;
        }
    );
    const [agi, setAgi, validateAGI] = useStringField(
        defaultValue.agi === 0 ? '' : defaultValue.agi.toString(),
        'AGI评分0-4',
        (v: string) => {
            const num = parseInt(v, 10);
            return !Number.isNaN(num) && num >= 0 && num <= 4;
        }
    );
    const [nrs2002, setNrs2002, validateNRS2002] = useStringField(
        defaultValue.nrs2002 === 0 ? '' : defaultValue.nrs2002.toString(),
        'NRS2002评分不能为空'
    );

    const onSubmit = () => {
        if (
            validateHospId() &&
            validateName() &&
            validateAge() &&
            validateBed() &&
            validateHeight() &&
            validateWeight() &&
            validateApache2() &&
            validateAGI() &&
            validateNRS2002()
        ) {
            dispatch(
                add({
                    rowid: uuid(),
                    hospId,
                    name,
                    age: parseInt(age, 10),
                    isMale,
                    bed: parseInt(bed, 10),
                    admittime,
                    enrolltime,
                    height: parseInt(height, 10),
                    weight: parseInt(weight, 10),
                    diagnoseIndex: pickerIndex,
                    needVesopressor,
                    needVentilation,
                    apache2: parseInt(apache2, 10),
                    agi: parseInt(agi, 10),
                    nrs2002: parseInt(nrs2002, 10),
                })
            );
        }
    };

    return (
        <View>
            <AtMessage />
            <AtForm onSubmit={onSubmit} onReset={() => {}}>
                <AtInput
                    name="hospId"
                    title="病案号:"
                    type="text"
                    value={hospId}
                    onChange={(v: string) => setHospID(v)}
                />
                <AtInput
                    name="name"
                    title="姓名:"
                    type="text"
                    value={name}
                    autoFocus={true}
                    onChange={(v: string) => setName(v)}
                />
                <AtSwitch
                    title={`性别(${isMale ? '男' : '女'}): `}
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
                <Picker mode="date" value={admittime} onChange={e => setAdmittime(e.detail.value)}>
                    <FormField name="入院时间" value={admittime} />
                </Picker>
                <Picker
                    mode="date"
                    value={enrolltime}
                    onChange={e => setEnrolltime(e.detail.value)}
                >
                    <FormField name="入组时间" value={enrolltime} />
                </Picker>
                <AtInput
                    name="height"
                    title="身高(cm):"
                    type="number"
                    placeholder="100-250"
                    value={height}
                    onChange={(v: string) => setHeigt(v)}
                />
                <AtInput
                    name="weight"
                    title="体重(Kg):"
                    type="digit"
                    placeholder="30-300"
                    value={weight}
                    onChange={(v: string) => setWeight(v)}
                />
                <Picker
                    mode="selector"
                    range={selector}
                    value={pickerIndex}
                    onChange={e => setPickerIndex(e.detail.value)}
                >
                    <FormField name="主要诊断" value={selector[pickerIndex]} />
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
                    {index === undefined ? '提交' : '修改'}
                </AtButton>
                <AtButton
                    type="primary"
                    className="margin-top-1px"
                    onClick={() => Taro.navigateTo({ url: '/pages/grid/index' })}
                >
                    进入项目
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
