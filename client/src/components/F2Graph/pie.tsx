import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { F2Canvas } from 'taro-f2';
import F2 from '@antv/f2/lib/index-all';
import { CSSProperties } from 'react';

export type PieDataType = {
    name: string;
    count: number;
    group: string;
};

type PieProps = {
    data: PieDataType[];
    radius?: number;
    style?: CSSProperties;
};

export default function Pie({
    data = [],
    radius = 0.85,
    style = { width: '100%', height: '600rpx' },
}: PieProps) {
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

        chart.source(data);
        chart.coord('polar', {
            transposed: true,
            radius,
        });
        chart.legend(false);
        chart.axis(false);
        chart.tooltip(false);
        chart.pieLabel({
            sidePadding: 40,
            label1: (data, color) => ({ text: data.name.toUpperCase(), fill: color }),
            label2: (data) => ({
                text: String(data.count),
                fill: '#808080',
                fontWeight: 'bold',
            }),
        });

        chart.interval().position('group*count').color('name').adjust('stack');

        chart.render();
        setGraph(chart);
        return chart;
    };

    return <View style={style}>{data.length && <F2Canvas onInit={initChart}></F2Canvas>}</View>;
}
