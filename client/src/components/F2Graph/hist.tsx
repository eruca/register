import Taro, { useState, useMemo } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { F2Canvas } from 'taro-f2';
import F2 from '@antv/f2/lib/index-all';
import { CSSProperties } from 'react';

export type HistDataType = {
    bin: number;
    value: number;
};

type HistProps = {
    values: number[];
    bins: number[];
    binsSorted?: boolean;
    style?: CSSProperties;
};

export default function Hist({
    values = [],
    bins = [],
    binsSorted,
    style = { width: '100%', height: '450rpx' },
}: HistProps) {
    const [graph, setGraph] = useState(null);
    const data = useMemo(() => formatHistData(values, bins, binsSorted), [
        values,
        bins,
        binsSorted,
    ]);

    if (graph && values.length > 0) {
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
    console.log("values.length", values)

    return <View style={style}>{values.length && <F2Canvas onInit={initChart} />}</View>;
}

function formatHistData(values: number[], bins: number[], binsSorted?: boolean): HistDataType[] {
    if (values.length === 0) {
        return []
    }

    if (!binsSorted) {
        bins.sort();
    }

    let left = bins[0];
    const result: HistDataType[] = bins.slice(1).map((bin) => {
        const result1 = {
            bin: (left + bin) / 2,
            value: 0,
        };
        left = bin;
        return result1;
    });

    for (const value of values) {
        if (value < bins[0] || value > bins[bins.length - 1]) {
            console.error('bins 无法容纳所有数据');
            return [];
        }

        for (let i = 0; i < bins.length; i++) {
            if (value === bins[i]) {
                result[i].value += 1;
                break;
            } else if (value < bins[i]) {
                result[i - 1].value += 1;
                break;
            }
        }
    }
    return result;
}
