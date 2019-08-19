import Taro, { useState, useMemo, useCallback, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtList, AtListItem, AtSearchBar, AtFab } from 'taro-ui';
import { useDispatch } from '@tarojs/redux';

import Loading from '../../components/Loading';
import { IPatient } from '../../reducers/patient';
import { deselect, select } from '../../actions/patient';
import { fuzzysearch } from '../../utils';
import db from '../../utils/db';

import './index.scss';

const dispatch = useDispatch();

function newPatient() {
    dispatch(deselect());
    Taro.navigateTo({
        url: '/pages/patient/index',
    });
}

export default function List() {
    const [patients, setPatients] = useState<Array<IPatient>>([]);
    const [cnt, setCount] = useState(0);

    useEffect(() => {
        db.collection('patients')
            .get()
            .then(res => setPatients(res.data as Array<IPatient>));
    }, [cnt, setPatients]);

    console.log('patients ->', patients);

    const [hospId, setHospId] = useState('');
    const filtered = useMemo(() => {
        if (hospId === '') {
            return patients;
        }
        // item.hospId.startsWith(hospId)
        return patients.filter((item: IPatient) => fuzzysearch(hospId, item.hospId + item.name));
    }, [patients, hospId]);

    const onChange = useCallback((v: string) => setHospId(v), [setHospId]);
    return (
        <View>
            <AtSearchBar
                showActionButton
                actionName="更新"
                value={hospId}
                placeholder="输入病案号"
                onChange={onChange}
                onActionClick={() => setCount(cnt + 1)}
            />
            {filtered.length === 0 ? (
                <Loading />
            ) : (
                <AtList>
                    {filtered.map((item, i) => (
                        <AtListItem
                            key={i}
                            title={`${item.hospId} - ${item.name}`}
                            onClick={() => {
                                dispatch(
                                    select(item._id || '', item.hospId, item.name, item.enrolltime)
                                );
                                Taro.navigateTo({
                                    url: `/pages/patient/index`,
                                });
                            }}
                        />
                    ))}
                </AtList>
            )}
            <View className="fab-button-left">
                <AtFab size="small" onClick={newPatient}>
                    <Text className="at-fab__icon at-icon at-icon-add" />
                </AtFab>
            </View>
        </View>
    );
}

List.options = {
    addGlobalClass: true,
};
