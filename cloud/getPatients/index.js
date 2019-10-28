// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const { offset, size, listType, searchValue, timeOption, resultOption } = event;
  console.log('event', event);

  const db = cloud.database();
  const col = cloud.database().collection('patients');
  const _ = cloud.database().command;
  const $ = cloud.database().command.aggregate;

  // 从今天往前退7天
  const date = new Date(new Date().getTime() - 7 * 1000 * 60 * 60 * 24);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const deadline = `${date.getFullYear()}-${month < 10 ? `0${month}` : month}-${
    day < 10 ? `0${day}` : day
    }`;

  const filter =
    searchValue === ''
      ? {}
      : {
        name: db.RegExp({
          regexp: searchValue.split('').join('.*'),
          options: 'i',
        }),
      };

  let result;
  switch (listType) {
    case 0:
      result = await getData(
        col,
        {
          _openid: wxContext.OPENID,
          ...filter,
          enrolltime:
            timeOption === 0
              ? undefined
              : timeOption === 2
                ? _.lt(deadline)
                : _.gte(deadline),
          stayoficu: resultOption === 0 ? undefined : resultOption === 1 ? 0 : _.gt(0),
        },
        offset,
        size
      );
      break;
    case 2:
      result = await getData(
        col,
        {
          ...filter,
          enrolltime:
            timeOption === 0
              ? undefined
              : timeOption === 2
                ? _.lt(deadline)
                : _.gte(deadline),
          stayoficu: resultOption === 0 ? undefined : resultOption === 1 ? 0 : _.gt(0),
        },
        offset,
        size
      );
      break;
    case 1:
      // 获取登录用户信息
      const { data } =
        (await db
          .collection('users')
          .where({
            _openid: wxContext.OPENID,
          })
          .get()) || {};
      const { cocode, cocodes } = data[0];

      // 获取所有的cocodes
      const groupCocodes = [cocode, ...cocodes.split(',').map(v => v.trim().split('#')[0])];
      const group_openid = [];

      let skip = 0;
      let tmpSize = 100;
      while (1) {
        const result = await db
          .collection('cocodes')
          .where({
            cocode: _.in(groupCocodes),
          })
          .skip(skip)
          .limit(tmpSize)
          .get();

        group_openid.push(...result.data.map(item => item._openid));
        console.log(
          'get result',
          result.data,
          result.data.length,
          tmpSize,
          result.data.length < tmpSize
        );
        if (result.data.length < tmpSize) {
          break;
        }
        skip += tmpSize;
      }

      result = await getData(
        col,
        {
          _openid: _.in(group_openid),
          ...filter,
          enrolltime:
            timeOption === 0
              ? undefined
              : timeOption === 2
                ? _.lt(deadline)
                : _.gte(deadline),
          stayoficu: resultOption === 0 ? undefined : resultOption === 1 ? 0 : _.gt(0),
        },
        offset,
        size
      );
      break;
  }

  // 开始收集record数量
  const patient_ids = result.found.map(it => it._id);
  console.log('patient_ids', patient_ids);

  const { list } = await db
    .collection('records')
    .aggregate()
    .match({ patientid: $.in(patient_ids) })
    .group({ _id: '$patientid', num: $.sum(1) })
    .end();

  console.log('list', list);
  return {
    event,
    list,
    ...result,
    offset,
  };
};

async function getData(col, filter, offset, size) {
  const { total } = await col.where(filter).count();
  const result = await col
    .where(filter)
    .skip(offset)
    .limit(size)
    .orderBy('enrolltime', 'desc')
    .orderBy('hospId', 'asc')
    .get();

  return {
    found: result.data,
    total,
  };
}
