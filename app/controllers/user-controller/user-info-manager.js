import MySqlOption from '../../lib/db';
import TokenManager from '../../utils/token-manager';
class UserInfoOption {
    loginVerify(ctx, next) {
        let username = ctx.params.username;
        let password = ctx.params.password;
        let query = 'SELECT PASSWORD FROM users WHERE NAME=?';
        TokenManager.jwtAuth(ctx, next)
        MySqlOption.connection.query(query, [username], function(err, result) {
            console.log("当前查询用户名：" + username);
            if (err) {
                console.log(err);
                console.log("数据库查询失败");
                ctx.response.body = "用户名密码错误！";
            } else {
                let _result = JSON.parse(JSON.stringify(result));
                console.log("查询结果：" + _result[0].PASSWORD)
                if (_result[0].PASSWORD == password) {
                    let token = TokenManager.generateToken(username);
                    ctx.response.setHeader('Authorization', token);
                    ctx.response.bodyd(token);
                }
            }
        })
    }
}
export default new UserInfoOption();