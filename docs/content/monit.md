# 前端监控

[前端监控和前端埋点方案设计](https://juejin.im/post/5b62d68df265da0f9d1a1cd6)

## 数据监控

数据监控，顾名思义就是监听用户的行为。常见的数据监控包括：

- PV/UV:PV(page view)，即页面浏览量或点击量。UV:指访问某个站点或点击某条新闻的不同 IP 地址的人数
- 用户在每一个页面的停留时间
- 用户通过什么入口来访问该网页
- 用户在相应的页面中触发的行为

统计这些数据是有意义的，比如我们知道了用户来源的渠道，可以促进产品的推广，知道用户在每一个页面停留的时间，可以针对停留较长的页面，增加广告推送等等。

## 性能监控

性能监控指的是监听前端的性能，主要包括监听网页或者说产品在用户端的体验。常见的性能监控数据包括：

- 不同用户，不同机型和不同系统下的首屏加载时间
- 白屏时间
- http 等请求的响应时间
- 静态资源整体下载时间
- 页面渲染时间
- 页面交互动画完成时间

这些性能监控的结果，可以展示前端性能的好坏，根据性能监测的结果可以进一步的去优化前端性能，比如兼容低版本浏览器的动画效果，加快首屏加载等等。

## 前端异常监控

[前端异常监控、上报及 js 压缩代码定位](https://juejin.im/post/5b55c3495188251acb0cf907)

## 异常处理几种方式

- try-catch

  > 处理异常的能力有限，只能捕获捉到**运行时**的**非异步错误**，对于**语法错误**和**异步错误**就显得无能为力，捕捉不到

  ```js
    // 语法错误
    try{
      var error = 'error'； // 全角分号
    }catch(err) {
      console.log('我感知不到错误');
      console.log(e);
    }

    // 异步错误
    try {
      setTimeout(() => {
        error        // 异步错误
      })
    } catch(e) {
      console.log('我感知不到错误');
      console.log(e);
    }
  ```

- window.onerror

  > 无论是异步还是非异步错误，onerror 都能捕获到运行时错误。

  > 对于语法错误还是无能为力

  > **window.onerror 函数只有在返回 true 的时候，异常才不会向上抛出，否则即使是知道异常的发生控制台还是会显示**

  > **onerror 是无法捕获到网络异常的错误**
  > 由于网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行，但是这种方式虽然可以捕捉到网络请求的异常，但是无法判断 HTTP 的状态是 404 还是其他比如 500 等等，所以还需要配合服务端日志才进行排查分析才可以。

  ```js
  /**
   * @param {String}  msg    错误信息
   * @param {String}  url    出错文件
   * @param {Number}  row    行号
   * @param {Number}  col    列号
   * @param {Object}  error  错误详细信息
   */
  window.onerror = function(msg, url, row, col, error) {
    console.log('我知道错误了');
    console.log({ msg, url, row, col, error });
    return true;
  };

  // 异步错误
  window.onerror = function(msg, url, row, col, error) {
    console.log('我知道异步错误了');
    console.log({
      msg,
      url,
      row,
      col,
      error
    });
    return true;
  };
  setTimeout(() => {
    error;
  });

  // 网络异常捕获
  window.addEventListener(
    'error',
    (...msg) => {
      console.log('我知道 404 错误了');
      console.log(msg, url, row, col, error);
      return true;
    },
    true
  ); // 捕获阶段
  ```

* Promise 错误
  > 添加一个 Promise 全局异常捕获事件 unhandledrejection。
  ```js
  window.addEventListener('unhandledrejection', function(e) {
    e.preventDefault();
    console.log(e.reason);
  });
  ```

## 异常上报方式

1. 通过 Ajax 发送数据
2. 动态创建 img 标签的形式
   ```js
   function report(error) {
     let reportUrl = 'http://xxx.com/report';
     new Image().src = reportUrl + '?error=' + error;
   }
   ```
3. JSONP

## 异常上报问题

1. 跨域无法获取到 script 错误信息，添加 crossOrigin

   ```js
   const script = document.createElement('script');
   script.crossOrigin = 'anonymous';
   script.src = url;
   document.body.appendChild(script);
   ```

   ```html
   <script src="xxx/com/xxx" crossorigin></script>
   ```

   > 增加 crossorigin 属性后，浏览器将自动在请求头中添加一个 Origin 字段，发起一个 跨域资源共享 请求。Origin 向服务端表明了请求来源，服务端将根据来源判断是否正常响应。

   > **指定域名的 Access-Control-Allow-Origin 的响应头中需带上 Vary:Origin**
   > Vary 字段的作用在于为缓存服务器提供缓存规则及缓存筛选的依据。当增加 Vary:Origin 响应头后，缓存服务器将会按照 Origin 字段的内容，缓存不同版本，在请求响应时根据请求头中的 Origin 决定是否能够使用缓存响应。

2. window.onerror 能否捕获 iframe 的错误

   1. 如果你的 iframe 页面和你的主站是同域名的话，直接给 iframe 添加 onerror 事件即可

   ```html
   <iframe src="./iframe.html" frameborder="0"></iframe>
   <script>
     window.frames[0].onerror = function(msg, url, row, col, error) {
       console.log('我知道 iframe 的错误了，也知道错误信息');
       console.log({
         msg,
         url,
         row,
         col,
         error
       });
       return true;
     };
   </script>
   ```

   2. 非同域，可以通过与 iframe 通信的方式将异常信息抛给主站接收

3. 压缩代码如何定位到脚本异常位置（sourceMap)

## 异常信息采集内容

1. 用户信息
2. 行为信息
3. 异常信息
4. 环境信息

## 开源方案 sentry
