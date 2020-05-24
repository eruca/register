import Taro, { useState } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { useSelector } from '@tarojs/redux';
import { AtSegmentedControl } from 'taro-ui';

import { IReducers } from '../../reducers';
import RecordSegment from './RecordSegment';
import ResultSegment from './ResultSegment';
import RecordGraph from './RecordGraph';
import './index.scss';

export default function Grid() {
    const { patient_id, enrolltime, hospId, name } = useSelector((state: IReducers) => ({
        ...state.patients,
    }));

    if (patient_id === '') {
        return <View>没有数据</View>;
    }

    const [segmentIndex, setSegmentIndex] = useState<number>(0);

    return (
        <View>
            <View style="margin-bottom:5px">{`${hospId}-${name}: ${enrolltime}`}</View>
            <AtSegmentedControl
                values={['记录', '图示', '结局']}
                selectedColor="#FF4949"
                onClick={(v) => setSegmentIndex(v)}
                current={segmentIndex}
            />
            {segmentIndex === 0 && <RecordSegment />}
            {segmentIndex === 1 && <RecordGraph />}
            {segmentIndex === 2 && <ResultSegment />}
        </View>
    );
}

Grid.config = {
    navigationBarTitleText: '日期',
};

// Grid.options = {
//     addGlobalClass: true,
// };
