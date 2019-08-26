import Taro, { useState, useMemo, useCallback, useEffect } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtList, AtListItem, AtSearchBar, AtFab, AtPagination } from 'taro-ui';
import { useDispatch, useSelector } from '@tarojs/redux';

import Loading from '../../components/Loading';
import { IPatient } from '../../reducers/patient';
import { deselect, select, patient_current } from '../../actions/patient';
import { fuzzysearch } from '../../utils';
import db from '../../utils/db';

import './index.scss';
import { IReducers } from '../../reducers';

const dispatch = useDispatch();

function newPatient() {
    dispatch(deselect());
    Taro.navigateTo({
        url: '/pages/patient/index',
    });
}

export default function List() {
    const { _openid, total, pageSize, currentPage } = useSelector((state: IReducers) => ({
        _openid: state.user._openid,
        total: state.patients.total,
        pageSize: state.patients.pageSize,
        currentPage: state.patients.currentPage,
    }));

    const [patients, setPatients] = useState<Array<IPatient>>([]);
    const [cnt, setCount] = useState(0);

    console.log('(currentPage - 1) * pageSize = ', (currentPage - 1) * pageSize);
    useEffect(() => {
        db.collection('patients')
            .where({ _openid })
            .skip((currentPage - 1) * pageSize)
            .limit(pageSize)
            .orderBy('name', 'asc')
            .get()
            .then(res => setPatients(res.data as Array<IPatient>));
    }, [cnt, setPatients, _openid, currentPage, pageSize]);

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

    const onPageChange = useCallback(
        ({ type, current }) => {
            console.log('onPageChange', type, current);
            dispatch(patient_current(current));
        },
        [dispatch, patient_current]
    );

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
            <View style="margin-top:10rpx">
                <AtPagination
                    total={total}
                    pageSize={pageSize}
                    current={currentPage}
                    onPageChange={onPageChange}
                />
            </View>
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
