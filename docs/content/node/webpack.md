# Webpack

## tapable

- [Webpack4.0 source code analysis of Tapable](https://www.programmersought.com/article/1459649892/)

- SyncHook

  顺序执行

  - compile

    ```js
    var _fn0 = _x[0];
    _fn0();
    var _fn1 = _x[1];
    _fn1();
    var _fn2 = _x[2];
    _fn2();
    var _fn3 = _x[3];
    _fn3();
    var _fn4 = _x[4];
    _fn4();
    ```

- SyncBailHook

  顺序执行， 如果返回值不是 undefined, return 返回值，否则向下执行

  - compile

    ```js
    var _fn0 = _x[0];
    var _result0 = _fn0();
    if (_result0 !== undefined) {
      return _result0;
    } else {
      var _fn1 = _x[1];
      var _result1 = _fn1();
      if (_result1 !== undefined) {
        return _result1;
      } else {
        var _fn2 = _x[2];
        var _result2 = _fn2();
        if (_result2 !== undefined) {
          return _result2;
        } else {
          var _fn3 = _x[3];
          var _result3 = _fn3();
          if (_result3 !== undefined) {
            return _result3;
          } else {
            var _fn4 = _x[4];
            var _result4 = _fn4();
            if (_result4 !== undefined) {
              return _result4;
            } else {
            }
          }
        }
      }
    }
    ```

- SyncWaterfallHook

  顺序执行，如果返回值不是 undefined, 把返回值赋值给 arg1,如果返回值是 undefined,arg1 不变，arg1 继续传给下一个函数执行

  可以接受多个参数，返回值会赋值给第一个参数，第二个参数保持不变，传给后面的函数

  至少需要一个参数

  - compile

    ```js
    SyncWaterfallHook(["arg111", "arg2"]);

    var _fn0 = _x[0];
    var _result0 = _fn0(arg111, arg2);
    if (_result0 !== undefined) {
      arg111 = _result0;
    }
    var _fn1 = _x[1];
    var _result1 = _fn1(arg111, arg2);
    if (_result1 !== undefined) {
      arg111 = _result1;
    }
    var _fn2 = _x[2];
    var _result2 = _fn2(arg111, arg2);
    if (_result2 !== undefined) {
      arg111 = _result2;
    }
    var _fn3 = _x[3];
    var _result3 = _fn3(arg111, arg2);
    if (_result3 !== undefined) {
      arg111 = _result3;
    }
    var _fn4 = _x[4];
    var _result4 = _fn4(arg111, arg2);
    if (_result4 !== undefined) {
      arg111 = _result4;
    }
    return arg111;
    ```

- SyncLoopHook

  上一个函数返回 undefined 才会执行下一个函数，如果返回值不是 undefined 会从第一个函数开始顺序执行

  - compile

    ```js
    SyncLoopHook(["arg111", "arg2"]);

    var _loop;
    do {
      _loop = false;
      var _fn0 = _x[0];
      var _result0 = _fn0(arg111, arg2);
      if (_result0 !== undefined) {
        _loop = true;
      } else {
        var _fn1 = _x[1];
        var _result1 = _fn1(arg111, arg2);
        if (_result1 !== undefined) {
          _loop = true;
        } else {
          var _fn2 = _x[2];
          var _result2 = _fn2(arg111, arg2);
          if (_result2 !== undefined) {
            _loop = true;
          } else {
            var _fn3 = _x[3];
            var _result3 = _fn3(arg111, arg2);
            if (_result3 !== undefined) {
              _loop = true;
            } else {
              var _fn4 = _x[4];
              var _result4 = _fn4(arg111, arg2);
              if (_result4 !== undefined) {
                _loop = true;
              } else {
                if (!_loop) {
                }
              }
            }
          }
        }
      }
    } while (_loop);
    ```

- AsyncParallelHook

  异步钩子，handler 并行触发

  顺序执行异步函数，如果某个函数有同步代码错误，调用回调函数，停止执行下一个函数

  如果都没有报错，所有函数等待异步完成之后调用回调函数

  tap 函数最后一个参数是一个回调函数，执行该函数，如果传入第一个参数（err）为真，就会忽略后面的监听函数执行，立即调用注册的回调函数

  - compile

    ```js
    const hook = AsyncParallelHook(["arg111", "arg2"]);
    hook.tap("test1", (arg1, arg2) => {
      console.log("test1");
      console.log(arg1, arg2);
      // return arg1 + 1;
      return;
    });
    hook.tapAsync("test3", (arg1, arg2, cb) => {
      setTimeout(() => {
        console.log("test3");
        console.log(arg1, arg2);
        cb(new Error("test3 error"));
      }, 2000);
    });
    hook.tapPromise("test5", (arg1, arg2) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("test5");
          console.log(arg1, arg2);
          console.log(`hello ${arg1}, again`);
          resolve();
        }, 1000);
      });
    });
    hook.callAsync(0, 10, () => {
      console.log("test test");
    });
    // hook
    //   .promise("arg1", "arg2")
    //   .then(() => {
    //     console.log("done");
    //   })
    //   .catch((err) => {
    //     console.log("catch err: ", err.message);
    //   });

    do {
      var _counter = 3;
      var _done = () => {
        _callback();
      };
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasError0 = false;
      try {
        _fn0(arg111, arg2);
      } catch (_err) {
        _hasError0 = true;
        if (_counter > 0) {
          _callback(_err);
          _counter = 0;
        }
      }
      if (!_hasError0) {
        if (--_counter === 0) _done();
      }
      if (_counter <= 0) break;
      var _fn1 = _x[1];
      _fn1(arg111, arg2, (_err1) => {
        if (_err1) {
          if (_counter > 0) {
            _callback(_err1);
            _counter = 0;
          }
        } else {
          if (--_counter === 0) _done();
        }
      });
      if (_counter <= 0) break;
      var _fn2 = _x[2];
      var _hasResult2 = false;
      var _promise2 = _fn2(arg111, arg2);
      if (!_promise2 || !_promise2.then)
        throw new Error(
          "Tap function (tapPromise) did not return promise (returned " +
            _promise2 +
            ")"
        );
      _promise2.then(
        (_result2) => {
          _hasResult2 = true;
          if (--_counter === 0) _done();
        },
        (_err2) => {
          if (_hasResult2) throw _err2;
          if (_counter > 0) {
            _callback(_err2);
            _counter = 0;
          }
        }
      );
    } while (false);
    ```

- AsyncParallelBailHook

  只要监听的函数返回值不为 undefined ,就会忽略后面的监听函数执行， 直接执行 callAsync\promise 绑定的回调函数

  - compile

    ```js
    const hook = AsyncParallelBailHook(["arg111", "arg2"]);
    hook.tap("test1", (arg1, arg2) => {
      console.log("test1");
      console.log(arg1, arg2);
      // return arg1 + 1;
      return;
    });
    hook.tapAsync("test3", (arg1, arg2, cb) => {
      setTimeout(() => {
        console.log("test3");
        console.log(arg1, arg2);
        cb(new Error("test3 error"));
      }, 2000);
    });
    hook.tapPromise("test5", (arg1, arg2) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("test5");
          console.log(arg1, arg2);
          console.log(`hello ${arg1}, again`);
          resolve();
        }, 1000);
      });
    });
    hook.callAsync(0, 10, () => {
      console.log("test test");
    });
    // hook
    //   .promise("arg1", "arg2")
    //   .then(() => {
    //     console.log("done");
    //   })
    //   .catch((err) => {
    //     console.log("catch err: ", err.message);
    //   });

    var _results = new Array(3);
    var _checkDone = () => {
      for (var i = 0; i < _results.length; i++) {
        var item = _results[i];
        if (item === undefined) return false;
        if (item.result !== undefined) {
          _resolve(item.result);
          return true;
        }
        if (item.error) {
          _error(item.error);
          return true;
        }
      }
      return false;
    };
    do {
      var _counter = 3;
      var _done = () => {
        _resolve();
      };
      if (_counter <= 0) break;
      var _fn0 = _x[0];
      var _hasError0 = false;
      try {
        var _result0 = _fn0(arg111, arg2);
      } catch (_err) {
        _hasError0 = true;
        if (_counter > 0) {
          if (
            0 < _results.length &&
            ((_results.length = 1),
            (_results[0] = { error: _err }),
            _checkDone())
          ) {
            _counter = 0;
          } else {
            if (--_counter === 0) _done();
          }
        }
      }
      if (!_hasError0) {
        if (_counter > 0) {
          if (
            0 < _results.length &&
            (_result0 !== undefined && (_results.length = 1),
            (_results[0] = { result: _result0 }),
            _checkDone())
          ) {
            _counter = 0;
          } else {
            if (--_counter === 0) _done();
          }
        }
      }
      if (_counter <= 0) break;
      if (1 >= _results.length) {
        if (--_counter === 0) _done();
      } else {
        var _fn1 = _x[1];
        _fn1(arg111, arg2, (_err1, _result1) => {
          if (_err1) {
            if (_counter > 0) {
              if (
                1 < _results.length &&
                ((_results.length = 2),
                (_results[1] = { error: _err1 }),
                _checkDone())
              ) {
                _counter = 0;
              } else {
                if (--_counter === 0) _done();
              }
            }
          } else {
            if (_counter > 0) {
              if (
                1 < _results.length &&
                (_result1 !== undefined && (_results.length = 2),
                (_results[1] = { result: _result1 }),
                _checkDone())
              ) {
                _counter = 0;
              } else {
                if (--_counter === 0) _done();
              }
            }
          }
        });
      }
      if (_counter <= 0) break;
      if (2 >= _results.length) {
        if (--_counter === 0) _done();
      } else {
        var _fn2 = _x[2];
        var _hasResult2 = false;
        var _promise2 = _fn2(arg111, arg2);
        if (!_promise2 || !_promise2.then)
          throw new Error(
            "Tap function (tapPromise) did not return promise (returned " +
              _promise2 +
              ")"
          );
        _promise2.then(
          (_result2) => {
            _hasResult2 = true;
            if (_counter > 0) {
              if (
                2 < _results.length &&
                (_result2 !== undefined && (_results.length = 3),
                (_results[2] = { result: _result2 }),
                _checkDone())
              ) {
                _counter = 0;
              } else {
                if (--_counter === 0) _done();
              }
            }
          },
          (_err2) => {
            if (_hasResult2) throw _err2;
            if (_counter > 0) {
              if (
                2 < _results.length &&
                ((_results.length = 3),
                (_results[2] = { error: _err2 }),
                _checkDone())
              ) {
                _counter = 0;
              } else {
                if (--_counter === 0) _done();
              }
            }
          }
        );
      }
    } while (false);
    ```

- AsyncSeriesHook

  顺序执行，等待异步返回后执行下一个函数，如果 reject ，直接调用回调，不执行后面函数吗

  - compile

    ```js
    const hook = AsyncParallelBailHook(["arg111", "arg2"]);
    hook.tap("test1", (arg1, arg2) => {
      console.log("test1");
      console.log(arg1, arg2);
      // return arg1 + 1;
      return;
    });
    hook.tapAsync("test3", (arg1, arg2, cb) => {
      setTimeout(() => {
        console.log("test3");
        console.log(arg1, arg2);
        cb(new Error("test3 error"));
      }, 2000);
    });
    hook.tapPromise("test5", (arg1, arg2) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("test5");
          console.log(arg1, arg2);
          console.log(`hello ${arg1}, again`);
          resolve();
        }, 1000);
      });
    });
    hook.callAsync(0, 10, () => {
      console.log("test test");
    });
    // hook
    //   .promise("arg1", "arg2")
    //   .then(() => {
    //     console.log("done");
    //   })
    //   .catch((err) => {
    //     console.log("catch err: ", err.message);
    //   });

    function _next1() {
      var _fn2 = _x[2];
      var _hasResult2 = false;
      var _promise2 = _fn2(arg111, arg2);
      if (!_promise2 || !_promise2.then)
        throw new Error(
          "Tap function (tapPromise) did not return promise (returned " +
            _promise2 +
            ")"
        );
      _promise2.then(
        (_result2) => {
          _hasResult2 = true;
          _resolve();
        },
        (_err2) => {
          if (_hasResult2) throw _err2;
          _error(_err2);
        }
      );
    }
    var _fn0 = _x[0];
    var _hasError0 = false;
    try {
      _fn0(arg111, arg2);
    } catch (_err) {
      _hasError0 = true;
      _error(_err);
    }
    if (!_hasError0) {
      var _fn1 = _x[1];
      _fn1(arg111, arg2, (_err1) => {
        if (_err1) {
          _error(_err1);
        } else {
          _next1();
        }
      });
    }
    ```

- AsyncSeriesBailHook

  顺序执行，等待异步返回，如果返回值不是 undefined, 传入返回值执行注册的回调函数

  - compile

    ```js
    function _next1() {
      var _fn2 = _x[2];
      _fn2(arg111, arg2, (_err2, _result2) => {
        if (_err2) {
          _error(_err2);
        } else {
          if (_result2 !== undefined) {
            _resolve(_result2);
          } else {
            _resolve();
          }
        }
      });
    }
    var _fn0 = _x[0];
    var _hasError0 = false;
    try {
      var _result0 = _fn0(arg111, arg2);
    } catch (_err) {
      _hasError0 = true;
      _error(_err);
    }
    if (!_hasError0) {
      if (_result0 !== undefined) {
        _resolve(_result0);
      } else {
        var _fn1 = _x[1];
        var _hasResult1 = false;
        var _promise1 = _fn1(arg111, arg2);
        if (!_promise1 || !_promise1.then)
          throw new Error(
            "Tap function (tapPromise) did not return promise (returned " +
              _promise1 +
              ")"
          );
        _promise1.then(
          (_result1) => {
            _hasResult1 = true;
            if (_result1 !== undefined) {
              _resolve(_result1);
            } else {
              _next1();
            }
          },
          (_err1) => {
            if (_hasResult1) throw _err1;
            _error(_err1);
          }
        );
      }
    }
    ```

- AsyncSeriesWaterfallHook

  顺序执行，等待异步返回，如果返回值不是 undefined, 作为下一个函数的第一个参数，继续执行，如果是 undefined,上一个函数的第一个参数继续使用

  - compile

    ```js
    function _next1() {
      var _fn2 = _x[2];
      _fn2(arg111, arg2, (_err2, _result2) => {
        if (_err2) {
          _error(_err2);
        } else {
          if (_result2 !== undefined) {
            arg111 = _result2;
          }
          _resolve(arg111);
        }
      });
    }
    var _fn0 = _x[0];
    var _hasError0 = false;
    try {
      var _result0 = _fn0(arg111, arg2);
    } catch (_err) {
      _hasError0 = true;
      _error(_err);
    }
    if (!_hasError0) {
      if (_result0 !== undefined) {
        arg111 = _result0;
      }
      var _fn1 = _x[1];
      var _hasResult1 = false;
      var _promise1 = _fn1(arg111, arg2);
      if (!_promise1 || !_promise1.then)
        throw new Error(
          "Tap function (tapPromise) did not return promise (returned " +
            _promise1 +
            ")"
        );
      _promise1.then(
        (_result1) => {
          _hasResult1 = true;
          if (_result1 !== undefined) {
            arg111 = _result1;
          }
          _next1();
        },
        (_err1) => {
          if (_hasResult1) throw _err1;
          _error(_err1);
        }
      );
    }
    ```

- AsyncSeriesLoopHook

  顺序执行，等待异步返回，如果返回值不是 undefined, 从头执行函数，如果返回值是 undefined，执行下一个函数

  - compile

    ```js
    var _looper = () => {
      var _loopAsync = false;
      var _loop;
      do {
        _loop = false;
        function _next1() {
          var _fn2 = _x[2];
          _fn2(arg111, arg2, (_err2, _result2) => {
            if (_err2) {
              _error(_err2);
            } else {
              if (_result2 !== undefined) {
                _loop = true;
                if (_loopAsync) _looper();
              } else {
                if (!_loop) {
                  _resolve();
                }
              }
            }
          });
        }
        var _fn0 = _x[0];
        var _hasError0 = false;
        try {
          var _result0 = _fn0(arg111, arg2);
        } catch (_err) {
          _hasError0 = true;
          _error(_err);
        }
        if (!_hasError0) {
          if (_result0 !== undefined) {
            _loop = true;
            if (_loopAsync) _looper();
          } else {
            var _fn1 = _x[1];
            var _hasResult1 = false;
            var _promise1 = _fn1(arg111, arg2);
            if (!_promise1 || !_promise1.then)
              throw new Error(
                "Tap function (tapPromise) did not return promise (returned " +
                  _promise1 +
                  ")"
              );
            _promise1.then(
              (_result1) => {
                _hasResult1 = true;
                if (_result1 !== undefined) {
                  _loop = true;
                  if (_loopAsync) _looper();
                } else {
                  _next1();
                }
              },
              (_err1) => {
                if (_hasResult1) throw _err1;
                _error(_err1);
              }
            );
          }
        }
      } while (_loop);
      _loopAsync = true;
    };
    _looper();
    ```

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

- 指纹

  - js
    - hash
    - chunkhash
    - contenthash
  - css
    - hash
    - contenthash
  - file\image
    - hash

- 移动端 CSS `px` 自动装换成 `rem`

  - px2rem-loader
  - lib-flexible: 根据屏幕分辨率自动计算根元素 font-size 大小

- CSS 内联

  - `style-loader`

    ```js
    use: [
      {
        loader: "style-loader",
        options: {
          insertAt: "top", // 样式插入到 head
          singleton: true, // 将所有的 style 标签合并成一个
        },
      },
    ];
    ```

  - `html-inline-css-webpack-plugin`

    > require `mini-css-extract-plugin` and `html-webpack-plugin`

    ```js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin');
    const HtmlWebpackPlugin = require('html-webpack-plugin');
    const HTMLInlineCSSWebpackPlugin = require("html-inline-css-webpack-plugin").default;

    module.exports = {
      module: {
        rules: [
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader"
            ],
          },
        ];
      },
      plugins: [
        new MiniCssExtractPlugin({
          filename: "[name].css",
          chunkFilename: "[id].css"
        }),
        new HtmlWebpackPlugin(),
        new HTMLInlineCSSWebpackPlugin(
          filter?(fileName: string): boolean
          leaveCSSFile?: boolean
          replace?: {
            target: string
            position?: 'before' | 'after'
            removeTarget?: boolean
          }
        ),
      ]
    }

    ```

- html、js 内联（raw-loader)

  ```html
  // meta.html

  <meta charset="UTF-8" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ```

  ```html
  // html-webpack-plugin 默认支持 ejs 语法
  <!DOCTYPE html>
  <html lang="en">
    <head>
      ${ require('raw-loader!./meta.html')}
      <title>Document</title>
      <script>
        ${require('raw-loader!babel-loader!../../node_modules/lib-flexible/flexible.js')}
      </script>
    </head>
    <body></body>
  </html>
  ```

