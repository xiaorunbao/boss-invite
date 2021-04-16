/*包含多个用于生成新的 state 的 reducer 函数的模块 */
import { combineReducers } from "redux";
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  RECEIVE_USER,
  RESET_USER,
} from "./action-types";
import { getRedirectPath } from "../utils";

const initUser = {
  username: "", // 用户名
  type: "", // 类型
  msg: "", // 错误提示信息
  redirectTo: "", // 需要自动跳转的路由 path
};
function user(state = initUser, action) {
  switch (action.type) {
    case AUTH_SUCCESS:
      const redirectTo = getRedirectPath(action.data.type, action.data.header);
      return { ...action.data, redirectTo };
    case ERROR_MSG:
      return { ...state, ...action.data };
    case RECEIVE_USER:
      return { ...action.data };
    case RESET_USER:
      return { ...initUser, msg: action.data };

    default:
      return state;
  }
}

// 返回合并后的 reducer 函数
export default combineReducers({ user });
