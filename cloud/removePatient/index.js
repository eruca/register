// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    const { patientid } = event;

    const {
        stats: { removed },
    } = await cloud.database().collection('patients').doc(patientid).remove();

    if (removed < 1) {
        return { patients: 0, records: 0 };
    }

    const {
        stats: { removed: removed2 },
    } = await cloud.database().collection('records').where({ patientid }).remove();

    return { patients: 1, records: removed2 };
};
