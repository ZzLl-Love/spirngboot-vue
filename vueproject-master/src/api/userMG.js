import axios from 'axios';
import {loginreq, req, reqExcel} from './axiosFun';
import {id} from "html-webpack-plugin/lib/chunksorter";
import {copyLayoutParams} from "echarts/lib/util/layout";

const localAddress = "localhost:8080"
const productAddress ="www.zzlovell.top:8083"

let dz=""+dz+"";
if (process.env.NODE_ENV === 'production') {
  dz = productAddress;
}else{
  dz = localAddress
}


// 登录接口
export const login = (params) => { return loginreq("post", "http://"+dz+"/user/login", params) };
// 获取用户菜单
export const menu = (params) => { return axios.get("http://"+dz+"/menu/get" ).then(res => res.data) };
// 退出接口
export const loginout = () => { return axios.delete("/api/login?&token=").then(res => res.data) };

/**
 * 用户管理 user
 **/
// 用户管理-获取用户列表
export const userList = (params) => { return req("post", "http://"+dz+"/user/getAll", params) };
// 用户管理-修改 （添加编辑）
export const updateUser = (params) => {return req("put", "http://"+dz+"/user/update", params)};

///用户管理 --添加
export const addUser = (params) => {return req("post", "http://"+dz+"/user/add", params)};
// 用户管理-删除用户
// export const userDelete = (params) => { return axios.delete("/api/User/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
 export const userDelete = (params) => {

   // 创建一个 Axios 实例
   const instance = axios.create({
     baseURL: 'http://"+dz+"', // 设置基础 URL
     timeout: 5000 // 设置超时时间
   });

   // 设置请求拦截器，在发送请求之前设置 token 到请求头中
   instance.interceptors.request.use(
     config => {
       // 获取 token
       const token = localStorage.getItem('logintoken');
       // 如果 token 存在，则设置到请求头中
       if (token) {
         config.headers['Authorization'] = token;
       }
       return config;
     },
     error => {
       // 如果请求错误，打印错误信息
       console.error('请求发生错误:', error);
       return Promise.reject(error);
     }
   );

   return instance.delete(`http://"+dz+"/user/delete/${params}`).then(res => res.data)
 };
