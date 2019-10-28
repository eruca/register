// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext();
  const {
    invitor,
    code,
    nickname
  } = event; // invitor是邀请者协作码，code是邀请码

  const {
    data
  } = await cloud.database()
    .collection("cocodes")
    .where({
      cocode: invitor
    })
    .get();
  console.log("data from invitor", data);
  if (!data || data.length !== 1) {
    return {
      event,
      success: false,
      error: "操作失败，请核对信息"
    }
  }

  const sender = await cloud.database().collection("users").where({
    _openid: data[0]._openid
  }).get();
  console.log("sender", sender);

  if (!sender || sender.data.length !== 1) {
    return {
      event,
      success: false,
      error: "操作失败，请核对信息"
    }
  }

  console.log("sendor.data[0].invite_code", sender.data[0].invite_code, code);
  if (sender.data[0].authority < 2 || sender.data[0].invite_code !== code) {
    return {
      event,
      success: false,
      error: "操作失败，请核对信息"
    }
  }

  try {
    // 为邀请者产生新的邀请码
    const result = await cloud.database().collection('users').doc(sender.data[0]._id).update({
      data: {
        invite_code: gen_code(),
      }
    });
    console.log("重置邀请码 结果", result);
    // 如果邀请码产生成功，则将被邀请者的权限改为1
    if (result.stats.updated === 1) {
      const result1 = await cloud.database().collection("users").where({
        _openid: wxContext.OPENID
      }).update({
        data: {
          authority: 1,
        }
      });

      console.log("result update authority", result1, typeof result1.stats.updated, result1.stats.updated !== 1);
      if (result1.stats.updated !== 1) {
        return {
          event,
          success: false,
          error: '更新权限失败'
        }
      } else {
        await cloud.database().collection('cocodes').where({
          _openid: wxContext.OPENID
        }).update({
          data: {
            invitor: invitor,
          }
        })
      }
    }

  } catch (e) {
    return {
      event,
      success: false,
      error: '操作失败'
    }
  }

  return {
    event,
    success: true
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