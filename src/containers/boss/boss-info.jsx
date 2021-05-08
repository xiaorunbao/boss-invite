/*boss 信息完善路由组件 */
import React, { Component } from "react";
import { NavBar, InputItem, TextareaItem, Button } from "antd-mobile";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import HeaderSelector from "../../components/header-selector/header-selector";
import { updateUser } from "../../redux/actions";
class BossInfo extends Component {
  state = {
    header: "", // 头像名称
    info: "", // 职位简介
    post: "", // 职位名称
    company: "", // 公司名称
    salary: "", // 工资
  };

  handleChange = (name, val) => {
    this.setState({ [name]: val });
  };
  // 设置更新 header
  setHeader = (header) => {
    this.setState({ header });
  };

  render() {
    const { user } = this.props;
    // 如果用户信息已完善, 自动跳转到 laoban 主界面
    if (user.header) {
      return <Redirect to="/laoban" />;
    }
    return (
      <div>
        <NavBar>老板信息完善</NavBar>
        <HeaderSelector setHeader={this.setHeader} />
        <InputItem onChange={(val) => this.handleChange("post", val)}>
          招聘职 位:
        </InputItem>
        <InputItem onChange={(val) => this.handleChange("company", val)}>
          公司名 称:
        </InputItem>
        <InputItem onChange={(val) => this.handleChange("salary", val)}>
          职位薪 资:
        </InputItem>
        <TextareaItem
          title="职位要求:"
          rows={3}
          onChange={(val) => this.handleChange("info", val)}
        />
        <Button
          type="primary"
          onClick={() => this.props.updateUser(this.state)}
        >
          保存
        </Button>
      </div>
    );
  }
}

export default connect((state) => ({ user: state.user }), { updateUser })(
  BossInfo
);
