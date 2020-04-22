# NodeJS

## [Node.js 中的模块机制](https://juejin.im/entry/5b4b5081e51d451984696cb7)

- 模块查找流程

  - 缓存
  - 内置模块
  - 绝对路径、相对路径
    - 解析得到真实路径，按照后缀名 `.js`、`.json` 、`.node` 尝试加载
    - 当做目录查找
      - 寻找 package.json 文件，解析 main 字段， 根据 main 字段中指定的文件路径查找指定文件
      - 在该目录按照 `index.js`、`index.json`、`index.node` 顺序加载
      - 如果还没有找到，就抛出错误
  - NPM 模块包

    > 加载顺序是可以使用 module.paths 来查看。module.paths 返回是一个数组，第一个元素是文件当前目录下的 node_modules 文件夹，越往后就是上一级目录的 node_modules 文件夹，直到查找到 home 目录下的 node_modules 文件夹。

    ```shell
    [
      'D:\\side project\\test\\node_modules',
      'D:\\side project\\node_modules',
      'D:\\node_modules'
    ];
    ```

    > node 会在各个 node_modules 下先查找以标识符为主的分别是 .js, .json, .node 后缀的文件，如果没有找到，那么就当作是一个目录来进行来查找目录下的 package.json, 并解析出其中的 main 字段指定的文件路径，如果没有文件路径或者文件路径错误，目录下的 index.js, index.json, index.node, 如果没有查找到上述的文件，那么就会抛出一个错误。

  <img style="background-color: white;" src="../imgs/node模块查找流程.png">

## NodeJS 的事件循环(Event Loop)

