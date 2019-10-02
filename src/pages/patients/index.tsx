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
import dayjs from 'dayjs';

import Loading from '../../components/Loading';
import { IPatient, Statistic } from '../../reducers/patient';
import {
    deselect,
    select,
    patient_current,
    patient_total,
    patient_searchvalue,
} from '../../actions/patient';
import db from '../../utils/db';
import { IReducers } from '../../reducers';
import { forceRerender } from '../../actions/user';

import './index.scss';

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
    const dispatch = useDispatch();
    const {
        _openid,
        is_super,
        listType,
        force_rerender,
        pageSize,
        currentPage,
        searchValue,
    } = useSelector((state: IReducers) => ({
        _openid: state.user._openid,
        authority: state.user.authority,
        listType: state.user.listType,
        is_super: state.user.is_super,
        force_rerender: state.user.force_rerender,
        pageSize: state.patients.pageSize,
        currentPage: state.patients.currentPage,
        searchValue: state.patients.searchValue,
    }));

    // 到底是数据库没下载，还是数据本身就是空
    const [loaded, setLoaded] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [patients, setPatients] = useState<Array<IPatient>>([]);
    const [pateintRecords, setPatientRecords] = useState<Map<string | undefined, number>>(
        new Map()
    );
    const [searchText, setSearchText] = useState('');
    const [searchUtil, setSearchUtil] = useState({ curr: 1, clicked: false });

    // 在查询list时必须是全部数据，因为统计页面可能停留在某年，但查询必须修正过来
    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'getStatistic',
            data: { year: '所有' },
            success: res => {
                console.log('getStatistic', res);
                dispatch(patient_total(res.result as Statistic));
            },
            fail: console.error,
        });
    }, [force_rerender, currentPage, listType]);

    useEffect(() => {
        console.log('fetch patients with searchValue', searchValue);
        Taro.cloud.callFunction({
            name: 'getPatients',
            data: { offset: (currentPage - 1) * pageSize, size: pageSize, listType, searchValue },
            success: (res: any) => {
                console.log('getPatients', res);
                setPatients(res.result.found as Array<IPatient>);
                setTotal(res.result.total as number);
                setPatientRecords(new Map(res.result.list.map(({ _id, num }) => [_id, num])));
                setLoaded(true);
            },
        });
    }, [listType, searchValue, currentPage, _openid, force_rerender]);

    console.log('patients ->', patients, 'pageSize', pageSize);

    const onSearch = () => {
        dispatch(patient_searchvalue(searchText));
    };

    const onChange = useCallback(
        (v: string) => {
            setSearchText(v);
            if (v === '') {
                dispatch(patient_searchvalue(''));
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
                    dispatch(forceRerender());
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
                placeholder="姓名"
                onChange={onChange}
                onActionClick={onSearch}
            />
            {loaded === false ? (
                <Loading />
            ) : filtered.length === 0 ? (
                '目前数据为空'
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
                            disabled={item._openid !== _openid}
                        >
                            <AtListItem
                                title={`${index +
                                    1 +
                                    ((searchUtil.clicked ? searchUtil.curr : currentPage) - 1) * // 依据是否点击search来确定currentPage
                                        pageSize}: ${item.hospId}-${item.name}: ${pateintRecords.get(item._id) || 0}/${dayjs().diff(
                                    dayjs(item.enrolltime),
                                    'day'
                                )}`}
                                extraText={`${item.stayoficu ? '✔️' : ''}`}
                                onClick={() => {
                                    dispatch(
                                        select(
                                            item._id || '',
                                            item._openid || '',
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
            <View style="margin:20rpx 0">
                <AtPagination
                    total={total} // 需要设置是否按了搜索按钮
                    pageSize={pageSize}
                    current={currentPage}
                    onPageChange={onPageChange}
                />
            </View>
            <View className="fab-button-right">
                <AtFab
                    size="small"
                    onClick={useCallback(() => {
                        dispatch(deselect());
                        Taro.navigateTo({
                            url: '/pages/patient/index',
                        });
                    }, [dispatch])}
                >
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

List.config = {
    navigationBarTitleText: '病人列表',
};
