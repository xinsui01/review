# 浏览器

## Cookie

- [SameSite cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#SameSite_cookies)
  - Strict: same origin
  - Lax: 在跨站点子请求中不携带 same-site cookies，例如加载图像或帧的调用。但是当用户从外部站点导航到 URL 时将发送 same-site cookies
  ```js
    Set-Cookie: key=value; SameSite=Strict
  ```
- Secure
- HttpOnly

## [chrome 显示 12px 以下字体的解决方法](https://blog.csdn.net/u012011360/article/details/41846905)

```html
<span style="display: 'block'; font-size='16px'; transform: scale(0.5);">8px 字体</span>
```

## 跨域

- [前端常见跨域解决方案（全）](https://segmentfault.com/a/1190000011145364)

  - JSONP(JSON with padding)
  - postMessage
  - cors
  - document.domain + iFrame
  - window.name + iFrame
  - location.hash + iFrame
  - 同域服务器转发请求

    <iframe src="https://segmentfault.com/a/1190000011145364" width="100%" frameborder="0" height="500px" ></iframe>

- [CORS](http://www.ruanyifeng.com/blog/2016/04/cors.html)

  ```js
    Access-Control-Allow-Origin: *                      // 对于不需要携带身份凭证的请求，服务器可以指定该字段的值为通配符，表示允许来自所有域的请求。
    Access-Control-Allow-Methods: GET, POST, PUT
    Access-Control-Allow-Headers: X-Custom-Header       // 允许客户端在请求中携带头部
    Access-Control-Allow-Credentials: true
    Access-Control-Max-Age: 1728000                     // 指定了preflight请求的结果能够被缓存多久
    /**
      * 在跨域访问时，XMLHttpRequest对象的getResponseHeader()方法只能拿到一些最基本的响应头，Cache-Control、Content-Language、Content-Type、Expires、Last-Modified、Pragma，如果要访问其他头，则需要服务器设置本响应头。
      */
    Access-Control-Expose-Headers: X-My-Custom-Header, X-Custom-Header
  ```

  - 跨域携带 cookie

    > 对于附带身份凭证的请求，服务器不得设置 Access-Control-Allow-Origin 的值为“\*”。

    ```js
      // 服务端
      Access-Control-Allow-Credentials: true

      // 客户端
      XMLHttpRequest.withCredentials = true
    ```

    [XMLHttpRequest.withCredentials](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/withCredentials)

    [Request.credentials](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)

## [跨页面通信的各种姿势](https://zhuanlan.zhihu.com/p/29368435)

- 获取句柄，postMessage

  ```js
  const childPage = window.open(strUrl, strWindowName, [strWindowFeatures]);

  childPage.onload = () => {
    childPage.postMessage(message, targetOrigin, [transfer]);
  };

  window.onmessage = e => {
    console.log(e.data);
    console.log(e.origin);
    console.log(e.source);
  };
  ```

- localStorage,设置共享区域的 storage，storage 会触发 storage 事件

  ```js
  localStorage.setItem('message', 'hello');

  window.onStorage = evt => {
    // evt.key evt.oldValue evt.newValue
  };
  ```

  - 触发写入操作的页面下的 **storage listener** 不会被触发
  - storage 事件只有在发生改变的时候才会触发，即重复设置相同值不会触发 listener
  - safari 隐身模式下无法设置 localStorage 值

- BroadcastChannel

  ```js
  // a.html
  const channel = new BroadcastChannel('tabs');
  channel.onmessage = evt => {
    // evt.data
  };

  // b.html
  const channel = new BroadcastChannel('tabs');
  channel.postMessage('hello');
  ```

- SharedWorker

- cookie

  一个古老的方案，有点`localStorage`的降级兼容版，我也是整理本文的时候才发现的，思路就是往`document.cookie`写入值，由于 cookie 的改变没有事件通知，所以只能采取轮询脏检查来实现业务逻辑。

- Server

## [深入浅出浏览器渲染原理](https://juejin.im/post/5c35cf62f265da615e05a67d)

- 以下操作会导致重排或重绘

  - 增、删、改 DOM 节点
  - 修改 CSS 样式，改变元素的大小、位置，或使用 `display:none;` 时会造成重排；修改颜色 `visibility: hidden` 会造成重绘
  - 修改网页的默认字体大小会造成重排
  - Resize 窗口或滚动时
  - 内容改变时（用户输入改变也会）
  - 计算 offsetWidth 和 offsetHeight

- 减少重排和重绘
  - 尽量避免 style 的使用，对于需要操作 DOM 元素节点，重新命名 className，更改 className 名称。
  - 如果增加元素或者 clone 元素，可以先把元素通过 documentFragment 放入内存中，等操作完毕后，再 appendChild 到 DOM 元素中
  - 不要经常获取同一个元素，可以第一次获取元素后，用变量保存下来，减少遍历时间
  - 尽量少使用 dispaly:none，可以使用 visibility:hidden 代替，dispaly:none 会造成重排，visibility:hidden 会造成重绘。
  - 不要使用 Table 布局，因为一个小小的操作，可能就会造成整个表格的重排或重绘
  - 使用 resize 事件时，做防抖和节流处理。
  - 对动画元素使用 absolute / fixed 属性。
  - 批量修改元素时，可以先让元素脱离文档流，等修改完毕后，再放入文档流。

## CSS 和 JS 解析、渲染

- [原来 CSS 与 JS 是这样阻塞 DOM 解析和渲染的](https://juejin.im/post/59c60691518825396f4f71a1)
- [css 加载会造成阻塞吗？](https://juejin.im/post/5b88ddca6fb9a019c7717096)
  - DOM 解析和 CSSOM 解析是两个并行的线程，CSS 的加载不会阻塞 DOM 的解析
  - CSS 加载会阻塞 DOM 树的渲染的
  - 由于 JS 会操作之前的 DOM 节点和 CSS 样式，因此，浏览器会维持 html 中 CSS 和 JS 的顺序。因此，CSS 会在后面的 JS 执行之前先加载执行完毕，所以 CSS 会阻塞后面 JS 的执行。
- [再谈 load 与 DOMContentLoaded](https://juejin.im/post/5b2a508ae51d4558de5bd5d1)

## Event loop

- [带你彻底弄懂 Event Loop](https://juejin.im/post/5b8f76675188255c7c653811)
- [浏览器事件循环机制（event loop）](https://juejin.im/post/5afbc62151882542af04112d)
- [JavaScript 运行机制详解：再谈 Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)

## IO 模式

- [Linux IO 模式及 select、poll、epoll 详解](https://segmentfault.com/a/1190000003063859?utm_source=Weibo&utm_medium=shareLink&utm_campaign=socialShare#articleHeader0)
- [大话 Select、Poll、Epoll](https://cloud.tencent.com/developer/article/1005481)

## V8 引擎中的垃圾回收机制

- [浅谈 V8 引擎中的垃圾回收机制](https://segmentfault.com/a/1190000000440270)

## 浏览器缓存

- [彻底搞懂浏览器缓存机制](https://juejin.im/post/5c4528a6f265da611a4822cc)
- [HTTP 缓存](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Caching_FAQ)
- [Cache-Control](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Cache-Control)
  - no-cache: 告诉浏览器、缓存服务器，不管本地副本是否过期，使用资源副本前，一定要到源服务器进行副本有效性校验。
  - must-revalidate：告诉浏览器、缓存服务器，本地副本过期前，可以使用本地副本；本地副本一旦过期，必须去源服务器进行有效性校验。

## [DNS 解析过程及 DNS 优化](https://blog.csdn.net/cat_foursi/article/details/71194397)

## 前端安全

- [前端安全知多少](https://juejin.im/entry/598d6eb46fb9a03c3a25d2c1)
- [如何防止 XSS 攻击？](https://tech.meituan.com/2018/09/27/fe-security.html)

  - xss

    > Cross-Site Scripting（跨站脚本攻击）简称 XSS，是一种代码注入攻击。攻击者通过在目标网站上注入恶意脚本，使之在用户的浏览器上运行。利用这些恶意脚本，攻击者可获取用户的敏感信息如 Cookie、SessionID 等，进而危害数据安全。

    > XSS 的本质是：恶意代码未经过滤，与网站正常的代码混在一起；浏览器无法分辨哪些脚本是可信的，导致恶意脚本被执行。

    为了和 CSS 区分，这里把攻击的第一个字母改成了 X，于是叫做 XSS。

    XSS 分类

    - 存储型 XSS：

      存储型 XSS 的攻击步骤：

      1. 攻击者将恶意代码提交到目标网站的数据库中。
      2. 用户打开目标网站时，网站服务端将恶意代码从数据库取出，拼接在 HTML 中返回给浏览器。
      3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
      4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

      这种攻击常见于带有用户保存数据的网站功能，如论坛发帖、商品评论、用户私信等。

    - 反射型 XSS:

      反射型 XSS 的攻击步骤：

      1. 攻击者构造出特殊的 URL，其中包含恶意代码。
      2. 用户打开带有恶意代码的 URL 时，网站服务端将恶意代码从 URL 中取出，拼接在 HTML 中返回给浏览器。
      3. 用户浏览器接收到响应后解析执行，混在其中的恶意代码也被执行。
      4. 恶意代码窃取用户数据并发送到攻击者的网站，或者冒充用户的行为，调用目标网站接口执行攻击者指定的操作。

      > 反射型 XSS 跟存储型 XSS 的区别是：存储型 XSS 的恶意代码存在数据库里，反射型 XSS 的恶意代码存在 URL 里。

      反射型 XSS 漏洞常见于通过 URL 传递参数的功能，如网站搜索、跳转等。

      由于需要用户主动打开恶意的 URL 才能生效，攻击者往往会结合多种手段诱导用户点击。

      POST 的内容也可以触发反射型 XSS，只不过其触发条件比较苛刻（需要构造表单提交页面，并引导用户点击），所以非常少见。

    - DOM 型 XSS:

      DOM 型 XSS 跟前两种 XSS 的区别：DOM 型 XSS 攻击中，取出和执行恶意代码由浏览器端完成，属于前端 JavaScript 自身的安全漏洞，而其他两种 XSS 都属于服务端的安全漏洞。

      ```html
      <script>
        eval(location.hash.substr(1));
        // 而这个时候，如果用户在网址后面加上恶意代码
        ('http://www.xss.com#alert(document.cookie)');
      </script>
      ```

    XSS 预防：

    1. 输入过滤，转义(html 转义为实体)输出、存储
    2. 在标签的 href、src 等属性中，包含 `javascript:` 等可执行代码。
    3. 避免使用 eval，new Function 等执行字符串的方法，除非确定字符串和用户输入无关。
       `new Function ([arg1[, arg2[, ...argN]],] functionBody)`
    4. 使用 innerHTML，document.write 的时候，如果数据是用户输入的，那么需要对关键字符都进行过滤与转义。
    5. 对于非客户端 cookie，比如保存用户凭证的 session，务必标识为 http only，这样 js 就获取不到这个 cookie 值了，安全性得到提高。
    6. X-XSS-Protection
    7. cookie secure\httpOnly

  - CSRF
    - [浅谈 CSRF 攻击方式](https://www.cnblogs.com/hyddd/archive/2009/04/09/1432744.html)
    - [跨站请求伪造与 Same-Site Cookie](https://www.jianshu.com/p/66f77b8f1759)
    - 预防
      - 检测 http referer 是否是同域名，通常来讲，用户提交的请求，referer 应该是来来自站内地址，所以如果发现 referer 中地址异常，那么很可能是遭到了 CSRF 攻击。
      - 避免登录的 session 长时间存储在客户端中。
      - 关键请求使用验证码或者 token 机制。在一些十分关键的操作，比如交易付款环节。这种请求中，加入验证码，可以防止被恶意用户攻击。token 机制也有一定的防御作用。具体来说就是服务器每次返回客户端页面的时候，在页面中埋上一个 token 字段，例如 `<input type=“hidden” name=“csrftoken” value=“abcd">`。 之后，客户端请求的时候带上这个 token，使用这个机制后，攻击者也就很难发起 CSRF 攻击了。
      - sameSite cookie

## [前端性能优化最佳实践](https://csspod.com/frontend-performance-best-practices/)

## [React 16 加载性能优化指南](https://juejin.im/post/5b506ae0e51d45191a0d4ec9)

## 项目性能优化

- 编码优化

  - 减少 cookie 体积: 能有效减少每次请求的体积和响应时间；
    - 去除不必要的 cookie；
    - 压缩 cookie 大小；
    - 设置 domain 与 过期时间；
  - dom 优化:
    - 减少访问 dom 的次数，如需多次，将 dom 缓存于变量中；
    - 减少重绘与回流:
      - 多次操作合并为一次；
      - 减少对计算属性的访问；
        - 例如 offsetTop， getComputedStyle 等
        - 因为浏览器需要获取最新准确的值，因此必须立即进行重排，这样会破坏了浏览器的队列整合，尽量将值进行缓存使用；
      - 大量操作时，可将 dom 脱离文档流或者隐藏，待操作完成后再重新恢复；
      - 使用 DocumentFragment / cloneNode / replaceChild 进行操作；
    - 使用事件委托，避免大量的事件绑定；
  - css 优化:
    - 层级扁平，避免过于多层级的选择器嵌套（不超过 3 层）；
    - 特定的选择器好过一层一层查找: .xxx-child-text{} 优于 .xxx .child .text{}
    - 减少使用通配符与属性选择器；
    - 减少不必要的多余属性；
    - 使用 动画属性 实现动画，动画时脱离文档流，开启硬件加速，优先使用 css 动画；
      - [用 CSS 开启硬件加速来提高网站性能（转）](https://www.cnblogs.com/rubylouvre/p/3471490.html)
    - 使用 `<link>` 替代原生 @import；
  - html 优化:
    - 减少 dom 数量，避免不必要的节点或嵌套；
    - 避免 `<img src="" />` 空标签，能减少服务器压力，因为 src 为空时，浏览器仍然会发起请求
    - 图片提前 **指定宽高** 或者 **脱离文档流**，能有效减少因图片加载导致的页面回流；
    - **语义化标签** 有利于 SEO 与浏览器的解析时间；
    - 减少使用 table 进行布局，避免使用`<br />`与`<hr />`；

- 页面基础优化

  - 引入位置: `css 文件<head>中引入， js 文件<body>底部引入；`

    - 影响首屏的，优先级很高的 js 也可以头部引入，甚至内联；

  - 减少请求 (http 1.0 - 1.1)，合并请求，正确设置 http 缓存；

  - 减少文件体积:

    - 删除多余代码:
      - tree-shaking
      - code-spliting
    - 混淆 / 压缩代码(UglifyJs)，开启 gzip 压缩；
    - 多份编译文件按条件引入:
      - 针对现代浏览器直接给 ES6 文件，只针对低端浏览器引用编译后的 ES5 文件；
      - 可以利用`<script type="module"> / <script type="module">`进行条件引入用
    - 动态 polyfill，只针对不支持的浏览器引入 polyfill；

  - 图片优化:

    - 根据业务场景，与 UI 探讨选择 合适质量，合适尺寸；
    - 根据需求和平台，选择合适格式，例如非透明时可用 jpg；非苹果端，使用 webp；
    - 小图片合成 雪碧图，低于 5K 的图片可以转换成 base64 内嵌；
    - 合适场景下，使用 iconfont 或者 svg；

  - 使用缓存:

    - 浏览器缓存: 通过设置请求的过期时间，合理运用浏览器缓存；
    - CDN 缓存: 静态文件合理使用 CDN 缓存技术；

      - HTML 放于自己的服务器上；
      - 打包后的图片 / js / css 等资源上传到 CDN 上，文件带上 hash 值；
      - 由于浏览器对单个域名请求的限制，可以将资源放在多个不同域的 CDN 上，可以绕开该限制；

    - 服务器缓存: 将不变的数据、页面缓存到 内存 或 远程存储(redis 等) 上；
    - 数据缓存: 通过各种存储将不常变的数据进行缓存，缩短数据的获取时间；

- 首屏渲染优化
  - css / js 分割，使首屏依赖的文件体积最小，内联首屏关键 css / js；
  - 非关键性的文件尽可能的 异步加载和懒加载，避免阻塞首页渲染；
  - 使用 dns-prefetch / preconnect / prefetch / preload 等浏览器提供的资源提示，加快文件传输；
    - [[译] 资源提示 —— 什么是 Preload，Prefetch 和 Preconnect？](https://juejin.im/post/5b5984b851882561da216311)
  - 谨慎控制好 Web 字体，一个大字体包足够让你功亏一篑；
    - 控制字体包的加载时机；
    - 如果使用的字体有限，那尽可能只将使用的文字单独打包，能有效减少体积；
  - 合理利用 Localstorage / server-worker 等存储方式进行 数据与资源缓存；
  - 重要的元素优先渲染；视窗内的元素优先渲染；
  - 优化用户感知:
    - 利用一些动画过渡效果，能有效减少用户对卡顿的感知；
    - 尽可能利用骨架屏(Placeholder) / Loading 等减少用户对白屏的感知；
    - 动画帧数尽量保证在 30 帧 以上，低帧数、卡顿的动画宁愿不要；
