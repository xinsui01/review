# [前端模块化](https://juejin.im/post/5c17ad756fb9a049ff4e0a62)

## 模块化

- 什么是模块？

  - 将一个复杂的程序依据一定的规则(规范)封装成几个块(文件), 然后组合在一起
  - 块的内部数据与实现是私有的, 只是向外部暴露一些接口(方法)与外部其它模块通信

- 模块化的进化过程

  - 全局 Function 模式

    > 将不同的功能封装成不同的全局函数

    - 问题: 污染全局命名空间, 容易引起命名冲突或数据不安全，而且模块成员之间看不出直接关系

      ```js
      function m1() {
        //...
      }
      function m2() {
        //...
      }
      ```

  - namespace 模式

    > 简单对象封装

    - 作用: 减少了全局变量，解决命名冲突
    - 问题: 会暴露所有模块成员，内部状态可以被外部改写。

      ```js
      let myModule = {
        data: 'www.baidu.com',
        foo() {
          console.log(`foo() ${this.data}`);
        },
        bar() {
          console.log(`bar() ${this.data}`);
        }
      };

      myModule.data = 'other data'; // 能直接修改模块内部的数据
      myModule.foo(); // foo() other data
      ```

  - IIFE 模式

    > 匿名函数自调用(闭包)

    - 数据是私有的, 外部只能通过暴露的方法操作
    - 问题: 模块依赖?

    ```js
    (function(window) {
      let data = 'www.baidu.com';

      function foo() {
        // 操作数据的函数
        console.log(`foo() ${data}`);
      }

      function bar() {
        console.log(`bar() ${data}`);
        otherFn(); // 内部函数调用
      }

      function otherFn() {
        // 内部私有函数
        console.log('otherFun()');
      }

      window.myModule = { foo, bar };
    })(window);
    ```

    ```html
    <script type="text/javascript" src="module.js"></script>
    <script type="text/javascript">
      myModule.foo(); // foo() www.baidu.com
      myModule.bar(); // bar() www.baidu.com
      console.log(myModule.data); // undefined 不能访问模块内部数据
      myModule.data = 'xxxx'; // 不是修改的模块内部的data
      myModule.foo(); // foo() www.baidu.com
    </script>
    ```

  - IIFE 模式增强: 引入依赖

    > 现代模块实现的基石  
    > 除了保证模块的独立性，还使得模块之间的依赖关系变得明显。

    ```js
    (function(window, $) {
      let data = 'www.baidu.com';

      function foo() {
        console.log(`foo() ${data}`);
        $('body').css('background', 'red');
      }

      function bar() {
        //用于暴露私有函数
        console.log(`bar() ${data}`);
        otherFun(); //内部调用
      }

      function otherFun() {
        //内部私有的函数
        console.log('otherFun()');
      }

      //暴露行为
      window.myModule = { foo, bar };
    })(window, jQuery);
    ```

    ```html
    <script type="text/javascript" src="jquery-1.10.1.js"></script>
    <script type="text/javascript" src="module.js"></script>
    <script type="text/javascript">
      myModule.foo();
    </script>
    ```

- 模块化的好处

  - 避免命名冲突(减少命名空间污染)
  - 更好的分离, 按需加载
  - 更高复用性
  - 高可维护性

- 引入多个 `<script>` 后出现出现问题
  - 请求过多
  - 依赖模糊
    > 不知道他们的具体依赖关系，容易因为不了解他们之间的依赖关系导致加载先后顺序出错。
  - 难以维护
    > 以上两种原因就导致了很难维护，模块化固然有多个好处，然而一个页面需要引入多个 js 文件，就会出现以上这些问题。而这些问题可以通过模块化规范来解决。

## 模块化规范

- CommonJS

  - 在服务器端，模块的加载是运行时同步加载的；在浏览器端，模块需要提前编译打包处理。

  - 特点

    - 所有代码都运行在模块作用域，不会污染全局作用域。
    - 模块可以多次加载，但是只会在第一次加载时运行一次，然后运行结果就被缓存了，以后再加载，就直接读取缓存结果。要想让模块再次运行，必须清除缓存。
    - 模块加载的顺序，按照其在代码中出现的顺序。

  - 基本语法

    - 暴露模块：`module.exports = value` 或 `exports.xxx = value`
    - 引入模块：`require(xxx)`
    - CommonJS 暴露的模块到底是什么?

      CommonJS 会将模块代码进行包装，变成如下的样子：

      ```js
        function (exports, require, module, __filename, __dirname) {
          const m = 1;
          module.exports.m = m;
        }
      ```

      CommonJS 规范规定，每个模块内部，module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

      require 命令用于加载模块文件。require 命令的基本功能是，读入并执行一个 JavaScript 文件，然后返回该模块的 exports 对象。如果没有发现指定模块，会报错。

      ```js
      // CommonJS模块
      let { stat, exists, readFile } = require('fs');

      // 等同于
      let _fs = require('fs');
      let stat = _fs.stat;
      let exists = _fs.exists;
      let readfile = _fs.readfile;
      ```

      > 上面代码的实质是 **整体加载** fs 模块（即加载 fs 的所有方法），生成一个对象（`_fs`），然后再从这个对象上面读取 3 个方法。这种加载称为“ **运行时加载** ”，因为只有运行时才能得到这个对象，导致完全 **没办法在编译时做“静态优化”** 。

- 模块的加载机制

  > 输入的是被输出的值(基本类型)的拷贝。也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。这点与 ES6 模块化有重大差异

  ```js
  // lib.js
  var counter = 3;
  function incCounter() {
    counter++;
  }
  module.exports = {
    counter: counter,
    incCounter: incCounter
  };
  ```

  ```js
  // main.js
  var counter = require('./lib').counter;
  var incCounter = require('./lib').incCounter;

  console.log(counter); // 3
  incCounter();
  console.log(counter); // 3
  ```

- ES Module

  > ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

  - 语法

    > export 关键字用于规定模块的对外接口，import 关键字用于输入其他模块提供的功能。

    ```js
    /** 定义模块 math.js **/
    export const basicNum = 0;
    const add = function(a, b) {
      return a + b;
    };

    export default add;

    /** 引用模块 **/
    import add, { basicNum } from './math';
    function test(ele) {
      ele.textContent = add(99 + basicNum);
    }
    ```

    如上例所示，使用 import 命令的时候，用户需要知道所要加载的变量名或函数名，否则无法加载。为了给用户提供方便，让他们不用阅读文档就能加载模块，就要用到 export default 命令，为模块指定默认输出。

## [ES6 模块与 CommonJS 模块的差异](http://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

  > CommonJS 加载的是一个对象（即 module.exports 属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

  > ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入。

  ```js
  // ES6模块
  import { stat, exists, readFile } from 'fs';
  ```

  > 上面代码的实质是从 fs 模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

## 总结

- CommonJS 服务器端和浏览器端都可以用，服务器端是动态同步加载模块的，浏览器端需要先编译打包所有用到的模块
- AMD 和 CMD 都专供浏览器端，动态异步加载模块
- ES6 服务器端和浏览器端都可以用，但都需要先编译打包所有用到的模块。