// 用户管理-重置密码
export const userPwd = (params) => { return req("post", "/api/User/pwd", params) };
// 用户管理-修改状态
export const userLock = (params) => { return axios.get("/api/User/lock?userId=" + params.userId + "&lock=" + params.lock + "&token=" + localStorage.getItem('logintoken')) };
// 用户管理-数据权限
export const UserDeptTree = (params) => { return axios.get("/api/UserDept/tree/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 用户管理-数据权限保存
export const UserDeptSave = (params) => { return req("post", "/api/UserDept/save", params) };
// 用户管理-获取部门设置
export const UserDeptdeptTree = (params) => { return axios.get("/api/UserDept/deptTree/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 用户管理-保存部门设置
export const UserChangeDept = (params) => { return req("post", "/api/User/change/dept", params) };
// 用户管理-用户下线
export const userExpireToken = (params) => { return req("get", "/api/User/expireToken/" + params, {}) };
// 用户管理-刷新缓存
export const userFlashCache = (params) => { return req("get", "/api/User/flashCache/" + params, {}) };

/**
 * 菜单管理 menu
 **/
// 菜单管理-获取菜单Module/list
export const ModuleList = () => { return req("get", "http://"+dz+"/menu/get") };
// 菜单管理-根据菜单获取数据
export const ModuleGet = (params) => { return axios.get("/api/Module/get/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 菜单管理-获取父级菜单Module/nodes
export const ModuleNodes = (params) => { return req("post", "http://"+dz+"/menu/getRootMenu", params) };
// 菜单管理-修改菜单
export const ModuleSave = (params) => { return req("post", "http://"+dz+"/menu/save", params) };
// 菜单管理-删除菜单
// export const ModuleDelete = (params) => { return axios.delete("/api/Module/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
export const ModuleDelete = (params) => { return axios.delete("http://"+dz+"/menu/delete"  +"?ids="+params ).then(res => res.data) };


/**
 * 库存管理
 */

//查询库存
export  const stockList = (params) =>{ return req("post", "http://"+dz+"/product/getAllProduct", params)}
//添加库存 / 修改库存
export const stockSave = (params) => { return req("post", "http://"+dz+"/product/changeProduct", params) };

//删除库存
export const stockDel = (params) => { return axios.delete("http://"+dz+"/product/delProduct"  +"?id="+params ).then(res => res.data) };

//设置库存的警告值
export const warnValueUpdate = (params) =>{ return req("put", "http://"+dz+"/product/updateAlarmValue", params)}

//上传库存excel 文件
export const   excelUpload = (params) => { return req("post", "http://"+dz+"/product/upload", params) };

//下载excel 文件

export const downExcel = (params) => {return reqExcel("get", "http://"+dz+"/product/down", params,)}

//入库信息操作
export const qeuryStockInfo = (params) => {return req("get", "http://"+dz+"/product/inStock" + "?id="+ params)}

//入库实际操作
export const inStock = (params) => { return req("post", "http://"+dz+"/product/in", params) };

export const outStock = (params) => { return req("post", "http://"+dz+"/product/out", params) };




/**
 * 角色管理
 **/
// 角色管理-获取角色列表
export const roleList = (params) => { return req("post", "http://"+dz+"/role/getAllInfo", params) };
// 角色管理-保存（添加/编辑）
export const roleSave = (params) => { return req("post", "http://"+dz+"/role/add_update", params) };
// 角色管理-删除角色
  //axios请求之前设置默认的请求头
axios.defaults.headers.common['Authorization'] =  localStorage.getItem('logintoken');

export const roleDelete = (params) => {
  return axios.delete("http://"+dz+"/role/delete/" + params).then(res => res.data);
};

// export const roleDelete = (params) => { return axios.delete("/api/Role/delete?roleId=" + params ).then(res => res.data) };
// 角色管理-菜单权限（获取）
// export const RoleRightTree = (params) => { return axios.get("/api/RoleRight/tree/" + params + "?token=" + localStorage.getItem('logintoken')) };
export const RoleRightTree = (params) => { return axios.get("http://"+dz+"/api/RoleRight/tree/" + params +"?token=" + localStorage.getItem('logintoken'))};
// 设置请求拦截器，在发送请求之前设置 token 到请求头中


// 角色管理-菜单权限（保存）
export const RoleRightSave = (params) => { return req("post", "http://"+dz+"/api/RoleRight/save", params) };

/**
 * 公司管理
 **/
// 公司管理-获取公司列表
export const deptList = (params) => { return req("post", "http://"+dz+"/dept/query", params) };
// 公司管理-保存（添加编辑）
export const deptSave = (params) => { return req("post", "http://"+dz+"/dept/update", params) };
// 公司管理-删除公司
export const deptDelete = (params) => { return axios.delete("http://"+dz+"/dept/delete?deptId=" + params).then(res => res.data) };

/**
 * 系统环境变量
 **/
// 系统环境变量-获取系统环境变量列表
export const variableList = (params) => { return req("post", "/api/Variable/list", params) };
// 系统环境变量-保存（添加编辑）
export const variableSave = (params) => { return req("post", "/api/Variable/save", params) };
// 系统环境变量-删除系统环境变量
export const variableDelete = (params) => { return axios.delete("/api/Variable/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 权限管理
 **/
// 权限管理-获取权限列表
export const permissionList = (params) => { return req("post", "/api/Permission/list", params) };
// 权限管理-保存权限
export const ermissionSave = (params) => { return req("post", "/api/Permission/save", params) };
// 权限管理-删除权限
export const ermissionDelete = (params) => { return axios.delete("/api/Permission/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 权限管理-获取权限
export const roleDropDown = () => { return axios.get("/api/Role/dropDown/all?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 权限管理-配置权限
export const RolePermission = (params) => { return req("post", "/api/RolePermission/save", params) };


/**
 * 图表管理
 */

//查询出库信息前五名的数据
export const getTop5 = (params) => {return req("get", "http://"+dz+"/product/getTop", params,)};
export const getLoginUserTop5 = (params) => {return req("get", "http://"+dz+"/user/getLoginNum", params,)};

