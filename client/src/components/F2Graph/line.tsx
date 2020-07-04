import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtActivityIndicator } from 'taro-ui';
import { F2Canvas } from 'taro-f2';
import F2 from '@antv/f2/lib/index-all';
import { CSSProperties } from 'react';

export type LineValueType = {
    date: string;
    value: number;
};

type LineType = {
    data: LineValueType[];
    style?: CSSProperties;
};

export default function Line({
    data = [],
    style = { width: '100%', height: '600rpx', position: 'relative' },
}: LineType) {
    const [graph, setGraph] = useState(null);

    if (graph && data.length > 0) {
        console.log('data', data);
        graph.changeData(data);
    }

    const initChart = (canvas: any, width: number, height: number) => {
        console.log('initChart', width, height);
        const chart = new F2.Chart({
            el: canvas,
            width,
            height,
        });

        chart.source(data, {
            date: {
                type: 'timeCat',
                range: [0, 1],
                tickCount: 3,
            },
            value: {
                tickCount: 5,
            },
        });

        chart.tooltip({
            custom: true,
            showXTip: true,
            showYTip: true,
            snap: true,
            crosshairsType: 'xy',
            crosshairsStyle: {
                lineDash: [2],
            },
        });

        chart.axis('date', {
            label: function label(text, index, total) {
                const textCfg: any = {};
                if (index === 0) {
                    textCfg.textAlign = 'left';
                } else if (index === total - 1) {
                    textCfg.textAlign = 'right';
                }
                return textCfg;
            },
        });

        chart.line().position('date*value');
        chart.render();
        setGraph(chart);
        return chart;
    };

    return (
        <View style={style}>
            {data.length ? (
                <F2Canvas onInit={initChart} />
            ) : (
                <AtActivityIndicator mode="center" size={32} content="加载中..." />
            )}
        </View>
    );
}
