import Taro, { useState, useCallback, useEffect } from '@tarojs/taro';
import { View, Text, Button } from '@tarojs/components';
import {
    AtList,
    AtListItem,
    AtSearchBar,
    AtPagination,
    AtSwipeAction,
    AtModal,
    AtModalAction,
    AtModalContent,
    AtModalHeader,
    AtMessage,
    AtButton,
} from 'taro-ui';
import { useDispatch, useSelector } from '@tarojs/redux';
import dayjs from 'dayjs';

import Loading from '../../components/Loading';
import { IPatient } from '../../reducers/patient';
import { deselect, select } from '../../actions/patient';
import { isCrew, isUnknown } from '../../reducers/user';
import { IReducers } from '../../reducers';
import { forceRerender } from '../../actions/user';
import { splitter } from '../../utils/regexp';

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
    const {
        _openid,
        listType,
        timeOption,
        resultOption,
        force_rerender,
        authority: auth,
    } = useSelector((state: IReducers) => state.user);

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
    const [openidNames, setOpenidNames] = useState<Map<string, string>>(new Map());
    const [searchText, setSearchText] = useState('');
    const [currPage, setCurrPage] = useState<number>(1);
    const [searchValue, setSearchValue] = useState('');

    useEffect(() => {
        if (isCrew(auth)) {
            console.log('fetch patients with searchValue', searchValue);
            Taro.cloud.callFunction({
                name: 'getPatients',
                data: {
                    offset: (currPage - 1) * pageSize,
                    size: pageSize,
                    listType,
                    searchValue,
                    timeOption,
                    resultOption,
                },
                success: ({ result, errMsg }: Taro.cloud.CallFunctionResult) => {
                    console.log('getPatients', result, 'errMsg', errMsg);
                    if (!result) {
                        console.warn('getPatients 没有获取数据');
                        return;
                    }

                    setPatients(result['found'] as Array<IPatient>);
                    setTotal(result['total'] as number);
                    setPatientRecords(new Map(result['list'].map(({ _id, num }) => [_id, num])));
                    setOpenidNames(
                        new Map(
                            Object.keys(result['openid_nicknames']).map((k) => [
                                k,
                                result['openid_nicknames'][k],
                            ])
                        )
                    );
                    setOffset(result['offset'] as number);
                    setLoaded(true);
                },
            });
        }
    }, [listType, timeOption, resultOption, searchValue, auth, currPage, _openid, force_rerender]);

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
    const onActionClick = (e) => {
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
            Taro.cloud.callFunction({
                name: 'removePatient',
                data: { patientid: patients[openIndex]._id },
                success: ({ result, errMsg }: Taro.cloud.CallFunctionResult) => {
                    console.log('removePatient', result, 'errMsg', errMsg);
                    if (!result) {
                        console.warn('removePatient 没有获取数据');
                        return;
                    }
                    Taro.atMessage({
                        message: `删除成功，同时删除${result['records']}记录`,
                        type: 'success',
                    });
                    dispatch(forceRerender());
                    onClosed();
                    setModelOpened(false);
                },
                fail: () => {
                    console.error(arguments);
                    Taro.atMessage({ message: '删除失败', type: 'error' });
                    setModelOpened(false);
                },
            });
        }
    };

    return (
        <View>
            <AtMessage />
            <View style="flex-grow:1">
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
                                    title={`${index + 1 + offset}: ${item.name}: ${
                                        pateintRecords.get(item._id) || 0
                                    }/${dayjs().diff(dayjs(item.enrolltime), 'day')}`}
                                    extraText={
                                        item._openid !== _openid
                                            ? decorate_extratext(
                                                  openidNames.get(item._openid || '')
                                              )
                                            : '我'
                                    }
                                    iconInfo={
                                        item.stayoficu > 0
                                            ? { size: 25, color: '#4DA167', value: 'check-circle' }
                                            : { size: 25, color: '#D65108', value: 'edit' }
                                    }
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
            </View>
            <View style={{ margin: '5PX 14PX' }}>
                <AtButton
                    type="secondary"
                    onClick={useCallback(() => {
                        dispatch(deselect());
                        Taro.navigateTo({
                            url: isUnknown(auth) ? '/pages/user/index' : '/pages/patient/index',
                        });
                    }, [dispatch])}
                >
                    {isUnknown(auth) ? '加入RCT' : '新增'}
                </AtButton>
            </View>
            <AtModal isOpened={isModalOpened}>
                <AtModalHeader>
                    <Text style="color:red">删除病人</Text>
                </AtModalHeader>
                <AtModalContent>将会从数据库删除病人信息及记录</AtModalContent>
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

// 怎么把监视者的医院和名字显示出来，最多六个字符
function decorate_extratext(line: string | undefined): string {
    if (line === undefined) {
        return '';
    }
    const [names, hosps] = line.split(',');
    const [name1, name2] = names.split(splitter);
    const name = name1 ? name1 : name2;
    const parts = hosps.split(splitter);
    if (parts.length === 1) {
        if (hosps) {
            return name + ':' + hosps;
        }
        return name;
    }
    return name + ':' + parts[1];
}