- 多页面应用打包通用方案

  ```js
  const glob = require("glob");

  let entry = {},
    htmlWebpackPlugin = [];

  const setMpa = () => {
    const entryFiles = glob.sync(path.join(__dirname, "./src/*/index.js"));
    entryFiles.forEach((item) => {
      const match = item.match(/src\/(.*)\/index.js/);
      const pageName = match[1];
      entry[pageName] = item;
      htmlWebpackPlugin.push(
        HtmlWebpackPlugin({
          template: path.join(__dirname, "src/" + pageName + "/index.html"),
          filename: pageName + ".html",
          chunks: [pageName],
          injects: true,
          minify: {
            html5: true,
            collapseWhitespace: true,
            preserveLineBreaks: false,
            minifyCSS: true,
            minifyJS: true,
            removeComments: false,
          },
        })
      );
    });
  };

  const { entry, htmlWebpackPlugin } = setMpa();
  module.exports = {
    entry,
    plugin: [].concat(htmlWebpackPlugin),
  };
  ```

- devtool（ source map ）

  - eval: 用 eval 包裹
  - source map: 产生 `.map` 文件
  - cheap: 不包含列信息
  - inline: 将 `.map` 作为 `DataURI` 嵌入，不单独生成 `.map` 文件
  - module: 包含 loader 的 source map

