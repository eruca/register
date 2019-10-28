// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()
  const {
    year
  } = event;

  console.log('year', year)
  const nextYear = `${parseInt(year) + 1}`;

  const db = cloud.database();
  const _ = cloud.database().command;
  const $ = cloud.database().command.aggregate;
  const col = cloud.database().collection('patients');

  // 获取登录用户信息
  const { data } = await db.collection('users').where({
    _openid: wxContext.OPENID
  }).get() || {};
  const { cocodes = "" } = data[0];

  const {
    data: mycocodes
  } = await db.collection('cocodes').where({
    _openid: wxContext.OPENID
  }).get() || {};
  const {
    cocode
  } = mycocodes[0];

  // 获取所有的cocodes
  const groupCocodes = [cocode, ...cocodes.split(",").map(v => v.trim().split('#')[0])];
  const group_openid = [];

  let offset = 0;
  let size = 100;
  while (1) {
    const result = await db.collection('cocodes')
      .where({ cocode: _.in(groupCocodes) })
      .skip(offset)
      .limit(size)
      .get();

    group_openid.push(...result.data.map(item => item._openid));
    console.log("get result", result.data, result.data.length, size, result.data.length < size);
    if (result.data.length < size) {
      break;
    }
    offset += size;
  }

  console.log("groupCocodes", groupCocodes, group_openid);

  // 将计算个人情况
  const yearCond = { enrolltime: _.and(_.gt(year), _.lt(nextYear)) };
  const meCond = { _openid: wxContext.OPENID };
  const aggrGroupCond = { _openid: $.in(group_openid) };

  const diseaseGroup = year === '所有' ?
    await col.aggregate().group({ _id: '$diagnoseIndex', num: $.sum(1) }).end() :
    await col.aggregate().match($.and([{enrolltime: $.gt(year)}, {enrolltime: $.lt(nextYear)}])).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end();

  const meDiseaseGroup = year === '所有' ?
    await col.aggregate().match({ ...meCond }).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end() :
    await col.aggregate().match($.and([{ enrolltime: $.gt(year) }, { enrolltime: $.lt(nextYear) }])).match({ ...meCond}).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end();

  const groupDiseaseGroup = year === '所有' ?
    await col.aggregate().match({ ...aggrGroupCond }).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end() :
    await col.aggregate().match($.and([{ enrolltime: $.gt(year) }, { enrolltime: $.lt(nextYear) }])).match({ ...aggrGroupCond }).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end();


  const nutrientGroup = year === '所有' ?
    await col.aggregate().group({ _id: '$useSmallPeptide', num: $.sum(1) }).end() :
    await col.aggregate().match($.and([{ enrolltime: $.gt(year) }, { enrolltime: $.lt(nextYear) }])).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end();

  const meNutrientGroup = year === '所有' ?
    await col.aggregate().match({ ...meCond }).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end() :
    await col.aggregate().match($.and([{ enrolltime: $.gt(year) }, { enrolltime: $.lt(nextYear) }])).match({ ...meCond }).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end();

  const groupNutrientGroup = year === '所有' ?
    await col.aggregate().match({ ...aggrGroupCond }).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end() :
    await col.aggregate().match($.and([{ enrolltime: $.gt(year) }, { enrolltime: $.lt(nextYear) }])).match({ ...aggrGroupCond }).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end();

  
  return {
    event,

    diseaseGroup: diseaseGroup.list,
    groupDiseaseGroup: groupDiseaseGroup.list,
    meDiseaseGroup: meDiseaseGroup.list,

    nutrientGroup: nutrientGroup.list,
    groupNutrientGroup: groupNutrientGroup.list,
    meNutrientGroup: meNutrientGroup.list
  }
}