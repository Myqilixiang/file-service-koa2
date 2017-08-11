'use strict';

import Router from 'koa-router';
import MainController from '../controllers/main_controller'
const router = new Router();

router.get('/app', MainController.getUser)

router.get('/as', async(ctx, next) => {
    console.log(ctx.request)
    ctx.response.body = {
        "status1": "home22",
        "status2": "app1"
    }
})
router.get('/user', async(ctx, next) => {
    ctx.response.body = `<h1>Index</h1>
        <form action="/signin" method="post">
            <p>Name: <input name="name" value="koa"></p>
            <p>Password: <input name="password" type="password"></p>
            <p><input type="submit" value="Submit"></p>
        </form>`;
});
router.post('/signin', async(ctx, next) => {
    var
        name = ctx.request.body.name || '',
        password = ctx.request.body.password || '';
    console.log(`signin with name: ${name}, password: ${password}`);
    if (name === 'koa' && password === '12345') {
        ctx.response.body = {
            msg: "success"
        };
    } else {
        ctx.response.body = {
            msg: "falid"
        };
    }
});


export default router;