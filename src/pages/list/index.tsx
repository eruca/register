import Taro, { useState, useMemo, useCallback } from '@tarojs/taro';
import { View, Text } from '@tarojs/components';
import { AtList, AtListItem, AtSearchBar, AtFab } from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import { IItem } from '../../reducers/patient';
import { indexOfPatientSelect } from '../../actions/patient';

import './index.scss';

const dispatch = useDispatch();

function newPatient() {
    dispatch(indexOfPatientSelect());
    Taro.navigateTo({
        url: '/pages/patient/index',
    });
}

export default function List() {
    const state: Array<IItem> = useSelector((state: any) => state.patient.data);
    const [hospId, setHospId] = useState('');
    const filtered = useMemo(() => {
        if (hospId === '') {
            return state;
        }
        return state.filter((item: IItem) => item.hospId.startsWith(hospId));
    }, [state, hospId]);

    const onChange = useCallback((v: string) => setHospId(v), [setHospId]);
    return (
        <View>
            <View className="fab-button-left">
                <AtFab size="small" onClick={newPatient}>
                    <Text className="at-fab__icon at-icon at-icon-add" />
                </AtFab>
            </View>
            <AtSearchBar
                actionName="搜索"
                value={hospId}
                placeholder="输入病案号"
                onChange={onChange}
            />
            {filtered.length === 0 ? (
                <View>没有数据</View>
            ) : (
                <AtList>
                    {filtered.map((item, i) => (
                        <AtListItem
                            key={i}
                            title={`${item.hospId} - ${item.name}`}
                            onClick={() => {
                                dispatch(indexOfPatientSelect(i));
                                Taro.navigateTo({
                                    url: `/pages/patient/index`,
                                });
                            }}
                        />
                    ))}
                </AtList>
            )}
        </View>
    );
}

List.options = {
    addGlobalClass: true,
};