- eslint-loader
- webpack 打包库和组件
- SSR
- 优化命令行显示日志

  - stat: errors-only
  - friendly-errors-webpack-plugin

- 构建异常和中断处理

  - node 中的 process.exit 规范

    - 0 表示成功完成，回调函数中 err 为 null
    - 非 0 表示执行失败，回调函数中 err 不为 null, err.code 就是传给 exit 的值

  - webpack 中主动捕获并处理构建错误

    ```js
    plugin: [
      function () {
        this.hooks.done.tap("done", (stat) => {
          if (
            stat.compilation.errors &&
            stat.compilation.errors.length &&
            process.argv.indexOf("--watch") == -1
          ) {
            console.log("build error");
            process.exit(1);
          }
        });
      },
    ];
    ```

- 优化

  - 打包优化

    - runtimechunk

      ```js
        optimization: {
          runtimeChunk: 'single',
        }
      ```

    - 基础库分离

      > 将 `react`、`reactDOM` 基础包通过 `CDN` 引入，不打入 bundle

      - 使用 SplitChunkPlugin

        ```js
          optimization: {
            splitChunks: {
              maxAsyncRequests: 5,
              maxInitialRequests: 3,
              cacheGroups: {
                vender: {
                  // test(module, chunks) {return true/false},
                  test: /[\\/]node_modules[\\/]/,
                  name: 'venders',
                  chunks: 'all',  // all, async, initial
                },
                commons: {
                  minSize: 30000,
                  minChunks: 2,
                  reuseExistingChunk: true
                  name: 'commons'，
                  // name(module, chunks, cacheGroupKey) {return ``}
                }
              }
            }
          }
        ```

      - 使用 html-webpack-externals-plugin

        ```js
        plugins: [
          new HtmlWebpackExternalsPlugin({
            externals: [
              {
                module: "react",
                entry: "//unpkg.com/react@16/umd/react.production.min.js",
                global: "React",
              },
              {
                module: "react-dom",
                entry:
                  "//unpkg.com/react-dom@16/umd/react-dom.production.min.js",
                global: "ReactDOM",
              },
            ],
          }),
        ];
        ```

    - Tree Shaking (不能有副作用)

      - js

        > 如果所有的模块没有副作用，可以在 `package.json` 中设置如下, 以通知 webpack 它可以安全地 `Tree sharking`:

        ```js
          {
            "name": 'your-project',
            "sideEffects": false
          }
        ```

        > 如果代码中有副作用，可以在 `package.json` 中设置如下：

        ```js
          {
            "name": "your-project",
            "sideEffects": [
              "./src/some-side-effectful-file.js"
            ]
          }
        ```

        - uglifyjs-webpack-plugin: 开启 parallel 参数（不支持 es6）（配置 mode=production 即可）
        - terser-webpack-plugin: 开启 parallel 参数（支持 es6）

      - 删除无用的 CSS
        - PurifyCSS
          > 使用 `purgecss-webpack-plugin` 配合 `mini-css-extract-plugin` 使用
        - uncss

    - Scope Hoisting

      - 导致的问题
        - 大量函数闭包包裹代码，体积增大
        - 运行代码时创建的函数作用域变多，内存开销增大
      - 原理
        - 将所有函数的代码按照引用顺序放在一个函数作用域中，然后适当的重命名一些变量防止变量命名冲突

  - 速度分析: speed-measure-webpack-plugin
  - 体积分析: webpack-bundle-analyzer
  - 多进程、多实例构建

    - webpack v3: `happypack`
    - webpack v4: `thread-loader`(Runs the following loaders in a worker pool)

      > 每次 webpack 解析一个模块，thread-loader 会将它及他的依赖分配给一个 work 进程，达到多进程构建的目的  
      > 每个工作程序都是一个单独的 node.js 进程

      ```js
      use: [
        {
          loader: "thread_loader",
          options: {
            workers: 2,
            workerParallelJobs: 50,
            workerNodeArgs: ["--max-old-space-size=1024"],
            poolRespawn: false,
            poolTimeout: 2000,
            poolParallelJobs: 50,
            name: "my-pool",
          },
        },
        // your expensive loader (e.g babel-loader)
      ];
      ```

      - prewarming

        > 这将引导池中的最大 workers 数量，并将指定的模块加载到 node.js 模块高速缓存中。

        ```js
        const threadLoader = require("thread-loader");

        threadLoader.warmup(
          {
            // pool options, like passed to loader options
            // must match loader options to boot the correct pool
          },
          [
            // modules to load
            // can be any module, i. e.
            "babel-loader",
            "babel-preset-es2015",
            "sass-loader",
          ]
        );
        ```

    - 并行压缩
      - uglifyjs-webpack-plugin: 开启 parallel 参数（不支持 es6）
      - terser-webpack-plugin: 开启 parallel 参数（支持 es6）
        ```js
        module.exports = {
          optimization: {
            minimize: true,
            minimizer: [
              new TerserPlugin({
                // parallel: 4,
                parallel: true, // Use multi-process parallel running to improve the build speed. Default number of concurrent runs: os.cpus().length - 1.
              }),
            ],
          },
        };
        ```

  - 分包
    - DLLPlugin
  - 缓存

    - babel-loader
      ```js
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
                plugins: ["@babel/plugin-proposal-object-rest-spread"],
                cacheDirectory: true, // the loader will use the default cache directory in `node_modules/.cache/babel-loader` or fallback to the default OS temporary file directory if no node_modules folder could be found in any `root directory`.
              },
            },
          },
        ];
      }
      ```
    - terser-webpack-plugin

      ```js
      const TerserPlugin = require("terser-webpack-plugin");
      module.exports = {
        optimization: {
          minimize: true,
          minimizer: [
            new TerserPlugin({
              test: /\.js(\?.*)?$/i,
              // cache: "path/to/cache",
              cache: true, // Default path to cache directory: `node_modules/.cache/terser-webpack-plugin`.
              chunkFilter: (chunk) => {
                // Exclude uglification for the `vendor` chunk
                if (chunk.name === "vendor") {
                  return false;
                }

                return true;
              },
            }),
          ],
        },
      };
      ```

    - cache-loader 或者 hard-source-webpack-plugin

      ```js
      module.exports = {
        module: {
          rules: [
            {
              test: /\.js$/,
              use: [
                {
                  loader: "cache-loader",
                  options: {
                    cacheKey,
                    read,
                    write,
                  },
                },
                "babel-loader",
              ],
              include: path.resolve("src"),
            },
          ],
        },
      };
      ```

  - 缩小构建目标

    - exclude: /node_moudles/

  - 图片压缩
    - Imagemin -> image-webpack-loader
  - 动态 polyfill

    - babel-polyfill
    - babel-plugin-transform-runtime
    - 自己写的 polyfill
    - polyfill-service: 只给用户返回需要的 polyfill

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

