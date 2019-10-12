// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const _ = cloud.database().command;
    const $ = cloud.database().command.aggregate;
    const { year } = event;

    // 从今天往前退7天
    const date = new Date(new Date().getTime() - 7 * 1000 * 60 * 60 * 24);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const deadline = `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
    }`;

    // patients 表
    const col = db.collection('patients');

    // 获取登录用户信息
    const { data } =
        (await db
            .collection('users')
            .where({
                _openid: wxContext.OPENID,
            })
            .get()) || {};
    const { cocodes } = data[0];

    const { data: mycocodes } =
        (await db
            .collection('cocodes')
            .where({
                _openid: wxContext.OPENID,
            })
            .get()) || {};
    const { cocode } = mycocodes[0];

    // 获取所有的cocodes
    const groupCocodes = [cocode, ...cocodes.split(',').map(v => v.trim().split('#')[0])];
    const group_openid: Array<any> = [];

    let offset = 0;
    let size = 100;
    while (1) {
        const result = await db
            .collection('cocodes')
            .where({
                cocode: _.in(groupCocodes),
            })
            .skip(offset)
            .limit(size)
            .get();

        group_openid.push(...result.data.map(item => item._openid));
        console.log('get result', result.data, result.data.length, size, result.data.length < size);
        if (result.data.length < size) {
            break;
        }
        offset += size;
    }

    console.log('groupCocodes', groupCocodes, group_openid);

    // 将计算个人情况
    const yearCond =
        year !== '所有'
            ? {
                  enrolltime: _.and(_.gte(year), _.lt(`${parseInt(year) + 1}`)),
              }
            : {};
    const meCond = {
        _openid: wxContext.OPENID,
    };
    const groupCond = {
        _openid: _.in(group_openid),
    };
    // const aggrGroupCond = { _openid: $.in(group_openid)};

    const resultCond = {
        stayoficu: _.gt(0),
    };
    const weekCond = {
        enrolltime: _.lt(deadline),
    };

    const total = await col.where({ ...yearCond }).count();
    const groupTotal = await col.where({ ...yearCond, ...groupCond }).count();
    const meTotal = await col.where({ ...yearCond, ...meCond }).count();

    const resultTotal = await col.where({ ...yearCond, ...resultCond }).count();
    const groupResultTotal = await col.where({ ...yearCond, ...groupCond, ...resultCond }).count();
    const meResultTotal = await col.where({ ...yearCond, ...meCond, ...resultCond }).count();

    const weekTotal =
        year === '所有'
            ? await col.where({ ...weekCond }).count()
            : await col
                  .where({
                      enrolltime: _.lt(deadline).and(_.gte(year), _.lt(`${parseInt(year) + 1}`)),
                  })
                  .count();
    const groupWeekTotal =
        year === '所有'
            ? await col.where({ ...groupCond, ...weekCond }).count()
            : await col
                  .where({
                      ...groupCond,
                      enrolltime: _.lt(deadline).and(_.gte(year), _.lt(`${parseInt(year) + 1}`)),
                  })
                  .count();
    const meWeekTotal =
        year === '所有'
            ? await col.where({ ...meCond, ...weekCond }).count()
            : await col
                  .where({
                      ...meCond,
                      enrolltime: _.lt(deadline).and(_.gte(year), _.lt(`${parseInt(year) + 1}`)),
                  })
                  .count();

    // const diseaseGroup = year === '所有' ?
    //     await col.aggregate().group({ _id: '$diagnoseIndex', num: $.sum(1) }).end() :
    //     await col.aggregate().match({...yearCond}).group({_id: '$diagnoseIndex', num:$.sum(1)}).end();

    // const meDiseaseGroup = year === '所有' ?
    //     await col.aggregate().match({...meCond}).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end() :
    //     await col.aggregate().match({ ...yearCond, ...meCond }).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end();

    // const groupDiseaseGroup = year === '所有' ?
    //   await col.aggregate().match({ ...aggrGroupCond }).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end() :
    //   await col.aggregate().match({ ...yearCond, ...aggrGroupCond }).group({ _id: '$diagnoseIndex', num: $.sum(1) }).end();

    // const nutrientGroup = year === '所有' ?
    //     await col.aggregate().group({ _id: '$useSmallPeptide', num: $.sum(1) }).end() :
    //     await col.aggregate().match({ ...yearCond }).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end();

    // const meNutrientGroup = year === '所有' ?
    //   await col.aggregate().match({...meCond}).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end() :
    //   await col.aggregate().match({ ...yearCond, ...meCond }).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end();

    // const groupNutrientGroup = year === '所有' ?
    //   await col.aggregate().match({...aggrGroupCond}).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end() :
    //   await col.aggregate().match({ ...yearCond,...aggrGroupCond}).group({ _id: '$useSmallPeptide', num: $.sum(1) }).end();

    return {
        event,

        total: total.total,
        groupTotal: groupTotal.total,
        meTotal: meTotal.total,

        resultTotal: resultTotal.total,
        groupResultTotal: groupResultTotal.total,
        meResultTotal: meResultTotal.total,

        weekTotal: weekTotal.total,
        groupWeekTotal: groupWeekTotal.total,
        meWeekTotal: meWeekTotal.total,
    };
};
