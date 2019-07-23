# 网络层

## http

- HTTP 响应头

  - X-Frame-Options (禁止页面被加载进 iframe 中):
    - `DENY`: 表示该页面不允许在 frame 中展示，即便是在相同域名的页面中嵌套也不允许。
    - `SAMEORIGIN`: 表示该页面可以在相同域名页面的 frame 中展示。
    - `ALLOW-FROM uri`: 表示该页面可以在指定来源的 frame 中展示。
  - X-XSS-Protection 对于反射型 XSS 进行一些防御
  - [Content-Security-Policy(内容安全策略( CSP ))](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CSP)
  - [Content-Security-Policy](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Headers/Content-Security-Policy__by_cnvoid)

    `Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com`

    - 所有内容均来自站点的同一个源 (不包括其子域名)

      ```js
      Content-Security-Policy: default-src 'self';
      ```

    - 允许内容来自信任的域名及其子域名 (域名不必须与 CSP 设置所在的域名相同)

      ```js
      Content-Security-Policy: default-src 'self' *.trusted.com;
      ```

    - 所有内容均来自站点的同一个源 (不包括其子域名)

      ```js
      Content-Security-Policy: default-src 'self'; img-src *; media-src media1.com media2.com; script-src userscripts.example.com;
      ```

- [HTTP 报文](https://www.cnblogs.com/klguang/p/4618526.html)
  - 请求
    - 起始行：`method`、`path`、`HTTP version`
    - 首部
    - 主体
  - 响应
    - 起始行：`HTTP version`、`status code`、`status description`
    - 首部
    - 主体
- [HTTP 协议](https://zhuanlan.zhihu.com/p/24913080)
- [HTTP 请求方法：GET、HEAD、POST、PUT、DELETE、CONNECT、OPTIONS、TRACE、PATCH](https://itbilu.com/other/relate/EkwKysXIl.html)
  - PUT 和 PATCH 区别
    - PUT 一般是资源的整体更新，PATCH 一般是资源的部分更新
    - 当资源不存在时，PATCH 会创建一个新的资源，PUT 只会对已在资源进行更新。
- [HTTP 中 GET 与 POST 的区别](https://mp.weixin.qq.com/s?__biz=MzI3NzIzMzg3Mw==&mid=100000054&idx=1&sn=71f6c214f3833d9ca20b9f7dcd9d33e4)

  **GET 和 POST 本质上就是 TCP 链接，并无差别。但是由于 HTTP 的规定和浏览器/服务器的限制，导致他们在应用过程中体现出一些不同。**

  1. GET 在浏览器回退时是无害的，而 POST 会再次提交请求。
  2. GET 产生的 URL 地址可以被 Bookmark，而 POST 不可以。
  3. GET 请求会被浏览器主动 cache，而 POST 不会，除非手动设置。
  4. GET 请求只能进行 url 编码，而 POST 支持多种编码方式。
  5. GET 请求参数会被完整保留在浏览器历史记录里，而 POST 中的参数不会被保留。
  6. GET 请求在 URL 中传送的参数是有长度限制的，而 POST 么有。
  7. 对参数的数据类型，GET 只接受 ASCII 字符，而 POST 没有限制。
  8. GET 比 POST 更不安全，因为参数直接暴露在 URL 上，所以不能用来传递敏感信息。
  9. GET 参数通过 URL 传递，POST 放在 Request body 中。
  10. **GET 产生一个 TCP 数据包；POST 产生两个 TCP 数据包。**  
      对于 GET 方式的请求，浏览器会把 http header 和 data 一并发送出去，服务器响应 200（返回数据）；  
      而对于 POST，浏览器先发送 header，服务器响应 100 continue，浏览器再发送 data，服务器响应 200 ok（返回数据）。

- HTTP 请求优化
  - [前端性能优化之 http 请求的过程](https://juejin.im/post/59f44c5ef265da4327177b98)

## https

- [SSL/TLS 握手过程详解](https://www.jianshu.com/p/7158568e4867)
- [HTTPS 原理详解](https://zhuanlan.zhihu.com/p/27395037)
- [HTTPS](https://zhuanlan.zhihu.com/p/24854237)

## HTTP/2

- [HTTP/2 幕后原理](https://www.ibm.com/developerworks/cn/web/wa-http2-under-the-hood/index.html)
- [HTTP2 详解](https://juejin.im/post/5b88a4f56fb9a01a0b31a67e)
  1. 二进制分帧层
  2. 多路复用
     - HTTP2 采用二进制格式传输，取代了 HTTP1.x 的文本格式，二进制格式解析更高效。
     - 多路复用代替了 HTTP1.x 的序列和阻塞机制，所有的相同域名请求都通过同一个 TCP 连接并发完成。在 HTTP1.x 中，并发多个请求需要多个 TCP 连接，浏览器为了控制资源会有 6-8 个 TCP 连接都限制。
       HTTP2 中:
       - 同域名下所有通信都在单个连接上完成，消除了因多个 TCP 连接而带来的延时和内存消耗。
       - 单个连接上可以并行交错的请求和响应，之间互不干扰
  3. 服务端推送
  4. Header 压缩（使用 HPACK 算法来压缩首部内容）
  5. 流量控制

## TCP

- [三次握手的误解与错误类比(RFC 解读)](https://yonghaowu.github.io/2019/01/11/http_rfc_handshake/)

  TCP 需要 seq 序列号来做可靠重传或接收，而避免连接复用时无法分辨出 seq 是延迟或者是旧链接的 seq，因此需要三次握手来约定确定双方的 ISN（初始 seq 序列号）。

  TCP 设计中一个基本设定就是，通过 TCP 连接发送的每一个包，都有一个 sequence number。而因为每个包都是有序列号的，所以都能被确认收到这些包。

  确认机制是累计的，所以一个对 sequence number X 的确认，意味着 X 序列号之前(不包括 X) 包都是被确认接收到的。

  这条连接突然断开重连后，TCP 怎么样识别之前旧链接重发的包？——这就需要独一无二的 ISN（初始序列号）机制。

  当一个新连接建立时，初始序列号（ initial sequence number ISN）生成器会生成一个新的 32 位的 ISN。

  这个生成器会用一个 32 位长的时钟，差不多 4µs 增长一次，因此 ISN 会在大约 4.55 小时循环一次（`2^32 位的计数器，需要 2^32*4 µs 才能自增完，除以 1 小时共有多少 µs 便可算出 2^32*4 /(1*60*60*1000*1000)=4.772185884`）

  而一个段在网络中并不会比最大分段寿命（Maximum Segment Lifetime (MSL) ，默认使用 2 分钟）长，MSL 比 4.55 小时要短，所以我们可以认为 ISN 会是唯一的。

  1). A –> B SYN my sequence number is X

  2). A <– B ACK your sequence number is X, SYN my sequence number is Y

  3). A –> B ACK your sequence number is Y

- [TCP 三次握手](https://www.zhihu.com/question/24853633/answer/115173386)
- [TCP 三次握手、四次挥手](https://zhuanlan.zhihu.com/p/35768805)

  ![](https://img-blog.csdn.net/20180720212258640?watermark/2/text/aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM2MTMyMTI3/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70)

- [通俗大白话来理解 TCP 协议的三次握手和四次分手](https://github.com/jawil/blog/issues/14)
- [TCP 的滑动窗口与拥塞窗口](https://blog.csdn.net/zhangdaisylove/article/details/47294315)
- [TCP 滑动窗口（发送窗口和接收窗口）](https://my.oschina.net/xinxingegeya/blog/485650)
- [解析 TCP 之滑动窗口(动画演示)](https://blog.csdn.net/yao5hed/article/details/81046945)
- [TCP-IP 详解：滑动窗口（Sliding Window）](https://blog.csdn.net/wdscq1234/article/details/52444277)
- [TCP 拥塞控制-慢启动、拥塞避免、快重传、快启动](https://blog.csdn.net/jtracydy/article/details/52366461)
- [TCP-IP 详解: 慢启动和拥塞控制](https://blog.csdn.net/wdscq1234/article/details/52517420)
- [TCP 协议详解(慢启动,流量控制,阻塞控制之类)](https://blog.csdn.net/rock_joker/article/details/76769404)
- [TCP 协议与 UDP 协议的区别](https://zhuanlan.zhihu.com/p/47064829)
- [TIME_WAIT 累积与端口耗尽](https://blog.csdn.net/u010585120/article/details/80826999)
- [TIME_WAIT 的意义](https://blog.csdn.net/qq_36132127/article/details/81138873)

  - 可靠地实现 TCP 全双工连接的终止

    为了保证 A 发送的最后一个 ACK 报文段能够到达 B。

    A 给 B 发送的 ACK 可能会丢失，B 收不到 A 发送的确认，B 会超时重传 FIN+ACK 报文段，此时 A 处于 2MSL 时间内，就可以收到 B 重传的 FIN+ACK 报文段，接着 A 重传一次确认，重启 2MSL 计时器。最后，A 和 B 都能够正常进入到 CLOSED 状态。

    如果 A 在发完 ACK 后直接立即释放连接，而不等待一段时间，就无法收到 B 重传的 FIN+ACK 报文段，也就不会再次发送确认报文段，这样，B 就无法按照正常步骤进入 CLOSED 状态。

  - 允许旧的报文段在网络中消逝

    MSL 全称是 Maximum Segment Lifetime，是一个 TCP 包的最大存活时间，一个 TCP 包一旦在网络上存活超过 MSL，会直接被丢弃。

    A 发送确认后，该确认报文段可能因为路由器异常在网络中发生“迷途”，并没有到达 B，该确认报文段可以称为旧的报文段。A 在超时后进行重传，  发送新的报文段，B 在收到新的报文段后进入 CLOSED 状态。在这之后，发生迷途的旧报文段可能到达了 B，通常情况下，该报文段会被丢弃，不会造成任何的影响。但是如果两个相同主机 A 和 B 之间又建立了一个具有相同端口号的新连接，那么旧的报文段可能会被看成是新连接的报文段，如果旧的报文段中数据的任何序列号恰恰在新连接的当前接收窗口中，数据就会被重新接收，对连接造成破坏。为了避免这种情况，TCP 不允许处于 TIME_WAIT 状态的连接启动一个新的连接，因为 TIME_WAIT 状态持续 2MSL，就可以保证当再次成功建立一个 TCP 连接的时，来自之前连接的旧的报文段已经在网络中消逝，不会再出现在新的连接中。
