import Taro, { useState, useMemo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { F2Canvas } from 'taro-f2';
import F2 from '@antv/f2/lib/index-all';
import { CSSProperties } from 'react';

type PieDataType = {
    name: string;
    count: number;
    group: string;
};

type PieProps = {
    names: string[];
    input: boolean[];
    radius?: number;
    style?: CSSProperties;
};

export function formatPieData(names: string[], input: boolean[]): PieDataType[] {
    const length = input.length;
    const true_count = input.filter((item) => item).length;

    return [
        {
            name: names[1],
            count: true_count,
            group: '1',
        },
        {
            name: names[0],
            count: length - true_count,
            group: '1',
        },
    ];
}

export default function Pie({
    names = ['0', '1'],
    input = [],
    radius = 0.85,
    style = { width: '100%', height: '450rpx' },
}: PieProps) {
    const [graph, setGraph] = useState(null);
    const data = useMemo(() => formatPieData(names, input), [names, input]);

    if (graph && input.length > 0) {
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
            label1: (data, color) => ({ text: data.name, fill: color }),
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

    return <View style={style}>{input.length && <F2Canvas onInit={initChart}></F2Canvas>}</View>;
}
