import axios from 'axios';
import { loginreq, req } from './axiosFun';
import {id} from "html-webpack-plugin/lib/chunksorter";

// 登录接口
export const login = (params) => { return loginreq("post", "http://localhost:8080/user/login", params) };
// 获取用户菜单
export const menu = (params) => { return axios.get("/api/menu?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
// 退出接口
export const loginout = () => { return axios.delete("/api/login?&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 用户管理
 **/
// 用户管理-获取用户列表
export const userList = (params) => { return req("post", "http://localhost:8080/user/getAll", params) };
// 用户管理-修改 （添加编辑）
export const updateUser = (params) => {return req("put", "http://localhost:8080/user/update", params)};

///用户管理 --添加
export const addUser = (params) => {return req("post", "http://localhost:8080/user/add", params)};
// 用户管理-删除用户
// export const userDelete = (params) => { return axios.delete("/api/User/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };
 export const userDelete = (params) => {

   // 创建一个 Axios 实例
   const instance = axios.create({
     baseURL: 'http://localhost:8080', // 设置基础 URL
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

   return instance.delete(`http://localhost:8080/user/delete/${params}`).then(res => res.data)
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
 * 菜单管理
 **/
// 菜单管理-获取菜单Module/list
export const ModuleList = () => { return req("post", "/api/Module/list") };
// 菜单管理-根据菜单获取数据
export const ModuleGet = (params) => { return axios.get("/api/Module/get/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 菜单管理-获取父级菜单Module/nodes
export const ModuleNodes = (params) => { return req("post", "/api/Module/nodes", params) };
// 菜单管理-修改菜单
export const ModuleSave = (params) => { return req("post", "/api/Module/save", params) };
// 菜单管理-删除菜单
export const ModuleDelete = (params) => { return axios.delete("/api/Module/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

/**
 * 角色管理
 **/
// 角色管理-获取角色列表
export const roleList = (params) => { return req("post", "http://localhost:8080/role/getAllInfo", params) };
// 角色管理-保存（添加/编辑）
export const roleSave = (params) => { return req("post", "http://localhost:8080/role/add_update", params) };
// 角色管理-删除角色
  //axios请求之前设置默认的请求头
axios.defaults.headers.common['Authorization'] =  localStorage.getItem('logintoken');

export const roleDelete = (params) => {
  return axios.delete("http://localhost:8080/role/delete?roleId=" + params).then(res => res.data);
};

// export const roleDelete = (params) => { return axios.delete("/api/Role/delete?roleId=" + params ).then(res => res.data) };
// 角色管理-菜单权限（获取）
export const RoleRightTree = (params) => { return axios.get("/api/RoleRight/tree/" + params + "?token=" + localStorage.getItem('logintoken')) };
// 角色管理-菜单权限（保存）
export const RoleRightSave = (params) => { return req("post", "/api/RoleRight/save", params) };

/**
 * 公司管理
 **/
// 公司管理-获取公司列表
export const deptList = (params) => { return req("post", "/api/Dept/list", params) };
// 公司管理-保存（添加编辑）
export const deptSave = (params) => { return req("post", "/api/Dept/save", params) };
// 公司管理-删除公司
export const deptDelete = (params) => { return axios.get("/api/Dept/delete?ids=" + params + "&token=" + localStorage.getItem('logintoken')).then(res => res.data) };

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
