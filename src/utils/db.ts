import Taro from '@tarojs/taro';

const db = Taro.cloud.database();

export default db;
export const patientsCollection = db.collection('patients');
export const recordsCollection = db.collection('records');
