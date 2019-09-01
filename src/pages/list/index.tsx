import Taro, { useState, useCallback, useEffect } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import {
    AtList,
    AtListItem,
    AtSearchBar,
    AtFab,
    AtPagination,
    AtSwipeAction,
    AtModal,
    AtModalAction,
    AtModalContent,
    AtModalHeader,
} from 'taro-ui';
import { useDispatch, useSelector } from '@tarojs/redux';

import Loading from '../../components/Loading';
import { IPatient } from '../../reducers/patient';
import { deselect, select, patient_current, patient_total } from '../../actions/patient';
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

const options = [
    {
        text: '取消',
        style: {
            backgroundColor: '#6190E8',
        },
    },
    {
        text: '删除',
        style: {
            backgroundColor: '#FF4949',
        },
    },
];

export default function List() {
    const { _openid, total, pageSize, currentPage } = useSelector((state: IReducers) => ({
        _openid: state.user._openid,
        total: state.patients.total,
        pageSize: state.patients.pageSize,
        currentPage: state.patients.currentPage,
    }));

    const [patients, setPatients] = useState<Array<IPatient>>([]);
    const [searchText, setSearchText] = useState('');
    const [searchUtil, setSearchUtil] = useState({ curr: 1, clicked: false });

    useEffect(() => {
        // 如果是搜索，就直接使用onSearch找到所有数据
        if (!searchUtil.clicked) {
            db.collection('patients')
                .where({ _openid })
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
                .orderBy('name', 'asc')
                .get()
                .then(res => setPatients(res.data as Array<IPatient>));
        }
    }, [searchUtil.clicked, setPatients, _openid, currentPage, pageSize, total]);

    console.log('patients ->', patients, 'pageSize', pageSize);

    // todo : 需要在全局搜索
    const onSearch = () => {
        Taro.cloud.callFunction({
            name: 'onSearch',
            data: { searchText },
            success(res) {
                console.log('e', (res.result as any).event, 'found', (res.result as any).found);
                setPatients((res.result as any).found as Array<IPatient>);
                // 按了搜索之后
                setSearchUtil({ ...searchUtil, clicked: true });
            },
            fail: console.error,
        });
    };

    // const patients = useMemo(() => {
    //     if (searchText === '') {
    //         return patients;
    //     }
    //     return patients.filter((item: IPatient) =>
    //         fuzzysearch(searchText, item.hospId + item.name)
    //     );
    // }, [patients, searchText]);

    const onChange = useCallback(
        (v: string) => {
            setSearchText(v);
            if (v === '') {
                setSearchUtil({ ...searchUtil, clicked: false });
            }
        },
        [setSearchText]
    );

    const onPageChange = ({ type, current }) => {
        console.log('onPageChange', type, current);
        if (!searchUtil.clicked) {
            dispatch(patient_current(current));
        } else {
            setSearchUtil({ ...searchUtil, curr: current });
        }
    };

    // 删除滑动控制
    const [openIndex, setOpenIndex] = useState<number>(-1);
    const onClosed = () => setOpenIndex(-1);

    const [isModalOpened, setModelOpened] = useState<boolean>(false);
    const onActionClick = e => {
        switch (e.text) {
            case '取消':
                onClosed();
                break;
            case '删除':
                setModelOpened(true);
                break;
        }
    };
    console.log('openIndex', openIndex);
    const onDelete = () => {
        db.collection('patients')
            .doc(patients[openIndex]._id || '')
            .remove({
                success: ({ stats }) => {
                    console.log('e', stats);
                    dispatch(patient_total(total - stats.removed));
                    onClosed();
                    setModelOpened(false);
                },
                fail: console.error,
            });
    };

    const filtered = searchUtil.clicked
        ? patients.slice((searchUtil.curr - 1) * pageSize, searchUtil.curr * pageSize)
        : patients;

    console.log('filtered', filtered);

    return (
        <View>
            <AtSearchBar
                showActionButton
                actionName="搜索"
                value={searchText}
                placeholder="输入病案号/姓名"
                onChange={onChange}
                onActionClick={onSearch}
            />
            {filtered.length === 0 ? (
                <Loading />
            ) : (
                <AtList>
                    {filtered.map((item, index) => (
                        <AtSwipeAction
                            key={index}
                            onOpened={() => setOpenIndex(index)}
                            isOpened={openIndex === index}
                            options={options}
                            onClick={onActionClick}
                            onClosed={onClosed}
                        >
                            <AtListItem
                                title={`${item.hospId} - ${item.name}`}
                                onClick={() => {
                                    dispatch(
                                        select(
                                            item._id || '',
                                            item.hospId,
                                            item.name,
                                            item.enrolltime
                                        )
                                    );
                                    Taro.navigateTo({
                                        url: `/pages/patient/index`,
                                    });
                                }}
                            />
                        </AtSwipeAction>
                    ))}
                </AtList>
            )}
            <View style="margin-top:10rpx">
                <AtPagination
                    total={!searchUtil.clicked ? total : patients.length} // 需要设置是否按了搜索按钮
                    pageSize={pageSize}
                    current={!searchUtil.clicked ? currentPage : searchUtil.curr}
                    onPageChange={onPageChange}
                />
            </View>
            <View className="fab-button-right">
                <AtFab size="small" onClick={newPatient}>
                    <Text className="at-fab__icon at-icon at-icon-add" />
                </AtFab>
            </View>
            <AtModal isOpened={isModalOpened}>
                <AtModalHeader>
                    <Text style="color:red">删除病人</Text>
                </AtModalHeader>
                <AtModalContent>将会从数据库删除病人信息</AtModalContent>
                <AtModalAction>
                    <Button
                        onClick={() => {
                            setModelOpened(false);
                            onClosed();
                        }}
                    >
                        取消
                    </Button>{' '}
                    <Button onClick={onDelete}>确定</Button>{' '}
                </AtModalAction>
            </AtModal>
        </View>
    );
}

List.options = {
    addGlobalClass: true,
};
