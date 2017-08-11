const fs = require('fs');
const acorn = require('acorn');
const gencode = require('escodegen');
import Path from '../../config/root_path.json';
/**
 * 使用acorn库通过构建ast和反向生成代码来解析js代码，
 * 实现index.js路由文件的修改
 * 
 * @class VueRouterManager
 */
class VueRouterMana {
    addRouterItem(filePath, routerName) {
        let data = fs.readFileSync(filePath).toString();
        let ori_ast = acorn.parse(data, {
            sourceType: 'module'
        });
        let new_import_str = `import ` + routerName + ` from '@/activities/` + routerName + `.vue';\n`;
        let import_ast = acorn.parse(new_import_str, {
            sourceType: 'module'
        });
        let new_router_str =
            `export default{
            path:'/` + routerName + `',
            component: ` + routerName + `
        }`;
        let router_ast = acorn.parse(new_router_str, {
            sourceType: 'module'
        });
        ori_ast.body.unshift(import_ast.body[0]); //添加import语句的ast到原始的ast中
        //添加router语句的ast到原始的ast中
        ori_ast.body[ori_ast.body.length - 1].declaration.arguments[0].properties[0].value.elements.push(router_ast.body[0].declaration);
        let _result = gencode.generate(ori_ast);
        fs.writeFile(filePath, _result, function(err) {
            if (err) {
                return err;
            } else {
                console.log("crete router&&create file sucecss")
                return '{"msg":"create file success！"}';
            }
        });
    }
    renameRouterItem(filePath, oldName, newName) {
        let data = fs.readFileSync(filePath).toString();
        let ori_ast = acorn.parse(data, {
            sourceType: 'module'
        });
        for (let i = 0; i < ori_ast.body.length; i++) {
            if (ori_ast.body[i].type === "ImportDeclaration") {
                //处理import语句
                if (ori_ast.body[i].source.value.indexOf(oldName) > 0) {
                    //当前语句是要重命名的语句
                    let path = `@/activities/` + newName + `.vue`;
                    ori_ast.body[i].source.value = path;
                    ori_ast.body[i].source.raw = path;
                    ori_ast.body[i].specifiers[0].local.name = newName;
                }
            } else if (ori_ast.body[i].type === "ExportDefaultDeclaration") {
                //处理router语句
                let arr = ori_ast.body[i].declaration.arguments[0].properties[0].value.elements;
                for (let j = 0; j < arr.length; j++) {
                    if (arr[j].properties[1].value.name === oldName) {
                        //找到了需要重命名的router语句
                        ori_ast.body[i].declaration.arguments[0].properties[0].value.elements[j].properties[0].value.raw = `/` + newName;
                        ori_ast.body[i].declaration.arguments[0].properties[0].value.elements[j].properties[0].value.value = `/` + newName;
                        ori_ast.body[i].declaration.arguments[0].properties[0].value.elements[j].properties[1].value.name = newName;
                    }
                }
            }
        }
        let _result = gencode.generate(ori_ast);
        fs.writeFile(filePath, _result, function(err) {
            if (err) {
                return err;
            } else {
                console.log("rename router&&rename file sucecss")
                return '{"msg":"rename file success！"}';
            }
        });
    }
    deleteRouterItem(filePath, routerName) {
        let data = fs.readFileSync(filePath).toString();
        let ori_ast = acorn.parse(data, {
            sourceType: 'module'
        });
        for (let i = 0; i < ori_ast.body.length; i++) {
            if (ori_ast.body[i].type === "ImportDeclaration") {
                //处理import语句
                if (ori_ast.body[i].source.value.indexOf(routerName) > 0) {
                    //当前语句是要删除的语句,删除他
                    ori_ast.body.splice(i, 1);
                }
            } else if (ori_ast.body[i].type === "ExportDefaultDeclaration") {
                //处理router语句
                let arr = ori_ast.body[i].declaration.arguments[0].properties[0].value.elements;
                for (let j = 0; j < arr.length; j++) {
                    if (arr[j].properties[1].value.name === routerName) {
                        ori_ast.body[i].declaration.arguments[0].properties[0].value.elements.splice(j, 1);
                    }
                }
            }
        }
        let _result = gencode.generate(ori_ast);
        fs.writeFile(filePath, _result, function(err) {
            if (err) {
                return err;
            } else {
                console.log("delete router&&delete file sucecss")
                return '{"msg":"delete file success！"}';
            }
        });
    }
}

/**
 * 
 * 具体文件操作类
 * @class FileTreeOpt
 */
