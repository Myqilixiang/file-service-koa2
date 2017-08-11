import Router from 'koa-router';
const router = new Router();
import FileManager from '../controllers/file-conrtoller/file-manager';


//初始化获取iframe中vuetree请求
router.get('/files/*', FileManager.getFileData);
//design过程UI操作后的保存请求
router.post('/files/*', FileManager.saveFileData);
//创建文件或文件夹
router.post('/file/creation', FileManager.createFile);
//重命名文件或文件夹
router.post('/file/rename', FileManager.renameFile);
//删除文件
router.post('/file/deletion', FileManager.deleteFile);

export default router;