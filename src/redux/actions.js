import io from "socket.io-client";
import {
  reqChatMsgList,
  reqLogin,
  reqReadChatMsg,
  reqRegister,
  reqUpdateUser,
  reqUser,
  reqUserList,
} from "../api";
import {
  AUTH_SUCCESS,
  ERROR_MSG,
  MSG_READ,
  RECEIVE_MSG,
  RECEIVE_MSG_LIST,
  RECEIVE_USER,
  RECEIVE_USER_LIST,
  RESET_USER,
} from "./action-types";

// 同步错误消息
const errorMsg = (msg) => ({ type: ERROR_MSG, data: msg });
// 同步成功响应
const authSuccess = (user) => ({ type: AUTH_SUCCESS, data: user });

/*异步注册 */
export function register({ username, password, password2, type }) {
  // 进行前台表单验证, 如果不合法返回一个同步 action 对象, 显示提示信息
  if (!username || !password || !type) {
    return errorMsg("用户名密码必须输入");
  }
  if (password !== password2) {
    return errorMsg("密码和确认密码不同");
  }
  return async (dispatch) => {
    // 异步 ajax 请求, 得到响应
    const response = await reqRegister({ username, password, type });
    // 得到响应体数据
    const result = response.data;
    // 如果是正确的
    if (result.code === 0) {
      // 分发成功的 action
      dispatch(authSuccess(result.data));
    } else {
      // 分发提示错误的 action
      dispatch(errorMsg(result.msg));
    }
  };
}

/** 登录 */
export const login = ({ username, password }) => {
  if (!username || !password) {
    return errorMsg("用户密码必须输入");
  }
  return async (dispatch) => {
    const response = await reqLogin({ username, password });
    const result = response.data;
    if (result.code === 0) {
      dispatch(authSuccess(result.data));
    } else {
      dispatch(errorMsg(result.msg));
    }
  };
};
// 同步接收用户
const receiveUser = (user) => ({ type: RECEIVE_USER, data: user });
// 同步重置用户
export const resetUser = (msg) => ({ type: RESET_USER, data: msg });
/*异步更新用户 */
export const updateUser = (user) => {
  return async (dispatch) => {
    // 发送异步 ajax 请求
    const response = await reqUpdateUser(user);
    const result = response.data;
    if (result.code === 0) {
      // 更新成功
      dispatch(receiveUser(result.data));
    } else {
      // 失败
      dispatch(resetUser(result.msg));
    }
  };
};

/*异步获取用户 */
export const getUser = () => {
  return async (dispatch) => {
    const response = await reqUser();
    const result = response.data;
    if (result.code === 0) {
      dispatch(receiveUser(result.data));
    } else {
      dispatch(resetUser(result.msg));
    }
  };
};

// 用户列表
const receiveUserList = (users) => ({ type: RECEIVE_USER_LIST, data: users });
// 异步获取用户列表
export const getUserList = (type) => {
  return async (dispatch) => {
    const response = await reqUserList(type);
    const result = response.data;
    if (result.code === 0) {
      dispatch(receiveUserList(result.data));
    }
  };
};

// 接收消息列表的同步 action
const receiveMsgList = ({ users, chatMsgs, userid }) => ({
  type: RECEIVE_MSG_LIST,
  data: { users, chatMsgs, userid },
});
// 接收消息的同步 action
const receiveMsg = (chatMsg, isToMe) => ({
  type: RECEIVE_MSG,
  data: { chatMsg, isToMe },
});
// 读取了消息的同步 action
const msgRead = ({ from, to, count }) => ({
  type: MSG_READ,
  data: { from, to, count },
});

/*初始化客户端 socketio 1. 连接服务器 2. 绑定用于接收服务器返回 chatMsg 的监听 */
function initIO(dispatch, userid) {
  if (!io.socket) {
    io.socket = io("ws://localhost:4000");
    io.socket.on("receiveMsg", (chatMsg) => {
      if (chatMsg.from === userid || chatMsg.to === userid) {
        dispatch(receiveMsg(chatMsg, chatMsg.to === userid));
      }
    });
  }
}

/*获取当前用户相关的所有聊天消息列表 (在注册/登陆/获取用户信息成功后调用) */
async function getMsgList(dispatch, userid) {
  initIO(dispatch, userid);
  const response = await reqChatMsgList();
  const result = response.data;
  if (result.code === 0) {
    const { chatMsgs, users } = result.data;
    dispatch(receiveMsgList({ chatMsgs, users, userid }));
  }
}

/* 发送消息的异步 action */
export const sendMsg = ({ from, to, content }) => {
  return async (dispatch) => {
    io.socket.emit("sendMsg", { from, to, content });
  };
};

/*更新读取消息的异步 action */
export const readMsg = (userid) => {
  return async (dispatch, getState) => {
    const response = await reqReadChatMsg(userid);
    const result = response.data;
    if (result.code === 0) {
      const count = result.data;
      const from = userid;
      const to = getState().user._id;
      dispatch(msgRead({ from, to, count }));
    }
  };
};