var VueRouterManager = new VueRouterMana();
class FileTreeOpt {
    initFileTree(path) {
        var getChildrenData = function(path) {
            let outputJson = [];
            let files = fs.readdirSync(Path.path + path);
            files.forEach((file) => {
                let dir = {};
                dir["name"] = file;
                dir["path"] = path + "\/" + file;
                //获取文件实例
                let stat = fs.statSync(Path.path + path + '/' + file);
                if (stat.isDirectory()) {
                    dir["type"] = "folder";
                    if (file != "node_modules") {
                        let children = new Array();
                        dir["children"] = children;
                        // 如果是文件夹则递归
                        dir.children = getChildrenData(path + '/' + file);
                    }
                } else if (stat.isFile()) {
                    dir["type"] = "file";
                }
                outputJson.push(dir);
            })
            return outputJson;
        }
        let children = getChildrenData(path);
        let obj = {};
        let index = path.lastIndexOf('\/');
        let name = path.slice(index + 1, path.length);
        obj["name"] = name;
        obj["path"] = path;
        obj["type"] = "folder";
        obj["children"] = children;
        return obj;

    };
    //创建文件或者文件夹
    createFile(node) {
        let path = node.path + node.name;
        if (node.type == "file") {
            // 创建vue文件时候读取模板内容写入新建的文件
            // 注意此处使用./其实是根目录
            let tempData = fs.readFileSync('./app/public/template.vue');
            fs.writeFile(Path.path + path, tempData, function(err) {
                if (err) {
                    return err;
                } else {
                    // 文件写成功后对相应的vue文件创建相关路由信息
                    let routerFilePath = Path.path + path.split('/')[0] + '/src/router/index.js';
                    VueRouterManager.addRouterItem(routerFilePath, node.name.split('.')[0]);
                }
            })
        } else if (node.type == "folder") {
            //创建文件夹
            fs.mkdir(Path.path + path, function(err) {
                if (err) {
                    return err;
                } else {
                    console.log("create folder:" + path + " success")
                    return '{"msg":"create folder success！"}';
                }
            })
        }
    };
    // 重命名文件或者文件夹
    renameFile(oldPath, newPath) {
        let arr_old = oldPath.split(".")[0].split("/");
        let oldName = arr_old[arr_old.length - 1];
        let arr_new = newPath.split(".")[0].split("/");
        let newName = arr_new[arr_new.length - 1];
        fs.rename(Path.path + oldPath, Path.path + newPath, function() {
            console.log("rename " + oldPath + "<==>" + newPath + " success!");
            let routerFilePath = Path.path + newPath.split('/')[0] + '/src/router/index.js';
            return VueRouterManager.renameRouterItem(routerFilePath, oldName, newName);
        });
    };
    // 删除文件或文件夹
    deleteFile(node) {
        var _type = node.type;
        var _path = Path.path + node.path;
        //删除所有的文件(将所有文件夹置空)
        var emptyDir = function(fileUrl) {
                var files = fs.readdirSync(fileUrl); //读取该文件夹
                files.forEach(function(file) {
                    var stats = fs.statSync(fileUrl + '/' + file);
                    if (stats.isDirectory()) {
                        emptyDir(fileUrl + '/' + file);
                    } else {
                        fs.unlinkSync(fileUrl + '/' + file);
                    }
                });
            }
            //删除所有的空文件夹
        var rmEmptyDir = function(fileUrl) {
            var files = fs.readdirSync(fileUrl);
            if (files.length > 0) {
                let tempFile = 0;
                files.forEach(function(fileName) {
                    tempFile++;
                    rmEmptyDir(fileUrl + '/' + fileName);
                });
                if (tempFile == files.length) { //删除母文件夹下的所有字空文件夹后，将母文件夹也删除
                    fs.rmdirSync(fileUrl);
                }
            } else {
                fs.rmdirSync(fileUrl);
            }
        }
        if (_type == "folder") {
            emptyDir(_path);
            rmEmptyDir(_path);
            console.log("delete fodler:" + _path + " success!")
            return '{"msg":"delete fodler success！"}';
        } else if (_type == "file") {
            fs.unlinkSync(_path);
            // 删除相应的路由文件信息
            let routerFilePath = Path.path + node.path.split('/')[0] + '/src/router/index.js';
            let splitArr = node.path.split('/');
            let routerName = splitArr[splitArr.length - 1].split('.')[0];
            if (splitArr[splitArr.length - 1].split('.')[1] == 'vue') {
                // 如果操作的是vue文件，则删除路由信息
                console.log("delete file:" + _path + " success!")
                return VueRouterManager.deleteRouterItem(routerFilePath, routerName);
            }
        }
    };
    getFileData(path) {
        return fs.readFileSync(Path.path + path, 'utf-8');
    }
    writeFileData(path, data) {
        let result;
        fs.writeFile(Path.path + path, data, 'utf-8', function(err) {
            if (err) {
                console.error(err);
            } else {
                console.log('write success');
            }
        });
    }
}
export default new FileTreeOpt();