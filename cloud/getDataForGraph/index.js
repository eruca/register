// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const _ = cloud.database().command;
// const $ = cloud.database().command.aggregate;

const LIMIT = 1000;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    console.log('event', event);
    const { listType, table, query } = event;

    const filter = await getFriends(wxContext.OPENID, listType);

    console.log('filter', filter);
    const array = await getData(table, filter, query);

    console.log('array', array);

    return {
        array,
    };
};

// 获取自己还是组内还是所有
async function getFriends(_openid, listType) {
    let final_filter;
    switch (listType) {
        // 获取自己的数据
        case 0:
            final_filter = {
                _openid,
            };
            break;
        // 获取全部数据
        case 2:
            final_filter = {};
            break;

        // 获取组内数据
        case 1:
            // 获取登录用户信息
            const { data } =
                (await db
                    .collection('users')
                    .where({
                        _openid,
                    })
                    .get()) || {};
            const { cocodes } = data[0];

            const { data: data1 } = await db.collection('cocodes').where({ _openid }).get();
            const { cocode } = data1[0];

            // 获取所有的cocodes
            const groupCocodes = [cocode, ...cocodes.split(',').map((v) => v.trim().split('#')[0])];
            const group_openid = [];

            let skip = 0;
            let tmpSize = 100;
            while (true) {
                const result = await db
                    .collection('cocodes')
                    .where({
                        cocode: _.in(groupCocodes),
                    })
                    .skip(skip)
                    .limit(tmpSize)
                    .get();

                group_openid.push(...result.data.map((item) => item._openid));
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

            final_filter = {
                _openid: _.in(group_openid),
            };

            break;
    }

    return final_filter;
}

// 获取该次查询总的数据量
async function getCount(table, filter = {}) {
    // 是不是里面有数据
    const none = Object.getOwnPropertyNames(filter).some((name) => !!filter[name]);
    // 如果里面有东西
    if (none) {
        const { total } = await db.collection(table).where(filter).count();
        return { total, none };
    }

    const { total } = await db.collection(table).count();
    return { total, none };
}

async function getData(table, filter, query) {
    const { total, none } = await getCount(table, filter);
    const fields = query.reduce((accu, item) => {
        accu[item] = true;
        return accu;
    }, {});

    console.log('fields', fields, 'total', total, 'none', none);
    let result = { data: [] };
    if (total <= LIMIT) {
        if (none) {
            result = await db.collection(table).where(filter).field(fields).get();
        } else {
            result = await db.collection(table).field(fields).get();
        }
        return result.data;
    }

    return await getCircleData(table, filter, total, none, fields);
}

// 获取长度大于LIMIT的数据
async function getCircleData(table, filter, total, none, fields) {
    const array = [];
    let skip = 0;

    if (none) {
        while (array.length < total) {
            const { data } = await db
                .collection(table)
                .where(filter)
                .skip(skip)
                .limit(LIMIT)
                .field(fields)
                .get();
            array.push(...data);
            skip += LIMIT;
        }
    } else {
        while (array.length < total) {
            const { data } = await db.collection(table).skip(skip).limit(LIMIT).field(fields).get();
            array.push(...data);
            skip += LIMIT;
        }
    }
    return array;
}
