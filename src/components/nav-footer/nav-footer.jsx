import React from "react";
import PropTypes from "prop-types";
import { TabBar } from "antd-mobile";
import { withRouter } from "react-router-dom";

const Item = TabBar.Item;
class NavFooter extends React.Component {
  static propTypes = { navList: PropTypes.array.isRequired };
  render() {
    // nav.hide = true/false hide 代表当前项应该被隐藏
    const navList = this.props.navList.filter((nav) => !nav.hide);
    // 回调函数返回值为 true, 当前元素就会留下, 否则不留
    // 当前请求的路径
    const { pathname } = this.props.location;
    return (
      <TabBar>
        {navList.map((nav, index) => (
          <Item
            key={nav.path}
            title={nav.text}
            icon={{ uri: require(`./imgs/${nav.icon}.png`).default }}
            selectedIcon={{
              uri: require(`./imgs/${nav.icon}-selected.png`).default,
            }}
            selected={pathname === nav.path}
            onPress={() => {
              this.props.history.replace(nav.path);
            }}
          />
        ))}
      </TabBar>
    );
  }
}
export default withRouter(NavFooter);
