import Router from 'koa-router';
const router = new Router();
import FileManager from '../controllers/file-conrtoller/file-manager';

//初始化获取文件树数据结构
router.get('/projects/:project_name', FileManager.initFileTree)
export default router;