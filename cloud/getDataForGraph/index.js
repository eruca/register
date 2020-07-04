// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();
const _ = cloud.database().command;
const $ = cloud.database().command.aggregate;

const LIMIT = 1000;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    console.log('event', event);
    const { listType, table, query, drawstyle, params, project } = event;

    const filter = await getFriends(wxContext.OPENID, listType);
    console.log('filter', filter);
    const filter2 = await getProjectfilter(table, project);
    console.log('filter2', filter2);

    const array = await getData(table, { ...filter, ...filter2 }, query);

    console.log('array', array);
    const result = getResult(array, query, drawstyle, params);

    return result;
};

async function getProjectfilter(table, project) {
    if (project === '全部') {
        return {};
    }
    if (table === 'patients') {
        return { projectName: project };
    }

    const { data: ids } = await db
        .collection('patients')
        .where({ projectName: project })
        .field({ _id: 1 })
        .get();
    return { patientid: _.in(ids.map((x) => x._id)) };
}

function pie(array, query, names) {
    if (array.length === 0) {
        return { data: [] };
    }
    // 如果是布尔类型，比如:isMale:true
    if (typeof array[0][query[0]] === 'boolean') {
        const true_length = array.filter((item) => item[query[0]]).length;
        return {
            data: [
                {
                    name: names[0],
                    count: array.length - true_length,
                    group: '1',
                },
                { name: names[1], count: true_length, group: '1' },
            ],
        };
    }

    if (typeof array[0][query[0]] === 'number') {
        const length = names.length;
        const values = [];
        const result = [];
        for (let i = 0; i < length; i++) {
            values.push(0);
            result.push({ name: `${query[0]} ${names[i]}`, group: '1' });
        }
        array.forEach((item) => {
            values[item[query[0]]] += 1;
        });
        console.log('values in pie', values);
        for (let i = 0; i < length; i++) {
            result[i]['count'] = values[i];
        }
        return { data: result };
    }
}

function getResult(array, query, drawstyle, params) {
    switch (drawstyle) {
        case 'pie': {
            const names = params.split(',');
            return pie(array, query, names);
        }
        case 'hist': {
            if (array.length === 0) {
                return { data: [], err: '数据为空' };
            }
            const bins = params.split(',').map((it) => parseFloat(it));
            bins.sort((a, b) => a - b);

            let left = bins[0];
            const result = bins.slice(1).map((bin) => {
                const res1 = {
                    bin: [left, bin],
                    value: 0,
                };
                left = bin;
                return res1;
            });
            console.log('result', result, 'bins', bins, typeof bins[0]);

            const length = bins.length;
            for (const item of array) {
                if (item[query[0]] < bins[0] || item[query[0]] > bins[length - 1]) {
                    console.error('bins 无法容纳所有数据');
                    return { data: [], err: 'bins 无法容纳所有数据' };
                }

                for (let i = 0; i < length; i++) {
                    if (item[query[0]] === bins[i]) {
                        result[i].value += 1;
                        break;
                    } else if (item[query[0]] < bins[i]) {
                        result[i - 1].value += 1;
                        break;
                    }
                }
            }
            return { data: result };
        }
    }
}

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

// @query: ['age',...]
async function getData(table, filter, query) {
    // none 代表filter是不是{}里有数据
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
