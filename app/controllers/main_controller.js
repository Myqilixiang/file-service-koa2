//获取用户
exports.getUser = async(ctx, next) => {
    console.log(ctx)
    ctx.body = {
        "status1": "home",
        "status2": "app"
    }
}