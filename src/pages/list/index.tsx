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
    const {
        _openid,
        total,
        mytotal,
        is_super,
        date_total,
        mydate_total,
        result_total,
        myresult_total,
        pageSize,
        currentPage,
    } = useSelector((state: IReducers) => ({
        _openid: state.user._openid,
        is_super: state.user.is_super,
        total: state.patients.total,
        date_total: state.patients.patient_date_total,
        result_total: state.patients.patient_result_total,
        mytotal: state.patients.mytotal,
        mydate_total: state.patients.mypatient_date_total,
        myresult_total: state.patients.mypatient_result_total,
        pageSize: state.patients.pageSize,
        currentPage: state.patients.currentPage,
    }));

    // 到底是数据库没下载，还是数据本身就是空
    const [loaded, setLoaded] = useState<boolean>(false);
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
                .orderBy('enrolltime', 'desc')
                .get()
                .then(res => {
                    setPatients(res.data as Array<IPatient>);
                    setLoaded(true);
                });
        }
    }, [searchUtil.clicked, mytotal, setPatients, _openid, currentPage, pageSize]);

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
                setPatients((res.result as any).found as Array<IPatient>);
                // 按了搜索之后
                setSearchUtil({ ...searchUtil, clicked: true });
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
                    const sub_day =
                        dayjs().diff(dayjs(patients[openIndex].enrolltime), 'd') > 7 ? 1 : 0;
                    const sub_result = patients[openIndex].venttime ? 0 : 1;

                    dispatch(
                        patient_total(
                            total - stats.removed,
                            date_total - sub_day,
                            result_total - sub_result,
                            mytotal - stats.removed,
                            mydate_total - sub_day,
                            myresult_total - sub_result
                        )
                    );
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
                                title={`${item.hospId}-${item.name}: ${dayjs().diff(
                                    dayjs(item.enrolltime),
                                    'day'
                                )}d`}
                                extraText={`${item.venttime ? '✔️' : ''}`}
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
