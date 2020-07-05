// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init({ env: 'nutriant-t53no', traceUser: true });

const db = cloud.database();
const col = cloud.database().collection('patients');
const _ = cloud.database().command;
const $ = cloud.database().command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();
    const { offset, size, listType, searchValue, timeOption, resultOption } = event;
    console.log('event', event);

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

    let final_filter;
    switch (listType) {
        // 获取自己的数据
        case 0:
            final_filter = {
                _openid: wxContext.OPENID,
                ...filter,
                enrolltime:
                    timeOption === 0
                        ? undefined
                        : timeOption === 2
                        ? _.lt(deadline)
                        : _.gte(deadline),
                stayoficu: resultOption === 0 ? undefined : resultOption === 1 ? 0 : _.gt(0),
            };
            break;
        // 获取全部数据
        case 2:
            final_filter = {
                ...filter,
                enrolltime:
                    timeOption === 0
                        ? undefined
                        : timeOption === 2
                        ? _.lt(deadline)
                        : _.gte(deadline),
                stayoficu: resultOption === 0 ? undefined : resultOption === 1 ? 0 : _.gt(0),
            };

            break;

        // 获取组内数据
        case 1:
            // 获取登录用户组内朋友的cocodes
            const { data } =
                (await db
                    .collection('users')
                    .where({
                        _openid: wxContext.OPENID,
                    })
                    .get()) || {};
            const { cocodes } = data[0];

            // 获取自己的cocode
            const { data: data1 } = await db
                .collection('cocodes')
                .where({ _openid: wxContext.OPENID })
                .get();
            const { cocode } = data1[0];

            // 获取所有的cocodes
            const groupCocodes1 = [
                cocode,
                ...cocodes.split(',').map((v) => v.trim().split('#')[0]),
            ];
            const data11 = await getAllcocodes(groupCocodes1);
            const groupCocodes = [...groupCocodes1, ...data11];

            console.log('最后的cocodes', groupCocodes);
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
                ...filter,
                enrolltime:
                    timeOption === 0
                        ? undefined
                        : timeOption === 2
                        ? _.lt(deadline)
                        : _.gte(deadline),
                stayoficu: resultOption === 0 ? undefined : resultOption === 1 ? 0 : _.gt(0),
            };

            break;
    }

    // result.found存储data
    const result = await getData(col, final_filter, offset, size);

    // 如果是全部的话，看作者，而不是监督员
    const openid_nicknames =
        listType === 2
            ? await getAuthorInfo(result.found, wxContext.OPENID)
            : await getSupervisorInfo(result.found, wxContext.OPENID);

    // 开始收集record数量
    const patient_ids = result.found.map((it) => it._id);
    console.log('patient_ids', patient_ids);

    // 汇总，该patient_id下记录有几条
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
        openid_nicknames,
    };
};

// 获取本人及组内朋友及他们邀请的人员的cocodes
async function getAllcocodes(cocodes) {
    console.log('邀请者', cocodes);
    // 增加该输入的参数
    // aggregate_cocodes.push(...cocodes);
    const result = await db
        .collection('cocodes')
        .where({ invitor: _.in(cocodes) })
        .get();
    if (result.data.length === 0) {
        return [];
    }
    const cocodes2 = result.data.map((it) => it.cocode);
    console.log('被邀请者们', cocodes2);
    const data = await getAllcocodes(drop_duplicate(cocodes2, cocodes));
    return [...cocodes2, ...data];
}

function drop_duplicate(sons, fathers) {
    let set = new Set(sons);
    for (const one of fathers) {
        if (set.has(one)) {
            set.delete(one);
        }
    }
    return [...set];
}

async function getAuthorInfo(found, OPENID) {
    const set = new Set(found.map((it) => it._openid));
    // 将监视者的_openid => user
    const { data: supervisors } = await db
        .collection('users')
        .where({
            _openid: _.in([...set]),
        })
        .get();

    const supervisor_openid_name = supervisors.reduce((accu, curr) => {
        accu.set(curr._openid, (curr.name || '') + '-' + curr.nickName + ',' + (curr.hosp || ''));
        return accu;
    }, new Map());

    console.log('supervisor_openid_name', supervisor_openid_name);

    const openid_nicknames = {};
    for (const key of set) {
        openid_nicknames[key] = supervisor_openid_name.get(key);
    }

    console.log('openid_nicknames', openid_nicknames);

    return openid_nicknames;
}

async function getSupervisorInfo(found, OPENID) {
    // 监督功能，所有查询到文档的作者Set
    const set = new Set(found.map((it) => it._openid));

    const map = new Map(); // _openid => cocode, cocode => invitor
    const code_openid = new Map(); // cocode => _open_id

    const { data: cocodes_array } = await db.collection('cocodes').get();
    // 如果cocodes数据集为空，直接返回
    if (cocodes_array.length === 0) {
        return {};
    }

    cocodes_array.forEach((item) => {
        if (!map.get(item._openid)) {
            // 所有使用者的 _openid 与 cocode对应起来
            map.set(item._openid, item.cocode);
            // 所有使用者 cocode 与 _openid 对应起来
            code_openid.set(item.cocode, item._openid);
        }

        if (item.invitor) {
            // 如果存在邀请者，则将使用者 指向 邀请者
            // 因为 cocode => '666666'
            // _openid => 'xxxxxx',两者的key不一样，所以都放在map里
            map.set(item.cocode, item.invitor);
        }
    });

    // 文档记录者_openid => 与查询者最近的被邀请者_openid
    const openid_openid = new Map();
    // 查询者的cocode
    const queryer_cocode = map.get(OPENID);

    set.forEach((_openid) => {
        // 将该记录的作者_openid拿过来找他的invitor,就是向上寻找他的邀请者
        let _openid_cocode = map.get(_openid);
        while (true) {
            const tmpcode = map.get(_openid_cocode);
            // 如果没有邀请者就直接写作者名字
            // 如果有邀请者 == 自己，就写他直接邀请的
            // 比如 我 (邀请)=> 1 => 2 => 3，如果3写了该记录，那么就会写1
            if (!tmpcode || tmpcode === queryer_cocode) {
                // 将该记录的作者 => 查询者最近邀请者的_openid
                openid_openid.set(_openid, code_openid.get(_openid_cocode));
                break;
            }
            _openid_cocode = tmpcode;
        }
    });

    // 将监视者的_openid => user
    const { data: supervisors } = await db
        .collection('users')
        .where({
            _openid: _.in(Array.from(openid_openid.values())),
        })
        .get();

    console.log('supervisors', supervisors);
    // 监督者_openid => 名字 + 医院
    const supervisor_openid_name = supervisors.reduce((accu, curr) => {
        accu.set(curr._openid, (curr.name || '') + '-' + curr.nickName + ',' + (curr.hosp || ''));
        return accu;
    }, new Map());

    console.log('supervisor_openid_name', supervisor_openid_name);

    const openid_nicknames = {};
    for (const [key, value] of openid_openid.entries()) {
        openid_nicknames[key] = supervisor_openid_name.get(value);
    }

    console.log('openid_nicknames', openid_nicknames);

    return openid_nicknames;
}

async function getData(col, filter, offset, size) {
    console.log('filter', filter, 'offset', offset, 'size', size);

    // 是不是里面有数据
    const none = Object.getOwnPropertyNames(filter).some((name) => !!filter[name]);
    if (none) {
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

    const { total } = await col.count();
    const result = await col
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
