const loaderUtils = require('loader-utils');

module.exports = function (source) {
  const { name } = loaderUtils.getOptions(this);
  this.cacheable(false);
  console.log('loader options.name', name);
  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\\u2028') // es6 模板字符串问题
    .replace(/\u2029/g, '\\u2029');
  return `export default ${json}`;
};
