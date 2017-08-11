var mysql = require('mysql');
class MySqlOption {
    constructor() {
        this.connection = mysql.createConnection({
            host: '192.9.210.86',
            port: 3306,
            database: 'acms',
            user: 'root',
            multipleStatements: true,
            password: 'root123456'
        });
    }
    connect() {
        this.connection.connect(function(err) {
            if (err) {
                console.log("数据库连接失败！");
                console.log(err)
            } else {
                console.log("数据库连接成功！");
                // connection.end(function(err) {
                //     if (err) {
                //         console.log("关闭MySQL数据库操作失败！");
                //     } else {
                //         console.log("关闭数据库操作成功！");
                //     }
                // });
            }
        });
        this.connection.on('error', function(err) {
            if (err.code === 'PROTOCOL_CONNECTION_LOST') {
                console.log("与数据库的连接丢失！");
            }
        });
    }
}
export default new MySqlOption();
// db.query = async function(sql, value) {
//     return new Promise((resolve, reject) => {
//         mysqlPool.query(sql, value, function(err, results, fields) {
//             if (err) {
//                 reject(Error(err))
//             } else {
//                 resolve(results)
//             }
//         })
//     })
// }

// db.queryAsync = function(sql, value, cb) {
//     mysqlPool.query(sql, value, function(err, results, fields) {
//         cb(err, results, fields)
//     })
// }