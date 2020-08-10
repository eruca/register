// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init();

const nodemailer = require('nodemailer');
const config = {
    host: 'smtp.qq.com',
    port: 465,
    auth: {
        user: '81233890@qq.com',
        pass: 'qcgoksfckuogbihe',
    },
};

// email正则
// const mail_regexp = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
const mail_regexp = /^([a-zA-Z0-9_\-\.])+@([a-zA-Z0-9_\-\.])+(\.[a-zA-Z0-9_-]+)+$/;

const transporter = nodemailer.createTransport(config);

const LIMIT = 1000; // 云数据库端limit = 1000;

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext();

    const { data: users } = await cloud
        .database()
        .collection('users')
        .where({ _openid: wxContext.OPENID })
        .get();
    if (users.length !== 1) {
        return {
            success: false,
            msg: '用户不是1个',
        };
    }
    const mailto = users[0].mail;
    if (!mailto || !mail_regexp.test(mailto)) {
        return {
            success: false,
            msg: '邮箱没有或格式错误',
        };
    }

    const patients = await getData(wxContext.OPENID, 'patients');
    const records = await getData(wxContext.OPENID, 'records');

    const patients_string = JSON.stringify(patients);
    const records_string = JSON.stringify(records);

    mail = {
        from: ' 来自项目 <81233890@qq.com>',
        subject: '我的贡献',
        to: mailto,
        text:
            '数据在附件里, 可以将数据使用https://json-csv.com/进行转换为excel文件, 有问题可以邮件或微信沟通!!!',
        attachments: [
            {
                filename: 'patient.json',
                content: patients_string,
            },
            {
                filename: 'records.json',
                content: records_string,
            },
        ],
    };

    const info = await transporter.sendMail(mail);
    console.log('sendmail result:info', info);

    if (info['response'].indexOf('OK') > -1) {
        return {
            success: true,
            msg: '发送成功，请查收',
        };
    }

    return {
        success: false,
        msg: '发送邮件失败，请再次确认邮箱写正确，再请联系管理员',
    };
};

// 获取病人的信息
async function getData(_openid, collection) {
    const { total } = await cloud.database().collection(collection).where({ _openid }).count();

    if (total <= LIMIT) {
        const result = await cloud.database().collection(collection).where({ _openid }).get();
        console.log('result:', result);

        return result.data;
    }

    const array = [];
    let skip = 0;
    while (array.length < total) {
        const { data } = await cloud
            .database()
            .collection(collection)
            .where({ _openid })
            .skip(skip)
            .limit(LIMIT)
            .get();
        array.push(...data);
        skip += LIMIT;
    }

    return array;
}
