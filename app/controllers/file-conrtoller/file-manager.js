import FileTreeOpt from './file-options';
class FileTreeManager {
    //文件树操作相关
    async initFileTree(ctx, next) {
        let path = ctx.params.project_name;
        let result = FileTreeOpt.initFileTree(path);
        ctx.response.body = result;
    }
    async createFile(ctx, next) {
        let result = FileTreeOpt.createFile(ctx.request.body);
        ctx.response.body = result;
    }
    async renameFile(ctx, next) {
        let oldPath = ctx.request.body.path + ctx.request.body.name;
        let newPath = ctx.request.body.path + ctx.request.body.newName;
        let result = FileTreeOpt.renameFile(oldPath, newPath);
        ctx.response.body = result;
    }
    async deleteFile(ctx, next) {
        let result = FileTreeOpt.deleteFile(ctx.request.body);
        ctx.response.body = result;
    }

    //文件操作相关：vue文件读写
    async getFileData(ctx, next) {
        let path = ctx.params["1"];
        let result = FileTreeOpt.getFileData(path);
        ctx.response.body = result;
    }
    async saveFileData(ctx, next) {
        let path = ctx.params["1"];
        let result;
        await ctx.req.on("data", function(data) {
            FileTreeOpt.writeFileData(path, data.toString());
        })
        ctx.response.body = "save file success";
    }
}
export default new FileTreeManager();