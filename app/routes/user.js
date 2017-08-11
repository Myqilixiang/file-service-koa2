import Router from 'koa-router';
const router = new Router();
import UserInfoManager from '../controllers/user-controller/user-info-manager';

//初始化获取文件树数据结构
router.get('/login/:username/:password', UserInfoManager.loginVerify)
export default router;