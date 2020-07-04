// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const $ = cloud.database().command.aggregate;

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  const result = await cloud.database().collection("patients").aggregate().group({
      _id:null,
      projects: $.addToSet('$projectName')
  }).end();

  console.log("result", result);
  return result;
}