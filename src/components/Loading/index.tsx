import Taro from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator, AtNoticebar } from 'taro-ui';

export default function Loading({ content }: { content?: string }) {
    return (
        <View>
            <AtNoticebar marquee>
                {content
                    ? content
                    : '如果长时间无法进入，需注意网络情况，保证网络可用下，退出再进入'}
            </AtNoticebar>
            <View className="at-row global-margin-vertial-20px">
                <View className="at-col at-col__offset-5">
                    <AtActivityIndicator content="加载中..." color="#13CE66" />
                </View>
            </View>
        </View>
    );
}

Loading.options = {
    addGlobalClass: true,
};
