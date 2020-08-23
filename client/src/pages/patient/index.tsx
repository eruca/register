import Taro, { useState, useEffect, useCallback } from '@tarojs/taro';
import { View, Picker } from '@tarojs/components';
import { useSelector, useDispatch } from '@tarojs/redux';
import {
    AtForm,
    AtInput,
    AtButton,
    AtSwitch,
    AtMessage,
    AtIcon,
    AtFloatLayout,
    AtListItem,
} from 'taro-ui';

import { zeroPatient, IPatient } from '../../reducers/patient';
import FormField from '../../components/FormField';
import NRS2002 from '../../components/NRS2002';
import Loading from '../../components/Loading';
import EnteralNutritionTolerance from '../../components/EnteralNutritionTolerance';
import { IReducers } from '../../reducers';
import { isCrew } from '../../reducers/user';
import { forceRerender } from '../../actions/user';
import { selector, LocalPatient, convertToLocal, convertToPatient, equal } from './config';
import { validate } from './validator';
// import { AGIs } from '../../constants/record';
import './index.scss';

export default function Patient() {
    const dispatch = useDispatch();
    const { patient_id, _openid, auth, force_rerender, projects } = useSelector(
        (state: IReducers) => ({
            ...state.patients,
            _openid: state.user._openid,
            force_rerender: state.user.force_rerender,
            auth: state.user.authority,
            projects: state.projects,
        })
    );

    // 作为从数据库下载下来的数据
    const [finalPatient, setFinalPatient] = useState<LocalPatient>(convertToLocal(zeroPatient()));
    const [patient, setPatient] = useState<LocalPatient>(convertToLocal(zeroPatient()));
    // 现在有2个浮层，用0 => 关闭， 1 => NRS2002, 2 => EnteralNutritionTolenance
    const [floatLay, setFloatLay] = useState(0);

    const [projectSwitch, setProjectSwitch] = useState(true);
    const currIndex = projects.indexOf(patient.projectName);
    console.log('currIndex', currIndex);
    const [projectCurrIndex, setProjectCurrIndex] = useState(currIndex);

    // 控制submit 开关的按键
    const [submitDisable, setSubmitDisable] = useState(false);

    useEffect(() => setProjectCurrIndex(currIndex), [currIndex]);

    // 如果patient_id已被选择，就从数据库获取该patient数据
    useEffect(() => {
        if (isCrew(auth) && patient_id !== '') {
            Taro.cloud
                .database()
                .collection('patients')
                .doc(patient_id)
                .get({
                    success: (res) => {
                        setPatient(convertToLocal(res.data as IPatient));
                        setFinalPatient(convertToLocal(res.data as IPatient));
                    },
                    fail: console.error,
                });
        }
    }, [patient_id, auth, force_rerender, setPatient, setFinalPatient]);
    console.log('patient =>', patient, 'patient_id', patient_id);

    const onSubmit = useCallback(() => {
        const message = validate(patient);
        if (message !== '') {
            Taro.atMessage({ message, type: 'error' });
            return;
        }
        if (!isCrew(auth)) {
            return;
        }

        if (submitDisable === true) {
            return;
        }
        // disable 重复点击
        setSubmitDisable(true);

        if (patient_id === '') {
            Taro.cloud
                .database()
                .collection('patients')
                .add({
                    data: convertToPatient(patient),
                    success: function () {
                        Taro.atMessage({ message: '添加记录成功', type: 'success' });
                        setSubmitDisable(false);
                        // 添加成功，则再次从数据库获取统计信息
                        dispatch(forceRerender());
                    },
                    fail: function () {
                        console.error(arguments);
                        setSubmitDisable(false);
                    },
                });
        } else {
            Taro.cloud
                .database()
                .collection('patients')
                .doc(patient_id)
                .set({
                    data: convertToPatient(patient, false),
                    success: function () {
                        Taro.atMessage({ message: '修改记录成功', type: 'success' });
                        setSubmitDisable(false);
                        // 修改成功，则再次从数据库获取统计信息
                        dispatch(forceRerender());
                    },
                    fail: function () {
                        console.log(arguments);
                        setSubmitDisable(false);
                    },
                });
        }
    }, [patient, auth, patient_id, setSubmitDisable, submitDisable]);

    // 如果是已经有patient_id, 但是这个时候网络断了，那么就会出现这种情况
    return patient_id !== '' && !patient._id ? (
        <Loading />
    ) : (
        <View>
            <AtMessage />
            <AtForm onSubmit={onSubmit}>
                <AtInput
                    name="hospId"
                    title="病案号:"
                    type="number"
                    placeholder="请输入病案号或住院号"
                    value={patient.hospId}
                    onChange={useCallback((v: string) => setPatient({ ...patient, hospId: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <View style={{ display: 'flex', flexDirection: 'row', marginLeft: '2PX' }}>
                    {projectSwitch ? (
                        <View style={{ flexGrow: 1 }}>
                            <Picker
                                mode="selector"
                                range={projects || []}
                                value={projectCurrIndex}
                                onChange={(e) => {
                                    const index =
                                        typeof e.detail.value === 'number'
                                            ? e.detail.value
                                            : parseInt(e.detail.value, 10);
                                    setProjectCurrIndex(index);
                                    setPatient({ ...patient, projectName: projects[index] });
                                }}
                            >
                                <AtListItem
                                    title="请选择项目"
                                    extraText={projects[projectCurrIndex]}
                                />
                            </Picker>
                        </View>
                    ) : (
                        <View style={{ flexGrow: 1 }}>
                            <AtInput
                                name="projectName"
                                title="项目名称:"
                                type="text"
                                placeholder="新增项目"
                                value={patient.projectName}
                                onChange={useCallback(
                                    (v: string) => setPatient({ ...patient, projectName: v }),
                                    [patient, setPatient]
                                )}
                            />
                        </View>
                    )}
                    <View
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            margin: 'auto 20PX',
                        }}
                    >
                        <AtIcon
                            value={projectSwitch ? 'edit' : 'check'}
                            color="#79A4FA"
                            onClick={() => setProjectSwitch(!projectSwitch)}
                        />
                    </View>
                </View>
                <AtInput
                    name="name"
                    title="姓名:"
                    type="text"
                    placeholder="请输入姓名"
                    value={patient.name}
                    onChange={useCallback((v: string) => setPatient({ ...patient, name: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtSwitch
                    title={`性别(${patient.isMale ? '男' : '女'}): `}
                    checked={patient.isMale}
                    onChange={useCallback((v) => setPatient({ ...patient, isMale: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtInput
                    name="age"
                    title="年龄(岁):"
                    type="number"
                    placeholder="16-139"
                    value={patient.age === '0' && patient_id === '' ? '' : patient.age}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, age: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <AtInput
                    name="bed"
                    title="床号:"
                    type="number"
                    placeholder="1-100"
                    value={patient.bed === '0' && patient_id === '' ? '' : patient.bed}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, bed: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <Picker
                    mode="date"
                    value={patient.admittime}
                    onChange={useCallback(
                        (e) => setPatient({ ...patient, admittime: e.detail.value }),
                        [patient, setPatient]
                    )}
                >
                    <FormField name="入院时间" value={patient.admittime} />
                </Picker>
                <Picker
                    mode="date"
                    value={patient.enrolltime}
                    onChange={useCallback(
                        (e) => setPatient({ ...patient, enrolltime: e.detail.value }),
                        [patient, setPatient]
                    )}
                >
                    <FormField name="入组时间" value={patient.enrolltime} />
                </Picker>
                <AtInput
                    name="height"
                    title="身高(cm):"
                    type="number"
                    placeholder="100-250"
                    value={patient.height === '0' && patient_id === '' ? '' : patient.height}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, height: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <AtInput
                    name="weight"
                    title="体重(kg):"
                    type="digit"
                    placeholder="30-300"
                    value={patient.weight === '0' && patient_id === '' ? '' : patient.weight}
                    onChange={useCallback(
                        (v: string) => setPatient({ ...patient, weight: v ? v : '0' }),
                        [patient, setPatient]
                    )}
                />
                <Picker
                    mode="selector"
                    range={selector}
                    value={patient.diagnoseIndex}
                    onChange={useCallback(
                        (e) =>
                            setPatient({
                                ...patient,
                                diagnoseIndex:
                                    typeof e.detail.value === 'number'
                                        ? e.detail.value
                                        : parseInt(e.detail.value, 10),
                            }),
                        [patient, setPatient]
                    )}
                >
                    <FormField name="主要诊断" value={selector[patient.diagnoseIndex]} />
                </Picker>
                <AtInput
                    name="diagnose"
                    title="诊断:"
                    type="text"
                    placeholder="请输入诊断"
                    value={patient.diagnose}
                    onChange={useCallback((v: string) => setPatient({ ...patient, diagnose: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtSwitch
                    title="需要升压药"
                    checked={patient.needVesopressor}
                    onChange={useCallback((v) => setPatient({ ...patient, needVesopressor: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtSwitch
                    title="需要机械通气"
                    checked={patient.needVentilation}
                    onChange={useCallback((v) => setPatient({ ...patient, needVentilation: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <AtSwitch
                    title="使用短肽"
                    checked={patient.useSmallPeptide}
                    onChange={useCallback((v) => setPatient({ ...patient, useSmallPeptide: v }), [
                        patient,
                        setPatient,
                    ])}
                />
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexGrow: 1 }}>
                        <AtInput
                            name="apache2"
                            title="Apache II:"
                            type="number"
                            placeholder="0-71"
                            value={
                                patient.apache2 === '0' && patient_id === '' ? '' : patient.apache2
                            }
                            onChange={useCallback(
                                (v: string) => setPatient({ ...patient, apache2: v ? v : '0' }),
                                [patient, setPatient]
                            )}
                        />
                    </View>
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="external-link"
                            size="25"
                            color="#79A4FA"
                            onClick={() => Taro.navigateTo({ url: '/pages/scores/apache2/index' })}
                        />
                    </View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexGrow: 1 }}>
                        <AtInput
                            name="agi"
                            title="AGI:"
                            type="number"
                            placeholder="0-4"
                            value={patient.agi === '0' && patient_id === '' ? '' : patient.agi}
                            onChange={useCallback(
                                (v: string) => setPatient({ ...patient, agi: v ? v : '0' }),
                                [patient, setPatient]
                            )}
                        />
                    </View>
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="external-link"
                            size="25"
                            color="#79A4FA"
                            onClick={() => Taro.navigateTo({ url: '/pages/assess/agi/index' })}
                        />
                    </View>
                </View>
                {/* <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Picker
                        mode="selector"
                        range={AGIs}
                        style={{ flexGrow: 1 }}
                        value={patient.agi}
                        onChange={(v) =>
                            setPatient({
                                ...patient,
                                agi:
                                    typeof v.detail.value === 'number'
                                        ? v.detail.value
                                        : parseInt(v.detail.value, 10),
                            })
                        }
                    >
                        <FormField name="AGI 评级" value={AGIs[record.agiIndex]} />
                    </Picker>
                    <View style={{ marginRight: '18PX' }}>
                        <AtIcon
                            value="external-link"
                            size="25"
                            color="#79A4FA"
                            onClick={() => Taro.navigateTo({ url: '/pages/assess/agi/index' })}
                        />
                    </View>
                </View> */}
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexGrow: 1 }}>
                        <AtInput
                            name="nrs2002"
                            title="NRS2002:"
                            type="number"
                            placeholder="0-7"
                            value={
                                patient.nrs2002 === '0' && patient_id === '' ? '' : patient.nrs2002
                            }
                            onChange={useCallback(
                                (v: string) => setPatient({ ...patient, nrs2002: v ? v : '0' }),
                                [patient, setPatient]
                            )}
                        />
                    </View>
                    <View style={{ marginRight: '15PX' }}>
                        <AtIcon
                            value="help"
                            size="30"
                            color="#F00"
                            onClick={() => setFloatLay(1)}
                        />
                    </View>
                </View>
                <View
                    style={{
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <View style={{ flexGrow: 1 }}>
                        <AtInput
                            name="enteralNutritionToleranceScore"
                            title="耐受性评分:"
                            type="number"
                            placeholder="0~24"
                            value={
                                patient.enteralNutritionToleranceScore === '0' && patient_id === ''
                                    ? ''
                                    : patient.enteralNutritionToleranceScore
                            }
                            onChange={useCallback(
                                (v: string) =>
                                    setPatient({
                                        ...patient,
                                        enteralNutritionToleranceScore: v ? v : '0',
                                    }),
                                [patient, setPatient]
                            )}
                        />
                    </View>
                    <View style={{ marginRight: '15PX' }}>
                        <AtIcon
                            value="help"
                            size="30"
                            color="#F00"
                            onClick={() => setFloatLay(2)}
                        />
                    </View>
                </View>

                <AtButton
                    type="primary"
                    formType="submit"
                    disabled={
                        submitDisable ||
                        ((_openid !== patient._openid || equal(patient, finalPatient)) && // 不是本人的或者没有更改的
                            patient_id !== '') // 新增的
                    }
                >
                    {patient_id === '' ? '提交' : '修改'}
                </AtButton>
                {patient_id !== '' && (
                    <AtButton
                        type="primary"
                        className="margin-top-1px"
                        onClick={() => Taro.navigateTo({ url: '/pages/grid/index' })}
                    >
                        进入项目
                    </AtButton>
                )}
            </AtForm>
            <AtFloatLayout
                isOpened={!!floatLay}
                title={floatLay === 1 ? '营养风险筛查NRS2002' : '耐受性评分'}
                onClose={() => setFloatLay(0)}
            >
                {floatLay === 1 && <NRS2002 />}
                {floatLay === 2 && <EnteralNutritionTolerance />}
            </AtFloatLayout>
        </View>
    );
}

Patient.config = {
    navigationBarTitleText: '登记病人',
};
