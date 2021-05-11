/*包含 n 个接口请求函数的模块 每个函数返回的都是 promise 对象 */
import ajax from "./ajax";
// 请求注册
export const reqRegister = (user) => ajax("/register", user, "POST");
// 请求登陆
export const reqLogin = (user) => ajax("/login", user, "POST");
// 更新用户信息
export const reqUpdateUser = (user) => ajax("/update", user, "POST");
// 查看用户信息(根据 cookie)
export const reqUser = () => ajax("/user");

// 请求获取用户列表
export const reqUserList = (type) => ajax("/list", { type });
