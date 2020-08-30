const loaderUtils = require('loader-utils');
module.exports = function (source) {
  console.log('Loader a is excuted!');

  const url = loaderUtils.interpolateName(this, 'interpolateName.[name].[ext]', source);
  console.log(url);
  this.emitFile(url, source);
  return source;
};
