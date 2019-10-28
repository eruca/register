// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  try {
    const records = (await db.collection('users').where({
      _openid: wxContext.OPENID
    }).get()).data || [];

    console.log("find records:", records.length);
    if (records && records.length === 0) {
      return {
        event,
        openid: wxContext.OPENID,
        result: 2
      }
    }
    // 找到本人record
    const record = records[0];

    let invite_code = record.invite_code;
    // 如有有邀请权限，产生邀请码
    if (record.authority >= 2 && !invite_code) {
      invite_code = gen_code();
    }

    const mycocodes = await db.collection('cocodes').where({
      _openid: wxContext.OPENID
    }).get();

    let cocode;
    if (!mycocodes || !mycocodes.data || mycocodes.data.length === 0) {
      cocode = await gen_cocode();
      await db.collection('cocodes').add({
        data: {
          _openid: wxContext.OPENID,
          cocode,
          nickname: record.nickName,
        }
      })
    } else {
      cocode = mycocodes.data[0].cocode;
    }

    // 如果初始invite_code 和 invite_code 不一样，就是更改了
    // 就是更新数据库信息
    if (record.invite_code !== invite_code) {
      await db.collection('users').doc(record._id).update({
        data: {
          invite_code,
        }
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
      result: 1
    }

  } catch (e) {
    console.error(e);
    return {
      code: 500,
      message: '服务器错误',
      result: 2
    }
  }
}

function gen_code() {
  const code = Math.floor(Math.random() * 1000000).toString();
  if (code.length < 6) {
    return '0'.repeat(6 - code.length) + code;
  }

  return code;
}

async function gen_cocode() {
  let cocode = gen_code();
  while (true) {
    const rows = await db.collection('cocodes').where({
      cocode
    }).count();

    if (rows.total === 0) {
      return cocode;
    }

    cocode = gen_code();
  }
}