// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async(event, context) => {
  const wxContext = cloud.getWXContext()

  const $ = cloud.database().command.aggregate;
  const years = await cloud.database().collection('patients').aggregate()
    .project({
      enrolltime: $.substrBytes(['$enrolltime', 0, 4])
    }).group({
      _id: '$enrolltime'
    }).end()


  return {
    event,
    years
  }
}