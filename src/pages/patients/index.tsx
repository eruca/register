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
import { IPatient } from '../../reducers/patient';
import { deselect, select, patient_current, patient_total } from '../../actions/patient';
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
    const { _openid, is_super, force_rerender, mytotal, pageSize, currentPage } = useSelector(
        (state: IReducers) => ({
            _openid: state.user._openid,
            is_super: state.user.is_super,
            force_rerender: state.user.force_rerender,
            mytotal: state.patients.mytotal,
            pageSize: state.patients.pageSize,
            currentPage: state.patients.currentPage,
        })
    );

    // 到底是数据库没下载，还是数据本身就是空
    const [loaded, setLoaded] = useState<boolean>(false);
    const [patients, setPatients] = useState<Array<IPatient>>([]);
    const [searchText, setSearchText] = useState('');
    const [searchUtil, setSearchUtil] = useState({ curr: 1, clicked: false });

    // 在查询list时必须是全部数据，因为统计页面可能停留在某年，但查询必须修正过来
    useEffect(() => {
        Taro.cloud.callFunction({
            name: 'getStatistic',
            data: { year: '所有' },
            success: res => {
                console.log('getStatistic', res);
                dispatch(
                    patient_total(
                        (res.result as any).total,
                        (res.result as any).patient_date_total,
                        (res.result as any).patient_result_total,
                        (res.result as any).mytotal,
                        (res.result as any).mypatient_date_total,
                        (res.result as any).mypatient_result_total
                    )
                );
            },
            fail: console.error,
        });
    }, [force_rerender, currentPage]);

    useEffect(() => {
        // 如果是搜索，就直接使用onSearch找到所有数据
        if (!searchUtil.clicked) {
            console.log('fetch patients list');
            db.collection('patients')
                .where({ _openid })
                .skip((currentPage - 1) * pageSize)
                .limit(pageSize)
                .orderBy('enrolltime', 'desc')
                .orderBy('hospId', 'asc')
                .get()
                .then(res => {
                    setPatients(res.data as Array<IPatient>);
                    setLoaded(true);
                });
        }
    }, [searchUtil.clicked, force_rerender, setPatients, _openid, currentPage, pageSize]);

    console.log('patients ->', patients, 'pageSize', pageSize);

    // todo : 需要在全局搜索
    const onSearch = () => {
        Taro.cloud.callFunction({
            name: 'onSearch',
            data: {
                searchText: !is_super && searchText.substring(0, 3) === 'r:+' ? '' : searchText,
            },
            success(res) {
                console.log('e', (res.result as any).event, 'found', (res.result as any).found);
                // 按了搜索之后
                setSearchUtil({ ...searchUtil, clicked: true });
                setPatients((res.result as any).found as Array<IPatient>);
            },
            fail: console.error,
        });
    };

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
                placeholder="输入病案号+姓名/r:0"
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
                        >
                            <AtListItem
                                title={`${index +
                                    1 +
                                    ((searchUtil.clicked ? searchUtil.curr : currentPage) - 1) * // 依据是否点击search来确定currentPage
                                        pageSize}: ${item.hospId}-${item.name}: ${dayjs().diff(
                                    dayjs(item.enrolltime),
                                    'day'
                                )}天`}
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
                    total={!searchUtil.clicked ? mytotal : patients.length} // 需要设置是否按了搜索按钮
                    pageSize={pageSize}
                    current={!searchUtil.clicked ? currentPage : searchUtil.curr}
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
