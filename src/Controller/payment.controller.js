const crypto = require('crypto');
const moment = require('moment');

exports.createPaymentUrl = async (req, res) => {
    const { orderId, amount, bankCode } = req.body;

    if (bankCode === 'VNPAY') {
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        let date = new Date();
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        
        let ipAddr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
        let tmnCode = process.env.VNP_TMN_CODE;
        let secretKey = process.env.VNP_HASH_SECRET;
        let vnpUrl = process.env.VNP_URL;
        let returnUrl = process.env.VNP_RETURN_URL;

        let vnp_Params = {
            'vnp_Version': '2.1.0',
            'vnp_Command': 'pay',
            'vnp_TmnCode': tmnCode,
            'vnp_Locale': 'vn',
            'vnp_CurrCode': 'VND',
            'vnp_TxnRef': orderId,
            'vnp_OrderInfo': 'Thanh toan cho ma GD:' + orderId,
            'vnp_OrderType': 'other',
            'vnp_Amount': amount * 100,
            'vnp_ReturnUrl': returnUrl,
            'vnp_IpAddr': ipAddr,
            'vnp_CreateDate': createDate
        };

        // Code sắp xếp object theo chuẩn VNPAY (cần viết hàm sortObject riêng)
        vnp_Params = sortObject(vnp_Params);

        let querystring = require('qs');
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer.from(signData, 'utf-8')).digest("hex"); 
        vnp_Params['vnp_SecureHash'] = signed;
        
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return res.status(200).json({ code: '00', data: vnpUrl });
    } else if (bankCode === 'MOMO') {
        // Logic băm dữ liệu tương tự cho MoMo bằng HMAC SHA256
        // ...
        return res.status(200).json({ code: '00', data: 'LINK_MOMO_TẠO_RA' });
    }
};

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj){
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}