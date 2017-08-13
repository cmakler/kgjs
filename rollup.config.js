import node from "rollup-plugin-node-resolve";

export default {
  entry: "d3-custom.js",
  format: "umd",
  moduleName: "d3",
  plugins: [node()],
  dest: "build/d3-kg.js"
};