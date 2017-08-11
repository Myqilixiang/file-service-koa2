var jwt = require('jwt-simple');
var moment = require('moment');
class TokenManager {
    jwtAuth(ctx, next) {
        var token = ctx.headers['authorization'];
        console.log("token验证过程中接受到的token:" + token)
        if (token) {
            var decoded = jwt.decode(token, new Buffer('AGREE_SECRET_STRING', 'base64'));
            console.log("token解码后的结果是：");
            console.log("iss:" + decoded.iss);
            console.log("exp:" + decoded.exp);
            console.log("当前时间：" + Date.now())
            if (decoded.exp <= Date.now()) {
                // 使用中间件后return需要修改为next回调函数
                // return res.json({ success: false, message: 'token过期.' });
                return false;
                ctx.end('Access token has expired', 400);
            }
            // 如果token依旧合法，我们可以从中检索出用户信息，并且附加到请求对象里面去：
            ctx.user = decoded.iss;
            // next();
            return true;
        } else {
            // return res.status(403).send({
            //     success: false,
            //     message: '没有提供token！'
            // });
            return false;
        }
    }
    generateToken(userId) {
        let expires = moment().add(2, 'hours').valueOf();
        let token = jwt.encode({
            iss: userId,
            exp: expires
        }, new Buffer('AGREE_SECRET_STRING', 'base64'));
        console.log("打印token")
        console.log(token)
        console.log("打印expires")
        console.log(expires)
        return token;
    }
    refreshToken(oldToken) {
        var decoded = jwt.decode(oldToken, new Buffer('AGREE_SECRET_STRING', 'base64'));
        let expires = moment().add(2, 'hours').valueOf();
        let token = jwt.encode({
            iss: decoded.iss,
            exp: expires
        }, new Buffer('AGREE_SECRET_STRING', 'base64'));
        return token;
    }
}
export default new TokenManager();