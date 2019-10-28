import dayjs from 'dayjs';

// 验证机械通气时间和住院时间
export function validateResult(venttime: string, stayoficu: string, admittime: string): string {
    if (venttime == '') {
        return '机械通气时间不能为空';
    }
    if (stayoficu == '') {
        return '入住时间不能为空';
    }

    const actualStay = dayjs().diff(dayjs(admittime), 'day');
    const ventTime = parseInt(venttime);
    const dayOfStay = parseInt(stayoficu);
    if (ventTime > actualStay) {
        return '机械通气时间不能长于住院时间';
    }
    if (dayOfStay > actualStay) {
        return '机械通气时间不能长于住院时间';
    }
    return '';
}
