'use strict';
//import路由
import Router from 'koa-router';
import compose from 'koa-compose';

import ProjectRoute from './project';
import FileRoute from './file';
import UserRoute from './user';
//创建实例
const router = new Router();

//启用路由
router.use(ProjectRoute.routes(), ProjectRoute.allowedMethods());
router.use(FileRoute.routes(), FileRoute.allowedMethods());
router.use(UserRoute.routes(), UserRoute.allowedMethods());
export default function routes() {
    return compose(
        [
            router.routes(),
            router.allowedMethods()
        ]
    )
}