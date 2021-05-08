/*应用主界面路由组件 */
import React, { Component } from "react";
import { NavBar } from "antd-mobile";
import { Route, Switch, Redirect } from "react-router-dom";
import Cookies from "js-cookie";
import BossInfo from "../boss/boss-info";
import Boss from "../boss/boss";
import JobseekerInfo from "../jobseeker/jobseeker-info";
import Jobseeker from "../jobseeker/jobseeker";
import Message from "../message/message";
import Personal from "../personal/personal";
import NotFound from "../../components/not-found/not-found";
import NavFooter from "../../components/nav-footer/nav-footer";
import { getRedirectPath } from "../../utils";
import { connect } from "react-redux";
import { getUser } from "../../redux/actions";

class Main extends Component {
  // 给组件对象添加属性
  navList = [
    {
      path: "/laoban", // 路由路径
      component: Boss,
      title: "大神列表",
      icon: "dashen",
      text: "大神",
    },
    {
      path: "/dashen", // 路由路径
      component: Jobseeker,
      title: "老板列表",
      icon: "laoban",
      text: "老板",
    },
    {
      path: "/message", // 路由路径
      component: Message,
      title: "消息列表",
      icon: "message",
      text: "消息",
    },
    {
      path: "/personal", // 路由路径
      component: Personal,
      title: "用户中心",
      icon: "personal",
      text: "个人",
    },
  ];

  componentDidMount() {
    // cookie 中有 userid
    // redux 中的 user 是空对象
    const userid = Cookies.get("userid");
    const { user } = this.props;
    if (userid && !user._id) {
      // 获取 user 并保存到 redux 中
      this.props.getUser();
    }
  }

  render() {
    const pathname = this.props.location.pathname;

    const userId = Cookies.get("userid");
    if (!userId) {
      return <Redirect to="/login" />;
    }
    const { user } = this.props;
    if (!user._id) {
      return null;
    } else {
      if (pathname === "/") {
        const path = getRedirectPath(user.type, user.header);
        return <Redirect to={path} />;
      }
      if (user.type === "laoban") {
        this.navList[1].hide = true;
      } else {
        this.navList[0].hide = true;
      }
    }

    const currentNav = this.navList.find((nav) => nav.path === pathname);

    return (
      <div>
        {currentNav ? (
          <NavBar className="stick-top">{currentNav.title}</NavBar>
        ) : null}
        <Switch>
          <Route path="/laobaninfo" component={BossInfo}></Route>
          <Route path="/dasheninfo" component={JobseekerInfo}></Route>
          <Route path="/dashen" component={Jobseeker}></Route>
          <Route path="/laoban" component={Boss}></Route>
          <Route path="/message" component={Message}></Route>
          <Route path="/personal" component={Personal}></Route>
          <Route component={NotFound}></Route>
        </Switch>
        {currentNav ? (
          <NavFooter
            unReadCount={this.props.unReadCount}
            navList={this.navList}
          />
        ) : null}
      </div>
    );
  }
}
export default connect((state) => ({ user: state.user }), { getUser })(Main);
