import React, { Component } from "react";
import {
  NavBar,
  WingBlank,
  List,
  InputItem,
  WhiteSpace,
  Radio,
  Button,
} from "antd-mobile";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { register } from "../../redux/actions";
import Logo from "../../components/logo/logo";

/*用户注册的路由组件 */
class Register extends Component {
  state = { username: "", password: "", password2: "", type: "dashen" };

  // 处理输入框/单选框变化, 收集数据到 state
  handleChange = (name, value) => {
    this.setState({ [name]: value });
  };
  // 跳转到 login 路由
  toLogin = () => {
    this.props.history.replace("/login");
  };

  // 注册
  register = () => {
    console.log(JSON.stringify(this.state));
    this.props.register(this.state);
  };

  render() {
    // const { type } = this.state;
    const { redirectTo, msg } = this.props;
    if (redirectTo) {
      return <Redirect to={redirectTo} />;
    }

    return (
      <div>
        <NavBar>硅谷直聘</NavBar>
        <Logo />
        <WingBlank>
          {!!msg && <p>{msg}</p>}
          <List>
            <InputItem
              placeholder="输入用户名"
              onChange={(val) => this.handleChange("username", val)}
            >
              用户名:
            </InputItem>
            <WhiteSpace />
            <InputItem
              type="password"
              placeholder="输入密码"
              onChange={(val) => this.handleChange("password", val)}
            >
              密&nbsp;&nbsp;&nbsp;码:
            </InputItem>
            <WhiteSpace />
            <InputItem
              type="password"
              placeholder="输入确认密码"
              onChange={(val) => this.handleChange("password2", val)}
            >
              确认密码:
            </InputItem>
            <WhiteSpace />
            <List.Item>
              <span style={{ marginRight: 30 }}>用户类型:</span>
              <Radio
                checked={this.state.type === "dashen"}
                onClick={() => {
                  this.handleChange("type", "dashen");
                }}
              >
                大神
              </Radio>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Radio
                checked={this.state.type === "laoban"}
                onClick={() => {
                  this.handleChange("type", "laoban");
                }}
              >
                老板
              </Radio>
            </List.Item>
            <WhiteSpace />
            <Button type="primary" onClick={this.register}>
              注&nbsp;&nbsp;&nbsp;册
            </Button>
            <WhiteSpace /> <Button onClick={this.toLogin}>已经有账号</Button>
          </List>
        </WingBlank>
      </div>
    );
  }
}
export default connect((state) => state.user, { register })(Register);
