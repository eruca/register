// 云函数入口文件
const cloud = require('wx-server-sdk');

cloud.init();

const db = cloud.database();

const existUser = 1;
const nonExistUser = 2;
const codeCount = 6; // 协作码、邀请码的位数

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    try {
        const records =
            (
                await db
                    .collection('users')
                    .where({
                        _openid: wxContext.OPENID,
                    })
                    .get()
            ).data || [];

        console.log('find records:', records.length);
        if (records && records.length === 0) {
            return {
                event,
                openid: wxContext.OPENID,
                result: nonExistUser, // 代表是新用户
            };
        }
        // 找到本人record
        const record = records[0];

        let invite_code = record.invite_code;
        // 如有有邀请权限，产生邀请码
        if (record.authority >= 2 && !invite_code) {
            invite_code = gen_code();
        }

        const mycocodes = await db
            .collection('cocodes')
            .where({
                _openid: wxContext.OPENID,
            })
            .get();

        let cocode;
        if (!mycocodes || !mycocodes.data || mycocodes.data.length === 0) {
            cocode = await gen_cocode();
            await db.collection('cocodes').add({
                data: {
                    _openid: wxContext.OPENID,
                    cocode,
                    nickname: record.nickName,
                },
            });
        } else {
            cocode = mycocodes.data[0].cocode;
        }

        // 如果初始invite_code 和 invite_code 不一样，就是更改了
        // 就是更新数据库信息
        if (record.invite_code !== invite_code) {
            await db.collection('users').doc(record._id).update({
                data: {
                    invite_code,
                },
            });
        }

        return {
            event,
            openid: wxContext.OPENID,
            record: {
                ...record,
                invite_code,
                cocode,
            },
            result: existUser,
        };
    } catch (e) {
        console.error(e);
        return {
            code: 500,
            message: '服务器错误',
            result: nonExistUser,
        };
    }
};

function gen_code(codeCount2 = codeCount) {
    // 随机产生一个6位数，如果未达到6位前面加0
    // Math.random() => [0, 1] * 1000000 => [0, 1000000]
    const code = Math.floor(Math.random() * Math.pow(10, codeCount2)).toString();
    if (code.length < codeCount2) {
        return '0'.repeat(codeCount2 - code.length) + code;
    }

    return code;
}

async function gen_cocode() {
    // 生成随机6位码
    let cocode = gen_code();
    // 查找是否已经已经有相同的存在了
    while (true) {
        const rows = await db
            .collection('cocodes')
            .where({
                cocode,
            })
            .count();

        if (rows.total === 0) {
            return cocode;
        }

        cocode = gen_code();
    }
}
