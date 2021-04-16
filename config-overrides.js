const { fixBabelImports, override, addLessLoader } = require("customize-cra");

module.exports = override(
  fixBabelImports("antd-mobile", { libraryDirectory: "es", style: true }),

  addLessLoader({
    modifyVars: {
      "@brand-primary": "#1089",
    },
    javascriptEnabled: true,
  })
);
