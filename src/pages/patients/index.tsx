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
    AtMessage,
} from 'taro-ui';
import { useDispatch, useSelector } from '@tarojs/redux';
import dayjs from 'dayjs';

import Loading from '../../components/Loading';
import { IPatient } from '../../reducers/patient';
import { deselect, select } from '../../actions/patient';
import { isCrew } from '../../reducers/user';
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

const pageSize = 20;

export default function List() {
    const dispatch = useDispatch();
    const { _openid, listType, force_rerender, authority: auth } = useSelector(
        (state: IReducers) => ({
            _openid: state.user._openid,
            authority: state.user.authority,
            listType: state.user.listType,
            force_rerender: state.user.force_rerender,
        })
    );

    // 到底是数据库没下载，还是数据本身就是空
    const [loaded, setLoaded] = useState<boolean>(false);
    const [total, setTotal] = useState<number>(0);
    const [patients, setPatients] = useState<Array<IPatient>>([]);
    // 按下页，如果没有offset接收服务器返回，会提早改为下一页的序号
    // 设置后，就会和返回的数据同步
    const [offset, setOffset] = useState<number>(0);
    const [pateintRecords, setPatientRecords] = useState<Map<string | undefined, number>>(
        new Map()
    );
    const [searchText, setSearchText] = useState('');
    const [currPage, setCurrPage] = useState<number>(1);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (isCrew(auth)) {
            console.log('fetch patients with searchValue', searchValue);
            Taro.cloud.callFunction({
                name: 'getPatients',
                data: { offset: (currPage - 1) * pageSize, size: pageSize, listType, searchValue },
                success: (res: any) => {
                    console.log('getPatients', res);
                    setPatients(res.result.found as Array<IPatient>);
                    setTotal(res.result.total as number);
                    setPatientRecords(new Map(res.result.list.map(({ _id, num }) => [_id, num])));
                    setOffset(res.result.offset);
                    setLoaded(true);
                },
            });
        }
    }, [listType, searchValue, auth, currPage, _openid, force_rerender]);

    console.log('patients ->', patients, 'pageSize', pageSize);

    const onSearch = useCallback(() => setSearchValue(searchText), [searchText, setSearchValue]);

    const onChange = useCallback(
        (v: string) => {
            setSearchText(v);
            if (v === '') {
                setSearchValue('');
            }
        },
        [setSearchText]
    );

    const onPageChange = ({ type, current }) => {
        console.log('onPageChange', type, current);
        setCurrPage(current);
        Taro.atMessage({ message: '准备下一页，请稍等', type: 'info', duration: 1000 });
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
        if (isCrew(auth)) {
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
        }
    };

    return (
        <View>
            <AtMessage />
            <AtSearchBar
                showActionButton
                actionName="搜索"
                value={searchText}
                placeholder="姓名"
                onChange={onChange}
                onActionClick={onSearch}
            />
            {isCrew(auth) && loaded === false ? (
                <Loading />
            ) : patients.length === 0 ? (
                '目前数据为空'
            ) : (
                <AtList>
                    {patients.map((item, index) => (
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
                                title={`${index + 1 + offset}: ${item.hospId}-${
                                    item.name
                                }: ${pateintRecords.get(item._id) || 0}/${dayjs().diff(
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
                    current={currPage}
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
    navigationBarTitleText: '对象列表',
};