- [详解 JavaScript 中的 Event Loop（事件循环）机制](https://zhuanlan.zhihu.com/p/33058983)
- [Node.js 的事件循环(Event Loop)、Timer 和 process.nextTick()[翻译]](https://zhuanlan.zhihu.com/p/34451546)

## Stream

- [Node.js Stream: 你需要知道的一切](https://juejin.im/post/5940a9c3128fe1006a0ab176)
- [模拟实现和深入理解 Node Stream 内部机制](https://juejin.im/post/5a6c7c4df265da3e5234bf14)

![](https://user-gold-cdn.xitu.io/2017/6/14/d4fff9e6bbb5bb32864b1c64b3169876?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

![](https://user-gold-cdn.xitu.io/2017/6/14/03e1f627b419676dbb727ab9bc35e77e?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## [Process](./process.md)

## [Nodejs 进程间通信](http://www.ayqy.net/blog/nodejs%E8%BF%9B%E7%A8%8B%E9%97%B4%E9%80%9A%E4%BF%A1/)

- 通信方式

  - 通过 stdin/stdout 传递 json

    ```js
    const { spawn } = require("child_process");

    const child = spawn("node", ["./stdio-child.js"]);
    child.stdout.setEncoding("utf8");
    child.stdin.write(
      JSON.stringify({
        type: "handshake",
        payload: "你好吖",
      })
    );

    child.stdout.on("data", function (chunk) {
      let data = chunk.toString();
      let message = JSON.parse(data);
      console.log(`${message.type} ${message.payload}`);
    });
    ```

    ```js
    // ./stdio-child.js
    // 子进程-收
    process.stdin.on("data", (chunk) => {
      let data = chunk.toString();
      let message = JSON.parse(data);
      switch (message.type) {
        case "handshake":
          // 子进程-发
          process.stdout.write(
            JSON.stringify({
              type: "message",
              payload: message.payload + " : hoho",
            })
          );
          break;
        default:
          break;
      }
    });
    ```

  - 原生 IPC 通信

    spawn() 及 fork() 的例子，进程之间可以借助内置的 IPC 机制通信。

    ```
    父进程：

      process.on('message')收

      child.send()发

    子进程：

      process.on('message')收

      process.send()发
    ```

  - socket

    借助网络来完成进程间通信，不仅能跨进程，还能跨机器

    node-ipc 就采用这种方案，例如：

    ```js
    // server

    const ipc = require("../../../node-ipc");

    ipc.config.id = "world";
    ipc.config.retry = 1500;
    ipc.config.maxConnections = 1;

    ipc.serveNet(function () {
      ipc.server.on("message", function (data, socket) {
        ipc.log("got a message : ", data);
        ipc.server.emit(socket, "message", data + " world!");
      });

      ipc.server.on("socket.disconnected", function (data, socket) {
        console.log("DISCONNECTED\n\n", arguments);
      });
    });
    ipc.server.on("error", function (err) {
      ipc.log("Got an ERROR!", err);
    });
    ipc.server.start();

    // client
    const ipc = require("node-ipc");

    ipc.config.id = "hello";
    ipc.config.retry = 1500;

    ipc.connectToNet("world", function () {
      ipc.of.world.on("connect", function () {
        ipc.log("## connected to world ##", ipc.config.delay);
        ipc.of.world.emit("message", "hello");
      });
      ipc.of.world.on("disconnect", function () {
        ipc.log("disconnected from world");
      });
      ipc.of.world.on("message", function (data) {
        ipc.log("got a message from world : ", data);
      });
    });
    ```

  - 消息队列

## [单线程与多线程的区别](https://blog.csdn.net/u012134199/article/details/46290465)

## [[NodeJS] 优缺点及适用场景讨论](https://www.cnblogs.com/sysuys/p/3460614.html)

## koa 的原理,继承

```js
// application.js

module.exports = class Application extends Emitter {
  constructor() {
    super();
    this.proxy = false;
    this.middleware = [];
    this.env = process.env.NODE_ENV || "development";
    this.context = Object.create(context);
    this.request = Object.create(request);
    this.response = Object.create(response);
  }

  listen(...args) {
    const server = http.createServer(this.callback());
    server.listen(...args);
  }

  use(fn) {
    if (typeof fn !== "function") throw new TypeError("");
    if (isGeneratorFunction(fn)) {
      console.warn("");
      fn = convert(fn);
    }
    this.middleware.push(fn);
    return this;
  }

  callback() {
    // 生成 handle fn
    fn = compose(this.middleware);

    // 添加默认的 error handle
    if (!this.listenCounter("error")) this.on("error", this.onerror);

    return (req, res) => {
      // 生成 ctx
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };
  }

  handleRequest(ctx, fnMiddleware) {
    const res = ctx.res;
    res.statusCode = 404;
    const onerror = (err) => ctx.onerror(err);
    const handleResponse = () => respond(ctx);
    onFinished(res, onerror);
    fnMiddleware(ctx)
      .then(handleResponse)
      .catch((error) => onerror);
  }

  createContext(req, res) {
    const context = Object.create(this.context);
    const request = (context.request = Object.create(this.request));
    const response = (context.response = Object.create(this.response));
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }

  onerror(err) {
    if (!(err instanceof Error))
      throw new TypeError(util.format("non-error thrown: %j", err));

    if (404 == err.status || err.expose) return;
    if (this.silent) return;

    const msg = err.stack || err.toString();
    console.error();
    console.error(msg.replace(/^/gm, "  "));
    console.error();
  }
};

function respond(ctx) {
  // allow bypassing koa
  if (false === ctx.respond) return;

  const res = ctx.res;
  if (!ctx.writable) return;

  let body = ctx.body;
  const code = ctx.status;

  // ignore body
  if (statuses.empty[code]) {
    // strip headers
    ctx.body = null;
    return res.end();
  }

  if ("HEAD" == ctx.method) {
    if (!res.headersSent && isJSON(body)) {
      ctx.length = Buffer.byteLength(JSON.stringify(body));
    }
    return res.end();
  }

  // status body
  if (null == body) {
    if (ctx.req.httpVersionMajor >= 2) {
      body = String(code);
    } else {
      body = ctx.message || String(code);
    }
    if (!res.headersSent) {
      ctx.type = "text";
      ctx.length = Buffer.byteLength(body);
    }
    return res.end(body);
  }

  // responses
  if (Buffer.isBuffer(body)) return res.end(body);
  if ("string" == typeof body) return res.end(body);
  if (body instanceof Stream) return body.pipe(res);

  // body: json
  body = JSON.stringify(body);
  if (!res.headersSent) {
    ctx.length = Buffer.byteLength(body);
  }
  res.end(body);
}
```

```js
// koajs/compose  洋葱模型
function compose(middleware) {
  if (!Array.isArray(middleware))
    throw new TypeError("Middleware stack must be an array!");
  for (const fn of middleware) {
    if (typeof fn !== "function")
      throw new TypeError("Middleware must be composed of functions!");
  }

  /**
   * @param {Object} context
   * @return {Promise}
   * @api public
   */

  return function (context, next) {
    // last called middleware #
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      if (i <= index)
        return Promise.reject(new Error("next() called multiple times"));
      index = i;
      let fn = middleware[i];
      if (i === middleware.length) fn = next;
      if (!fn) return Promise.resolve();
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err);
      }
    }
  };
}
```

## Node 内存泄漏问题

- [nodejs 调试工具之 heapdump 简介](https://leokongwq.github.io/2016/11/08/nodejs-heapdump.html)
- [v8-profiler](https://github.com/node-inspector/v8-profiler)
- [easy-monitor](https://github.com/hyj1991/easy-monitor)

## IO 模式

- [Linux IO 模式及 select、poll、epoll 详解](https://segmentfault.com/a/1190000003063859?utm_source=Weibo&utm_medium=shareLink&utm_campaign=socialShare#articleHeader0)

- [大话 Select、Poll、Epoll](https://cloud.tencent.com/developer/article/1005481)

## webpack

- [Webpack 核心模块 tapable 解析](https://blog.csdn.net/github_38140984/article/details/83013823)

  > Webpack 本质上是一种事件流的机制，它的工作流程就是将各个插件串联起来，而实现这一切的核心就是 tapable，Webpack 中最核心的，负责编译的 Compiler 和负责创建 bundles 的 Compilation 都是 tapable 构造函数的实例。

- webpack loaders

  - 简单的 raw-loader

    ```js
    module.exports = function (source) {
      const json = JSON.stringify(source)
        .replace(/\u2028/g, "\\u2028") // es6 模板字符串问题
        .replace(/\u2029/g, "\\u2029");
      return `export default ${json}`;
    };
    ```

  - 通过 loader-utils 的方法 getOptions 获取 loader 的 options 配置

    ```js
    const loaderUtils = require("loader-utils");
    module.exports = function (source) {
      const { name } = loaderUtils.getOptions(this);
      console.log("loader options.name", name);
      const json = JSON.stringify(source)
        .replace(/\u2028/g, "\\u2028") // es6 模板字符串问题
        .replace(/\u2029/g, "\\u2029");
      return `export default ${json}`;
    };
    ```

  - loader 异常处理

    - loader 内直接通过 throw 抛出

      ```js
      module.exports = function (source) {
        throw new Error("loader error);
        return `export default`;
      };
      ```

    - 通过 this.callback(err, result) 传递错误

      ```js
      module.exports = function (source) {
        throw new Error("loader error);
        this.callback(err, `export default1`,`export default2`,`export default3`,`export default4`,)
      };
      ```

  - 异步 loader

    ```js
    const fs = require("fs");
    const path = require("path");
    module.exports = function (source) {
      const callback = this.async();
      fs.readFile("./src/async.txt", "utf-8", (err, result) => {
        callback(err, result);
      });
    };
    ```

  - 在 loader 中使用缓存

    > webpack 中默认开启 loader 缓存， 可以使用 this.cacheable(false) 关闭
    > 缓存条件： loader 的结果在相同的输入下有确定的输出， 有依赖的 loader 无法使用缓存

    ```js
    const loaderUtils = require("loader-utils");
    module.exports = function (source) {
      const { name } = loaderUtils.getOptions(this);
      this.cacheable(false); // 关闭缓存
      console.log("loader options.name", name);
      const json = JSON.stringify(source)
        .replace(/\u2028/g, "\\u2028") // es6 模板字符串问题
        .replace(/\u2029/g, "\\u2029");
      return `export default ${json}`;
    };
    ```

  - loaderUtils.interpolateName()

    ```js
    const loaderUtils = require("loader-utils");
    module.exports = function (source) {
      console.log("Loader  is excuted!");

      const url = loaderUtils.interpolateName(this, "[name].[ext]", source);
      console.log(url);
      this.emitFile(url, "test");
      return source;
    };
    ```

- webpack plugins

  - 插件基本结构

    ```js
    module.exports = class MyPlugin {
      constructor(options) {
        this.options = options;
      }

      apply(compiler) {
        console.log("my plugin is executed!");
        compiler.hooks.done.tap("My Plugin", (stat) => {
          console.log("hello world");
          console.log("my plugin options: " + JSON.stringify(this.options));
        });
      }
    };
    ```

  - 插件错误处理

    - 参数校验阶段可以直接 throw 的方式抛出
      ```js
      throw new Error("Error Message");
      ```
    - 通过 compilation 对象的 warnings 和 errors 接收

      ```js
        compilation.warnings.push('warning);
        compilation.errors.push('error)
      ```

  - 通过 compilation 进行文件写入

    - compilation 上的 assets 可以用于文件写入
      - 可以将 zip 资源包设置到 compilation.assets 对象上
    - 文件写入需要使用 [webpack-sources](https://github.com/webpack/webpack-sources)

      ```js
      const { RawSource } = require("webpack-sources");
      module.exports = class DemoPlugin {
        constructor(options) {
          this.options = options;
        }

        apply(compiler) {
          const { name } = this.options;
          compiler.hooks.emit.tapAsync("emit", (compilation, cb) => {
            compilation.assets[name] = new RawResource("demo");
            cb();
          });
        }
      };
      ```

- [超详细的 webpack 原理解读](https://segmentfault.com/a/1190000017890529)

  1. 初始化阶段

     | 事件            | 描述                                                                                                                                           |
     | :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
     | 初始化参数      | 从配置文件和 shell 中读取和合并参数，得出最终的参数，这个过程还会执行配置文件中插件的实例化语句 new Plugin()                                   |
     | 实例化 Compiler | 根据得到的配置文件，实例化 Compiler，Compiler 负责文件监听和启动编译。在 Compiler 实例中包含了完整的 webpack 配置，全局只有一个 Compiler 实例  |
     | 加载插件        | 依次调用插件的 apply 方法，让插件可以监听后续的所有事件节点。同时向插件中传入 compiler 实例的引用，以方便插件通过 compiler 调用 webpack 的 api |
     | environment     | 开始应用 node.js 风格的文件系统到 compiler 对象，以方便后续的文件寻找和读取                                                                    |
     | Entry-option    | 读取配置的 Entrys,为每个 Entry 实例化一个对应的 EntryPlugin,为后面该 Entry 的递归解析工作做准备                                                |
     | After-plugins   | 调用完所有内置的和配置的插件的 apply 方法                                                                                                      |
     | After-resolvers | 根据配置初始化 resolver,resolver 负责在文件系统中寻找指定路径的文件                                                                            |

  2. 编译阶段

     | 事件          | 描述                                                                                                                                                                                                          |
     | :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
     | run           | 启动一次编译                                                                                                                                                                                                  |
     | watch-run     | 在监听模式下启动编译，文件发生变化会重新编译                                                                                                                                                                  |
     | compile       | 告诉插件一次新的编译将要启动，同时会给插件带上 compiler 对象                                                                                                                                                  |
     | compilation   | 当 webpack 以开发模式运行时，每当检测到文件的变化，便有一次新的 compilation 被创建。一个 Compilation 对象包含了当前的模块资源、编译生成资源、变化的文件等。compilation 对象也提供了很多事件回调给插件进行拓展 |
     | make          | 一个新的 compilation 对象创建完毕,即将从 entry 开始读取文件,根据文件类型和编译的 loader 对文件进行 ==编译== ,编译完后再找出该文件依赖的文件,递归地编译和解析                                                  |
     | after-compile | 一次 compilation 执行完成                                                                                                                                                                                     |
     | invalid       | 当遇到错误会触发改事件,该事件不会导致 webpack 退出                                                                                                                                                            |

  3. 输出阶段

     | 事件        | 描述                                                                                                   |
     | :---------- | :----------------------------------------------------------------------------------------------------- |
     | should-emit | 所有需要输出的文件已经生成,询问插件有哪些文件需要输出,有哪些不需要输出                                 |
     | emit        | 确定好要输出哪些文件后,执行文件输出, ==可以在这里获取和修改输出的内容==                                |
     | after-emit  | 文件输出完毕                                                                                           |
     | done        | 成功完成一次完整的编译和输出流程                                                                       |
     | failed      | 如果在编译和输出中出现错误,导致 webpack 退出,就会直接跳转到本步骤,插件可以在本事件中获取具体的错误原因 |

  ```js
  //以下代码用来包含webpack运行过程中的每个阶段
  //file:webpack.config.js

  const path = require("path");
  //插件监听事件并执行相应的逻辑
  class TestPlugin {
    constructor() {
      console.log("@plugin constructor");
    }

    apply(compiler) {
      console.log("@plugin apply");

      compiler.plugin("environment", (options) => {
        console.log("@environment");
      });

      compiler.plugin("after-environment", (options) => {
        console.log("@after-environment");
      });

      compiler.plugin("entry-option", (options) => {
        console.log("@entry-option");
      });

      compiler.plugin("after-plugins", (options) => {
        console.log("@after-plugins");
      });

      compiler.plugin("after-resolvers", (options) => {
        console.log("@after-resolvers");
      });

      compiler.plugin("before-run", (options, callback) => {
        console.log("@before-run");
        callback();
      });

      compiler.plugin("run", (options, callback) => {
        console.log("@run");
        callback();
      });

      compiler.plugin("watch-run", (options, callback) => {
        console.log("@watch-run");
        callback();
      });

      compiler.plugin("normal-module-factory", (options) => {
        console.log("@normal-module-factory");
      });

      compiler.plugin("context-module-factory", (options) => {
        console.log("@context-module-factory");
      });

      compiler.plugin("before-compile", (options, callback) => {
        console.log("@before-compile");
        callback();
      });

      compiler.plugin("compile", (options) => {
        console.log("@compile");
      });

      compiler.plugin("this-compilation", (options) => {
        console.log("@this-compilation");
      });

      compiler.plugin("compilation", (options) => {
        console.log("@compilation");
      });

      compiler.plugin("make", (options, callback) => {
        console.log("@make");
        callback();
      });

      compiler.plugin("compilation", (compilation) => {
        compilation.plugin("build-module", (options) => {
          console.log("@build-module");
        });

        compilation.plugin("normal-module-loader", (options) => {
          console.log("@normal-module-loader");
        });

        compilation.plugin("program", (options, callback) => {
          console.log("@program");
          callback();
        });

        compilation.plugin("seal", (options) => {
          console.log("@seal");
        });
      });

      compiler.plugin("after-compile", (options, callback) => {
        console.log("@after-compile");
        callback();
      });

      compiler.plugin("should-emit", (options) => {
        console.log("@should-emit");
      });

      compiler.plugin("emit", (options, callback) => {
        console.log("@emit");
        callback();
      });

      compiler.plugin("after-emit", (options, callback) => {
        console.log("@after-emit");
        callback();
      });

      compiler.plugin("done", (options) => {
        console.log("@done");
      });

      compiler.plugin("failed", (options, callback) => {
        console.log("@failed");
        callback();
      });

      compiler.plugin("invalid", (options) => {
        console.log("@invalid");
      });
    }
  }
  ```

````

```
  #在目录下执行
  webpack
  #输出以下内容
  @plugin constructor
  @plugin apply
  @environment
  @after-environment
  @entry-option
  @after-plugins
  @after-resolvers
  @before-run
  @run
  @normal-module-factory
  @context-module-factory
  @before-compile
  @compile
  @this-compilation
  @compilation
  @make
  @build-module
  @normal-module-loader
  @build-module
  @normal-module-loader
  @seal
  @after-compile
  @should-emit
  @emit
  @after-emit
  @done
```

## [npm 模块安装机制](https://github.com/Advanced-Frontend/Daily-Interview-Question/issues/22)

## semantic version（semver，语义化版本）

1. 使用语义化版本控制的软件必须（MUST）定义公共 API。该 API 可以在代码中被定义或出现于严谨的文件内。无论何种形式都应该力求精确且完整。
2. 标准的版本号必须（MUST）采用 X.Y.Z 的格式，其中 X、Y 和 Z 为非负的整数，且禁止（MUST NOT）在数字前方补零。X 是主版本号、Y 是次版本号、而 Z 为修订号。每个元素必须（MUST）以数值来递增。例如：1.9.1 -> 1.10.0 -> 1.11.0。
3. 标记版本号的软件发行后，禁止（MUST NOT）改变该版本软件的内容。任何修改都必须（MUST）以新版本发行。
4. 主版本号为零（0.y.z）的软件处于开发初始阶段，一切都可能随时被改变。这样的公共 API 不应该被视为稳定版。
5. 1.0.0 的版本号用于界定公共 API 的形成。这一版本之后所有的版本号更新都基于公共 API 及其修改内容。
6. 修订号 Z（x.y.Z | x > 0）必须（MUST）在只做了向下兼容的修正时才递增。这里的修正指的是针对不正确结果而进行的内部修改。
7. 次版本号 Y（x.Y.z | x > 0）必须（MUST）在有向下兼容的新功能出现时递增。在任何公共 API 的功能被标记为弃用时也必须（MUST）递增。也可以（MAY）在内部程序有大量新功能或改进被加入时递增，其中可以（MAY）包括修订级别的改变。每当次版本号递增时，修订号必须（MUST）归零。
8. 主版本号 X（X.y.z | X > 0）必须（MUST）在有任何不兼容的修改被加入公共 API 时递增。其中可以（MAY）包括次版本号及修订级别的改变。每当主版本号递增时，次版本号和修订号必须（MUST）归零。
9. 先行版本号可以（MAY）被标注在修订版之后，先加上一个连接号再加上一连串以句点分隔的标识符来修饰。标识符必须（MUST）由 ASCII 字母数字和连接号 `[0-9A-Za-z-]` 组成，且禁止（MUST NOT）留白。数字型的标识符禁止（MUST NOT）在前方补零。先行版的优先级低于相关联的标准版本。被标上先行版本号则表示这个版本并非稳定而且可能无法满足预期的兼容性需求。范例：1.0.0-alpha、1.0.0-alpha.1、1.0.0-0.3.7、1.0.0-x.7.z.92。
10. 版本编译元数据可以（MAY）被标注在修订版或先行版本号之后，先加上一个加号再加上一连串以句点分隔的标识符来修饰。标识符必须（MUST）由 ASCII 字母数字和连接号 `[0-9A-Za-z-]` 组成，且禁止（MUST NOT）留白。当判断版本的优先层级时，版本编译元数据可（SHOULD）被忽略。因此当两个版本只有在版本编译元数据有差别时，属于相同的优先层级。范例：1.0.0-alpha+001、1.0.0+20130313144700、1.0.0-beta+exp.sha.5114f85。
11. 版本的优先层级指的是不同版本在排序时如何比较。判断优先层级时，必须（MUST）把版本依序拆分为主版本号、次版本号、修订号及先行版本号后进行比较（版本编译元数据不在这份比较的列表中）。由左到右依序比较每个标识符，第一个差异值用来决定优先层级：主版本号、次版本号及修订号以数值比较，例如：1.0.0 < 2.0.0 < 2.1.0 < 2.1.1。当主版本号、次版本号及修订号都相同时，改以优先层级比较低的先行版本号决定。例如：1.0.0-alpha < 1.0.0。有相同主版本号、次版本号及修订号的两个先行版本号，其优先层级必须（MUST）透过由左到右的每个被句点分隔的标识符来比较，直到找到一个差异值后决定：只有数字的标识符以数值高低比较，有字母或连接号时则逐字以 ASCII 的排序来比较。数字的标识符比非数字的标识符优先层级低。若开头的标识符都相同时，栏位比较多的先行版本号优先层级比较高。范例：1.0.0-alpha < 1.0.0-alpha.1 < 1.0.0-alpha.beta < 1.0.0-beta < 1.0.0-beta.2 < 1.0.0-beta.11 < 1.0.0-rc.1 < 1.0.0。

- [Semver(语义化版本号)扫盲](https://juejin.im/post/5ad413ba6fb9a028b5485866)

  - 先行版本
    - alpha: 内部版本
    - beta: 公测版本
    - rc: 即 Release candiate，正式版本的候选版本
    - stable：稳定版。在开源软件中，都有 stable 版，这个就是开源软件的稳定发行版。
  - npm 包发布

    - 升级补丁版本号：npm version patch
    - 升级小版本号：npm version minor
    - 升级大版本号：npm version major

    > 当执行 npm publish 时，会首先将当前版本发布到 npm registry，然后更新 **dist-tags.latest** 的值为新版本。
    > 当执行 npm publish --tag=next 时，会首先将当前版本发布到 npm registry，并且更新 **dist-tags.next** 的值为新版本。这里的 next 可以是任意有意义的命名（比如：v1.x、v2.x 等等）

- [语义化版本（SemVer）的范围](https://www.jianshu.com/p/d306ed03de62)

  - 原始的范围控制

    - `< 小于`；
    - `<= 小于等于`；
    - `> 大于`；
    - `>= 大于等于`；
    - `= 等于`；如果没有指定操作符，则默认为等于。

    > `>=1.2.7 <1.3.0`
    > `1.2.7 || >=1.2.9 <2.0.0`

  - 版本范围高级用法
    - 连接符（-）范围 X.Y.Z - A.B.C
      - `1.2.3 - 2.3.4` -> `>=1.2.3 <=2.3.4`
      - `1.2 - 2.3.4` -> `>=1.2.0 <=2.3.4`: 如果范围中的第一个版本号只有一部分，剩下的部分以零填充。
      - `1.2.3 - 2.3` -> `>=1.2.3 <2.4.0`: 如果范围中的第二个版本号只有一部分，代表范围中包含了这个版本。
    - X 范围
      - `1.x` -> `>=1.0.0 <2.0.0` (只要满足主版本号即可)
      - `1.2.x` -> `>=1.2.0 <1.3.0` (需要满足主版本和此版本号)
    - 部分版本号的含义与 X 范围表示含义一样，所以 X 或者`*`都是可以省略的。
    - 波浪线（~）范围
      >
      - `~1.2.3` -> `>=1.2.3 <1.3.0`
      - `~1.2` -> `>=1.2.0 <1.3.0`
      - `~1` -> `>=1.0.0 <2.0.0`
      - `~0.2.3` -> `>=0.2.3 <0.3.0`
      - `~0.2` -> `>=0.2.0 <0.3.0`
      - `~0` -> `>=0.0.0 <1.0.0`
    - 补注号（^）范围
      > **允许最左非零数字的更改，如果最左非零为 x 或者缺失，则左前一位数子更改。**
      - `^1.2.3` -> `>=1.2.3 <2.0.0`
      - `^0.2.3` -> `>=0.2.3 <0.3.0`
      - `^0.0.3` -> `>=0.0.3 <0.0.4`
      - `^1.2.3-beta.2` -> `>=1.2.3-beta.2 <2.0.0`
      - `^0.0.3-beta` -> `>=0.0.3-beta <0.0.4`
      - `^1.2.x` -> `>=1.2.0 <2.0.0`
      - `^0.0.x` -> `>=0.0.0 <0.1.0`
      - `^0.0` -> `>=0.0.0 <0.1.0`
      - `^1.x` -> `>=1.0.0 <2.0.0`
      - `^0.x` -> `>=0.0.0 <1.0.0`
````
