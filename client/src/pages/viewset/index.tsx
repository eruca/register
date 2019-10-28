import Taro from '@tarojs/taro';
import { Picker, View } from '@tarojs/components';
import { AtList, AtCard } from 'taro-ui';
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

    return (
        <View>
            <View style={{ marginBottom: '5PX' }}>
                <AtCard title="使用说明">
                    在这个页面，你可以调节查看的信息，比如:可以选择过滤条件
                    本人-组内，是否满1周，是否已有结果的过滤
                </AtCard>
            </View>
            <View style={{ margin: '10PX', borderLeft: '3PX SOLID red', paddingLeft: '5PX' }}>
                选择过滤条件:{' '}
            </View>
            <AtList>
                <View style={{ marginLeft: '-3PX' }}>
                    <Picker
                        mode="selector"
                        range={listTypes.slice(
                            0,
                            isUnknown(user.authority) ? 1 : isRoot(user.authority) ? 3 : 2
                        )}
                        value={user.listType}
                        onChange={e => {
                            dispatch(
                                syncViewSet(
                                    parseInt(e.detail.value, 10),
                                    user.timeOption,
                                    user.resultOption
                                )
                            );
                        }}
                    >
                        <FormField name="范围 " value={listTypes[user.listType]} />
                    </Picker>
                </View>
                <View style={{ marginLeft: '-3PX' }}>
                    <Picker
                        mode="selector"
                        range={timeOptions}
                        value={user.timeOption}
                        onChange={e => {
                            dispatch(
                                syncViewSet(
                                    user.listType,
                                    parseInt(e.detail.value, 10),
                                    user.resultOption
                                )
                            );
                        }}
                    >
                        <FormField name="时间 " value={timeOptions[user.timeOption]} />
                    </Picker>
                </View>
                <View style={{ marginLeft: '-3PX' }}>
                    <Picker
                        mode="selector"
                        range={resultOptions}
                        value={user.resultOption}
                        onChange={e => {
                            dispatch(
                                syncViewSet(
                                    user.listType,
                                    user.timeOption,
                                    parseInt(e.detail.value, 10)
                                )
                            );
                        }}
                    >
                        <FormField name="结果 " value={resultOptions[user.resultOption]} />
                    </Picker>
                </View>
            </AtList>
        </View>
    );
}

Viewset.config = {
    navigationBarTitleText: '查看设置',
};
