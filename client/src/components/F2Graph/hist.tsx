import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { F2Canvas } from 'taro-f2';
import F2 from '@antv/f2/lib/index-all';
import { CSSProperties } from 'react';

export type HistDataType = {
    bin: number;
    value: number;
};

type HistProps = {
    data: HistDataType[];
    binsSorted?: boolean;
    style?: CSSProperties;
};

export default function Hist({
    data = [],
    style = { width: '100%', height: '450rpx' },
}: HistProps) {
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
        chart.axis('bins', {
            label: (text, index, total) => {
                console.log('bins label', text, index, total);
                return {
                    textAlign: 'start',
                    text: text.toString(),
                };
            },
        });

        chart.interval().position('bin*value');

        chart.render();
        setGraph(chart);
        return chart;
    };
    console.log('values.length', data);

    return <View style={style}>{data.length && <F2Canvas onInit={initChart} />}</View>;
}

