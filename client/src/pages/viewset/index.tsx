import Taro, { useState } from '@tarojs/taro';
import { Picker, View } from '@tarojs/components';
import {
    AtList,
    AtListItem,
    AtFloatLayout,
    AtActionSheet,
    AtActionSheetItem,
    AtMessage,
} from 'taro-ui';
import { useSelector, useDispatch } from '@tarojs/redux';

import { isRoot, isUnknown } from '../../reducers/user';
import { IReducers } from '../../reducers';
import { syncViewSet } from '../../actions/user';
import FormField from '../../components/FormField';

const listTypes = ['我的', '本组', '所有'];
const timeOptions = ['所有', '未满1周', '已到1周'];
const resultOptions = ['所有', '无结果', '有结果'];

export default function Viewset() {
    const user = useSelector((state: IReducers) => state.user);
    const dispatch = useDispatch();
    const [isFloatLayerOpen, setIsFloatLayerOpen] = useState(false);
    const [isActionSheetOpen, setIsActionSheetOpen] = useState<boolean>(false);

    const onDownload = () => {
        setIsActionSheetOpen(false);
        Taro.atMessage({ message: '正在处理, 请稍等...', type: 'info', duration: 1500 });

        Taro.cloud.callFunction({
            name: 'onDownload',
            success: ({ result, errMsg }: Taro.cloud.CallFunctionResult) => {
                console.log('onDownload', result, errMsg);
                if (!result) {
                    console.log('onDownload 返回空');
                    return;
                }
                if (result['success']) {
                    Taro.atMessage({ message: result['msg'], type: 'success' });
                } else {
                    Taro.atMessage({ message: result['msg'], type: 'error' });
                }
            },
            fail: console.error,
        });
    };

    return (
        <View>
            <AtMessage />
            <AtList>
                <AtListItem
                    title="选择过滤条件:"
                    arrow="right"
                    iconInfo={{ size: 25, color: '#78A4FA', value: 'bookmark' }}
                    extraText="说明"
                    onClick={() => setIsFloatLayerOpen(true)}
                />
                <View style={{ marginLeft: '30PX' }}>
                    <Picker
                        mode="selector"
                        range={listTypes.slice(
                            0,
                            isUnknown(user.authority) ? 1 : isRoot(user.authority) ? 3 : 2
                        )}
                        value={user.listType}
                        onChange={(e) => {
                            dispatch(
                                syncViewSet(
                                    typeof e.detail.value === 'number'
                                        ? e.detail.value
                                        : parseInt(e.detail.value, 10),
                                    user.timeOption,
                                    user.resultOption
                                )
                            );
                        }}
                    >
                        <FormField
                            name="1.范围"
                            value={listTypes[user.listType]}
                            valueColor="#78A4FA"
                        />
                    </Picker>
                </View>
                <View style={{ marginLeft: '30PX' }}>
                    <Picker
                        mode="selector"
                        range={timeOptions}
                        value={user.timeOption}
                        onChange={(e) => {
                            dispatch(
                                syncViewSet(
                                    user.listType,
                                    typeof e.detail.value === 'number'
                                        ? e.detail.value
                                        : parseInt(e.detail.value, 10),
                                    user.resultOption
                                )
                            );
                        }}
                    >
                        <FormField
                            name="2.时间"
                            value={timeOptions[user.timeOption]}
                            valueColor="#78A4FA"
                        />
                    </Picker>
                </View>
                <View style={{ marginLeft: '30PX' }}>
                    <Picker
                        mode="selector"
                        range={resultOptions}
                        value={user.resultOption}
                        onChange={(e) => {
                            dispatch(
                                syncViewSet(
                                    user.listType,
                                    user.timeOption,
                                    typeof e.detail.value === 'number'
                                        ? e.detail.value
                                        : parseInt(e.detail.value, 10)
                                )
                            );
                        }}
                    >
                        <FormField
                            name="3.结果"
                            value={resultOptions[user.resultOption]}
                            valueColor="#78A4FA"
                        />
                    </Picker>
                </View>
                <AtListItem
                    title="下载我的贡献:"
                    arrow="right"
                    iconInfo={{ size: 25, color: '#78A4FA', value: 'download-cloud' }}
                    onClick={() => {
                        if (!user.mail) {
                            Taro.atMessage({ message: '请先输入接收邮箱📮', type: 'error' });
                            return;
                        }
                        setIsActionSheetOpen(true);
                    }}
                />
            </AtList>
            <AtFloatLayout
                isOpened={isFloatLayerOpen}
                title="使用说明"
                onClose={() => setIsFloatLayerOpen(false)}
            >
                在这个页面，你可以调节查看的信息，比如:可以选择过滤条件
                本人-组内，是否满1周，是否已有结果的过滤
            </AtFloatLayout>
            <AtActionSheet
                isOpened={isActionSheetOpen}
                cancelText="取消"
                title="下载会消耗资源，请谨慎使用"
                onCancel={() => setIsActionSheetOpen(false)}
                onClose={() => setIsActionSheetOpen(false)}
            >
                <AtActionSheetItem onClick={onDownload}>发送数据到你的邮箱</AtActionSheetItem>
            </AtActionSheet>
        </View>
    );
}

Viewset.config = {
    navigationBarTitleText: '查看设置',
};