## Webpack v5.0.0

entry-option(初始化 option ) -> run(开始编译)-> make(从 entry 开始递归分析依赖，对每个依赖模块进行 build) -> before-resolve（对模块位置进行解析） -> build-module（开始构建某个模块） -> normal-module-loader（将 loader 加载完成的 module 进行编译，生成 AST） -> program（遍历 AST，当遇到 require 等一些调用表达式，收集依赖） -> seal（所有依赖 build 完毕，开始优化） -> emit（输出到 dist 目录）

- 初始化阶段
  - 初始化 option
- 编译阶段

  - compiler.run() 开始编译
  - 遍历入口模块
  - 创建 module， 添加到 modules 队列
  - 解析模块路径（入口模块是绝对路径，依赖是相对路径，需要解析为绝对路径）
  - 通过匹配的 loader 加载模块
  - 通过 babylon 解析为 AST
  - 通过 babel-traverse 遍历 AST， 找到模块依赖， 添加到模块依赖
  - 遍历每个依赖，进行递归构建
  - (seal)所有依赖构建完毕， 开始优化

    > EntryPlugin 会勾住 mark 阶段， 调用 compilation.addEntry 添加入口， 构建阶段正式开始

    ```js
    compiler.run
    => this.cache.endIdle
    => this.hooks.beforeRun  /*清理上次构建缓存*/
    => this.hooks.run
    => this.compile /*会通过 NormalModuleFactory、 ContextModuleFactory 工厂实例化module*/
    => this.hooks.beforeCompile
    => this.hooks.compile
    => 创建compilation对象
    => this.hooks.make
    => compilation.addEntry
    => `
      let entryData = this.entries.get(name)
      if(entryData === undefined) {
        entryData = {
          dependencies: [entry],
          options: {
            name: undefined,
            ...options
          }
        }
      } else {
        entryData.dependencies.push(entry);
      }

    `
    =>
    this.hooks.addEntry.call
    this.addModuleChain
    => this.handleModuleCreation
    => this.addModule
    => this.addModuleQueue.add
    =>
    `
      this.modules = new Set()
      this._modules = new Map();
      const alreadyAddedModule = this._modules.get(identifier);
      if(alreadyAddedModule) {
        callback(null, alreadyAddedModule)
      }
      this.cache.get(cacheName, () => {
        this._modules.set(identifier, module)
        this.modules.add(module)

        callback(); // 调用 this.buildModule
      })

    `
    => this.buildModule
    => module.bulid
    => this.doBuild
    => `调用 loader 对内容进行转换` (`loader-runner` 的 runLoaders)
    => processResult
    =>
    `
      createSource(context, content, sourceMap, associatedObjectForCache) {
        if(Buffer.isBuffer(content)) {
          return new RawSource(content);
        }
        if(!this.identifier) {
          return new RawSource(content);
        }

        const identifier = this.identifier();

        if(this.useSourceMap && sourceMap) {
          return new SourceMapSource(
            content,
            contextifySourceUrl(context, identifier, associatedObjectCache),
            contextifySourceMap(context, sourceMap, associatedObjectCache),
          )
        }

        return new OriginalSource(
          context,
          contextifySourceUrl(context, identifier, associatedObjectForCache)
        )
      }
    `
    `
      this._source = this.createSource(
        option.context,
        this.binary? asBuffer(source): asString(source),
        sourceMap,
        compilation.compiler.root
      )
    `
    =>
    `
      const { Parser: AcornParser } = require("acorn");
      const parser = AcornParser.extend(require("../parsing/importAwaitAcornPlugin"));
      class JavascriptParser extends Parser {
        parser(source, state){
          ast = JavascriptParser.parse(source, {
            sourceType: this.sourceType,
            onComment: comments,
            onInsertedSemicolon: pos => semicolons.add(pos)
          })
        }

        static parse(code, options) {
          let ast;
          let error;
          let threw = false
          try {
            ast = parser.parse(code, parserOptions);
          } catch(e) {
            error = e;
            threw = true
          }
          return ast;
        }

      }
    `
    this.parser.parse(this._ast || this._source.source())
    // => 对依赖模块进行构建
    => module.build callback
    => this.buildModule callback
    =>
    `
    processModuleDependencies(module, callback) {
      const dependencies = new Map();
      const sortedDependencies = [];
    }
    `
    => handleModuleCreation callback
    => this.hooks.finishModules /* 得到经过 loaders 处理后的源码 */
    => compilation.finish
    => compilation.seal // 优化阶段
    => this.clearAssets
    => this.createModuleAssets
    => for(let module of this.modules)
    => this.emitAsset
    => this.assets[file] =  source;
    // => this.hooks.afterCompiler
    => 输出到磁盘
    ```

- 输出阶段

- Compiler 整个构建流程
- Compilation 负责模块构建、优化

* webpack module
  - NormalModule
    - require('react-dom')
    - 通过 loader-runner 运行 loaders
    - 通过 parser 解析为 AST（内部是 acron）
    - ParserPlugins 添加依赖（分析 ImportDeclaration ）
  - ContextModule
    - require('./src/a')
    - require('./src/b')
  - ExternalModule
    - module.exports = jQuery
  - DelegatedModule
    - manifest
  - MultiModule
    - entry: ['a', 'b']
