# JavaScript

## var, let 区别

- 顶级作用域 var 声明变量是 window 的属性，let\const 声明变量不是 window 的属性，变量都可以在控制台访问。
- let 声明的变量拥有块级作用域，不存在变量提升
- 暂时性死区

  只要块级作用域内存在 let 命令，它所声明的变量就“绑定”（binding）这个区域，不再受外部的影响。

  ```
    var tmp = 123;

    if (true) {
      tmp = 'abc'; // ReferenceError
      let tmp;
    }
  ```

- 不允许重复声明

## 箭头函数

> 没有自己的 `this`，`arguments`，`super` 或 `new.target`。不能用作构造函数。

- 箭头函数不会创建自己的 this，它只会从自己的作用域链的上一层继承 this

  在箭头函数出现之前，每个新定义的函数都有它自己的 this 值（在构造函数的情况下是一个新对象，在严格模式的函数调用中为 undefined，如果该函数被作为“对象方法”调用则为基础对象等）

  > 由于 箭头函数没有自己的 this 指针，通过 call() 或 apply() 方法调用一个函数时，只能传递参数（不能绑定 this---译者注），他们的第一个参数会被忽略。

- 箭头函数不绑定 Arguments 对象。
- 箭头函数不能用作构造器，和 new 一起用会抛出错误。
- **箭头函数没有 prototype 属性。**

## fetch 取消

- [AbortController](https://developer.mozilla.org/zh-CN/docs/Web/API/FetchController)

  > AbortController 接口代表一个控制器对象，允许你在需要时终止一个或多个 DOM 请求。

- [Abortable fetch](https://developers.google.com/web/updates/2017/09/abortable-fetch)

  ```js
    const controller = new AbortController();
    const signal = controller.signal;

    const downloadBtn = document.querySelector('.download');
    const abortBtn = document.querySelector('.abort');

    downloadBtn.addEventListener('click', fetchVideo);
    abortBtn.addEventListener('click', function() {
      controller.abort();
      console.log('Download aborted!');
    })

    function fetchVideo() {
      ...
      fetch(url, {signal}).then(function（res){
        ...
      }).catch(function(err){
        if (err.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Uh oh, an error!', err);
        }
      })
    }
  ```

  > 当 `abort()` 被调用， `fetch()` promise rejects 一个 `AbortError`。

## symbol

- Symbol()

  Symbol 函数可以接受一个字符串作为参数，表示对 Symbol 实例的描述，主要是为了在控制台显示，或者转为字符串时，比较容易区分。

- Symbol.for()

  接受一个字符串作为参数，然后搜索有没有以该参数作为名称的 Symbol 值。如果有，就返回这个 Symbol 值，否则就新建并返回一个以该字符串为名称的 Symbol 值。

  Symbol.for()与 Symbol()这两种写法，都会生成新的 Symbol。它们的区别是，前者会被登记在全局环境中供搜索，后者不会。

- Symbol.keyFor()

  Symbol.keyFor 方法返回一个已登记的 Symbol 类型值的 key。

  <iframe src="http://es6.ruanyifeng.com/#docs/symbol" width="100%" frameborder="0" height="500px" ></iframe>

## JS 继承

- 原型链：本质是重写原型对象

  - 实现

    ```js
    function SuperType() {
      this.property = true;
    }

    SuperType.prototype.getSuperValue = function() {
      return this.property;
    };

    function SubType() {
      this.subProperty = false;
    }

    // 继承了 SuperType
    SubType.prototype = new SuperType();

    SubType.prototype.constructor = SubType;

    SubType.prototype.getSubValue = function() {
      return this.subProperty;
    };

    var inst = new SubType();
    alert(inst.getSuperValue());
    ```

  - 确定原型和实例关系
    1. `instanceof`
    2. `isPrototypeOf()`
  - 问题

    1. 包含引用类型值的原型

       ```js
       function SuperType() {
         this.colors = ['red', 'blue', 'green'];
       }

       function SubType() {}

       // 继承了 SuperType
       SubType.prototype = new SuperType();
       var inst1 = new SubType();
       inst1.colors.push('black');
       console.log(inst1.colors); // 'red', 'blue', 'green', 'black'

       var inst2 = new SubType();
       console.log(inst2.colors); // 'red', 'blue', 'green', 'black'
       ```

    2. 在创建子类型实例的时候，不能向超类型的构造函数中传递参数。

- 借用构造函数

  > 解决了原型中包含引用类型值所带来的问题

  > 子类构造函数中向超类构造函数传递参数

  - 实现

    ```js
    function SuperType(name) {
      this.name = name;
      this.colors = ['red', 'blue', 'green'];
    }

    function SubType(name, age) {
      // 继承了 SuperType, 同时还传递了参数
      SuperType.call(this, name);
      // 实例属性
      this.age = age;
    }

    var inst1 = new SubType('Nicholas', 29);
    inst1.colors.push('black');
    console.log(inst1.colors); // 'red', 'blue', 'green', 'black'

    var inst2 = new SubType('Jerry', 27);
    console.log(inst2.colors); // 'red', 'blue', 'green'
    ```

  - 问题
    1. 方法都在构造函数中定义，函数复用无从谈起。
    2. 超类原型中定义的方法，子类不可见。

- 组合继承

  > 将`原型链` 和 `借用构造函数` 结合到一起

  - 实现

    ```js
    function SuperType(name) {
      this.name = name;
      this.colors = ['red', 'blue', 'green'];
    }

    SuperType.prototype.sayName = function() {
      console.log(this.name);
    };

    function SubType(name, age) {
      // 继承 SuperType 实例属性并传递参数
      SuperType.call(this, name);

      this.age = age;
    }

    // 继承方法
    SubType.prototype = new SuperType();
    // 修复构造函数
    SubType.prototype.constructor = SubType;
    SubType.prototype.sayAge = function() {
      console.log(this.age);
    };

    var inst1 = new SubType('Nicholas', 29);
    inst1.colors.push('black');
    console.log(inst1.colors); // 'red', 'blue', 'green', 'black'
    inst1.sayName();
    inst1.sayAge();

    var inst2 = new SubType('Jerry', 27);
    console.log(inst2.colors); // 'red', 'blue', 'green'
    inst2.sayName();
    inst2.sayAge();
    ```

  - 问题

    1. 组合继承无论什么情况下，都会`调用两次超类构造函数`：

       - `一次是在创建子类原型的时候`
       - `另一次是在子类构造函数内部调用超类构造函数。`

- 原型式继承

  > `Object.create()`规范化了原型式继承

  - `Object.create(proto, [propertiesObject])`

    `Object.create()` 方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`。

    - proto

      新创建对象的原型对象。

    - propertiesObject

      可选。如果没有指定为 undefined，则是要添加到新创建对象的可枚举属性（即其自身定义的属性，而不是其原型链上的枚举属性）对象的属性描述符以及相应的属性名称。这些属性对应 `Object.defineProperties()` 的第二个参数。

    - 实现

      ```js
      if (typeof Object.create !== 'function') {
        Object.create = function(proto, propertiesObject) {
          if (typeof proto !== 'object' && typeof proto !== 'function') {
            throw new TypeError('Object prototype may only be an Object: ' + proto);
          } else if (proto === null) {
            throw new Error(
              "This browser's implementation of Object.create is a shim and doesn't support 'null' as the first argument."
            );
          }

          if (typeof propertiesObject != 'undefined')
            throw new Error(
              "This browser's implementation of Object.create is a shim and doesn't support a second argument."
            );

          function F() {}
          F.prototype = proto;

          return new F();
        };
      }
      ```

  - 问题

    在没有必要兴师动众的创建构造函数，而只是想让一个对象与另一个对象保持类似的情况下，原型式继承是完全可以胜任的。但是，**包含引用类型值的属性始终都会共享相应的值。**

- 寄生式继承

  > 创建一个仅用于封装继承过程的函数，该函数在内部以某种方式来增强对象。

  - 实现

    ```js
    function createAnother(original) {
      // 通过调用函数创建一个新对象
      var clone = Object.create(original);
      // 以某种方式来增强新对象
      clone.sayHi = function() {
        console.log('Hi');
      };
      return clone;
    }

    var person = {
      name: 'Nicholas',
      friends: ['red', 'blue', 'green']
    };
    var anotherPerson = createAnother(person);
    anotherPerson.sayHi();
    ```

  - 问题

    1. 不能做到函数复用而降低效率

- 寄生组合式继承

  > 组合继承无论什么情况下，都会`调用两次超类构造函数`：

  > `一次是在创建子类原型的时候`  
  > `另一次是在子类构造函数内部调用超类构造函数。`

  ```js
  // 组合继承🌰

  function SuperType(name) {
    this.name = name
    this.colors = ['red', 'blue', 'green']
  }

  SuperType.prototype.sayName = function() {
    console.log(this.name)
  }

  function SubType(name, age) {
    SuperType.call(this, name) // 第二次调用 SuperType()

    this.age = age
  }

  SubType.prototype = new SuperType() // 第一次调用 SuperType()
  SubType.prototype.constructor = SubType
  SubType.prototype.sayAge = funciton() {
    console.log(this.age)
  }
  ```

  > 第一次调用在原型上有两个属性 `name` 和 `colors`  
  > 调用子类构造函数的时候，又会调用超类构造函数，又会在新对象上创建实例属性 `name` 和 `colors`，于是原型链上的两个同名属性就被屏蔽了

  - 实现

    ```js
    function inheritPrototype(subType, superType) {
      var prototype = Object.create(superType.prototype); // 创建对象
      prototype.constructor = subType; // 增强对象
      subType.protototype = prototype; // 指定对象
    }
    ```

    ```js
    function SuperType(name) {
      this.name = name;
      this.colors = ['red', 'blue', 'green'];
    }

    SuperType.prototype.sayName = function() {
      console.log(this.name);
    };

    function SubType(name, age) {
      SuperType.call(this, name); // 第二次调用 SuperType()

      this.age = age;
    }

    inheritPrototype(SubType, SuperType);
    SubType.prototype.sayAge = function() {
      console.log(this.age);
    };
    ```

  - 引用类型最理想的继承范式

## Class 的继承

<iframe src="http://es6.ruanyifeng.com/#docs/class-extends#%E7%B1%BB%E7%9A%84-prototype-%E5%B1%9E%E6%80%A7%E5%92%8C__proto__%E5%B1%9E%E6%80%A7" width="100%" frameborder="0" height="500px" ></iframe>

```js
class A {}

class B extends A {}

B.__proto__ === A; // 静态方法
B.prototype.__proto__ === A.prototype; // 原型继承
```

## instanceof

> `instanceof` 运算符用于测试构造函数的 `prototype` 属性是否出现在对象的原型链中的任何位置.  
> 如果左操作数不是对象，则返回 false,如果右操作数不是函数，则抛出 typeError.

- 实现原理

  instanceof 主要的实现原理就是只要右边变量的 prototype 在左边变量的原型链上即可

  ```js
  function new_instance_of(leftVaule, rightVaule) {
    let rightProto = rightVaule.prototype; // 取右表达式的 prototype 值
    leftVaule = leftVaule.__proto__; // 取左表达式的__proto__值
    while (true) {
      if (leftVaule === null) {
        return false;
      }
      if (leftVaule === rightProto) {
        return true;
      }
      leftVaule = leftVaule.__proto__;
    }
  }
  ```

- 几个有趣的例子

  ```js
  Function instanceof Function; // true
  Object instanceof Function; // Object 本身是一个函数，由 Function 所创建，所以 `Object.__proto__` 的值是 `Function.prototype`
  Object instanceof Object; // `Function.prototype` 的 `__proto__` 属性是 `Object.prototype`
  Function instanceof Object; // Function.__proto__ === Function.prototype, Function.prototype 是由 Object 所创建，所以 Function.prototype.__proto__ === Object.prototype
  ```

  ![原型继承的原理图](https://user-gold-cdn.xitu.io/2018/5/28/163a55d5d35b866d?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## typeof

typeof 在判断一个 object 的数据的时候只能告诉我们这个数据是 object, 而不能细致的具体到是哪一种 object

最好是用 typeof 来判断基本数据类型（包括 symbol）和 function，避免对 null 的判断。

```js
typeof undefined; // "undefined"
typeof true; // "boolean"
typeof function() {}; // "function"
typeof {}; // "object"
typeof []; // "object"
typeof null; // "object"
typeof new String('abc'); // "object"
typeof new Date(); // "object"
```

**还有一个不错的判断类型的方法，就是 Object.prototype.toString**

```js
Object.prototype.toString.call(1); // "[object Number]"
Object.prototype.toString.call('hi'); // "[object String]"
Object.prototype.toString.call({ a: 'hi' }); // "[object Object]"
Object.prototype.toString.call([1, 'a']); // "[object Array]"
Object.prototype.toString.call(true); // "[object Boolean]"
Object.prototype.toString.call(() => {}); // "[object Function]"
Object.prototype.toString.call(null); // "[object Null]"
Object.prototype.toString.call(undefined); // "[object Undefined]"
Object.prototype.toString.call(Symbol(1)); // "[object Symbol]"
```

```js
let class2Type = {};
[('Array', 'Date', 'RegExp', 'Error', 'Object')].forEach(type => (class2Type[`[object ${type}]`] = type.toLowerCase()));

function type(obj) {
  if (obj === null) return String(null);
  return typeof obj === 'object' ? class2Type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
}
```

## [typeof 和 instanceOf 的区别](https://segmentfault.com/a/1190000000730982)

> 只有字面量形式的 `string`、 `number`、 `boolean`、 `undefined`、`function` 才能分辨出来，其他都为 `object`

| Value              | Class     | Type                          |
| :----------------- | :-------- | :---------------------------- |
| "foo"              | String    | string                        |
| new String("foo")  | String    | object                        |
| 1.2                | Number    | number                        |
| new Number(1.2)    | Number    | object                        |
| true               | Boolean   | boolean                       |
| new Boolean(true)  | Boolean   | object                        |
| new Date()         | Date      | object                        |
| new Error()        | Error     | object                        |
| [1,2,3]            | Array     | object                        |
| new Array(1, 2, 3) | Array     | object                        |
| new Function("")   | Function  | function                      |
| /abc/g             | RegExp    | object (function in Nitro/V8) |
| new RegExp("meow") | RegExp    | object (function in Nitro/V8) |
| {}                 | Object    | object                        |
| new Object()       | Object    | object                        |
| null               | Null      | object                        |
| undefined          | Undefined | undefined                     |

> Class 一列表示对象的内部属性 `[[Class]]` 的值。  
> 为了获取对象的 `[[Class]]`，我们需要使用 `Object.prototype.toString`。

## [正则](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

![正则表达式中特殊字符的含义](../imgs/RegExp.png)

- 标识符：
  - g: 全局
  - i: 忽略大小写
  - m: 多行模式， 在到达一行文本末尾时还会继续查找下一行中是否存在与模式匹配的项。
- 元字符：
  - `([{\^$|}?*+.])`
  - 所有的元字符都必须经过转义
- 使用 `RegExp` 构造函数

  - **由于 `RegExp` 构造函数的模式参数是个字符串，所以在某些情况下要对字符串进行双重转义**

    | 字面量模式         | 等价的字符串          |
    | :----------------- | :-------------------- |
    | `/\[bc\]at/`       | `\\[bc\\]at`          |
    | `/\.at/`           | `\\.at`               |
    | `/name\/age/`      | `name\\/age`          |
    | `/\d.\d{1,2}/`     | `\\d.\\d{1,2}`        |
    | `/\w\\hello\\123/` | `\\w\\\\hello\\\\123` |

- ES5 明确规定，使用正则表达式字面量必须像直接调用 `RegExp` 构造函数一样，每次都创建新的 `RegExp` 实例。
- 实例属性
  - global
  - ignoreCase
  - multiline
  - source: 正则表达式的字符串表示，按照**字面量形式**而非传入构造函数的字符串模式
  - lastIndex: 开始搜索下一个匹配项的字符位置，起始 0
- 实例方法

  - exec(): 专门为捕获组而设计，返回包含第一个匹配项信息的数组，没有匹配项返回 null
    - 返回数组属性
      - 第一项是与整个模式匹配的字符串
      - 其他项是与模式中的捕获组匹配的字符串
      - index: 匹配项在字符串中的位置
      - input: 应用正则表达式的字符串
    - 模式中设置了 `g` 标志,每次也只返回一个匹配项
      - 同一个字符串多次调用 `exec()`,每次调用都会在字符串中继续查找新的匹配项
  - test(): 是否匹配
  - toLocaleString(): 返回正则表达式字面量
  - toString(): 返回正则表达式字面量

- 构造函数属性

  | 长属性名      | 短属性名                                                         | 说明                                   |
  | :------------ | :--------------------------------------------------------------- | :------------------------------------- |
  | input         | \$\_                                                             | 最近一次要匹配的字符串                 |
  | lastMatch     | \$&                                                              | 最近一次匹配项                         |
  | lastParen     | \$+                                                              | 最近一次匹配的捕获组                   |
  | leftContext   | \$` | input 字符串中 lastMatch 之前的文本                        |
  | rightContext  | \$'                                                              | input 字符串中 lastMatch 之后的文本    |
  | multiline     | \$\*                                                             | 布尔值，是否所有的表达式都使用多行模式 |
  | $1,$2,...,\$9 | 存储第一到第九个捕获组，调用 exec()或 test()时，这些属性自动填充 |                                        |
  |               |                                                                  |                                        |

- [正则 test、exec 与 String.prototype.match](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

  - test 匹配与否，返回 Boolean
  - match、exec

    - 如果使用 g 标志，则将返回与完整正则表达式匹配的所有结果，但是不会返回捕获组，未匹配返回 null

      ```js
      const str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
      var regexp = /[A-E]/gi;
      var matches_array = str.match(regexp);

      console.log(matches_array);
      // ['A', 'B', 'C', 'D', 'E', 'a', 'b', 'c', 'd', 'e']
      ```

    - 如果未使用 g 标志，则仅返回第一个完整匹配及其相关的捕获组

      > 返回数组第一项为正则匹配的整个字符串，
      > 后面为括号对应的捕获组，
      > index 是整个匹配从零开始的索引，
      > Input 为被解析的原始字符串

      ```js
      var str = 'For more information, see Chapter 3.4.5.1';
      var re = /see (chapter \d+(\.\d)*)/i;
      var found = str.match(re);

      console.log(found);

      // logs [ 'see Chapter 3.4.5.1',
      //        'Chapter 3.4.5.1',
      //        '.1',
      //        index: 22,
      //        input: 'For more information, see Chapter 3.4.5.1' ]
      ```

## call/apply 实现

```js
Function.prototype.call = function(oThis, ...args) {
  oThis = oThis || typeof window === 'undefined' ? global : window;
  oThis.func = this;

  const result = oThis.func(...args);

  delete oThis.func; // oThis 上并没有 func 属性，需要移除

  return result;
};

Function.prototype.apply = function(oThis, args = []) {
  oThis = oThis || typeof window === 'undefined' ? global : window;

  oThis.func = this;
  const result = oThis.func(...args);

  delete oThis.func;

  return result;
};
```

## Array.prototype.reduce 实现

```js
Array.prototype.reduce = function(callback) {
  const o = Object(this);

  const len = o.length >>> 0;

  let k = 0;
  let value;

  if (arguments.length >= 2) {
    value = arguments[1];
  } else {
    while (k < len && !(k in o)) {
      k++;
    }

    // If len is 0 and initialValue is not present, throw a TypeError exception.
    if (k >= len) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    value = o[k++];
  }

  // Repeat, while k < len
  while (k < len) {
    if (k in o) {
      value = callback(value, o[k], k, o);
    }
    k++;
  }
  return value;
};
```

## 实现一个 bind 函数

bind()方法创建一个新的函数，在调用时设置 this 关键字为提供的值。并在调用新函数时，将给定参数列表作为原函数的参数序列的前若干项。

`function.bind(thisArg[, arg1[, arg2[, ...]]])`

- thisArg

  调用绑定函数时作为 this 参数传递给目标函数的值。 如果使用 new 运算符构造绑定函数，则忽略该值。当使用 bind 在 setTimeout 中创建一个函数（作为回调提供）时，作为 thisArg 传递的任何原始值都将转换为 object。**如果 bind 函数的参数列表为空，执行作用域的 this 将被视为新函数的 thisArg。**

- arg1, arg2, ...

  当目标函数被调用时，预先添加到绑定函数的参数列表中的参数。

```js
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis, ...args) {
    if (typeof this !== 'function') {
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var functionToBind = this,
      functionBound = function(...bindArgs) {
        // this instanceof fBound === true时,说明返回的fBound被当做new的构造函数调用
        return functionToBind.apply(
          this instanceof functionBound ? this : oThis,
          // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
          args.concat(bindArgs)
        );
      };

    // 我们直接将 fBound.prototype = this.prototype，我们直接修改 fBound.prototype 的时候，也会直接修改绑定函数的 prototype。这个时候，我们可以通过一个空函数来进行中转：

    // 维护原型关系(原型链继承)
    var fNOP = function() {};
    if (this.prototype) {
      fNOP.prototype = this.prototype;
    }

    functionBound.prototype = new fNOP();

    // functionbound.prototype = Object.create(this.prototype);

    return functionBound;
  };
}
```

## 柯里化函数实现

> 柯里化是一种将使用多个参数的一个函数转换成一系列使用一个参数的函数的技术。

```js
function curry(fn) {
  return function judge(...args) {
    return args.length === fn.length ? fn(...args) : (...arg) => judge(...args, ...arg);
  };
}
```

## 偏函数

> 指固定一个函数的一些参数，然后产生另一个更小元的函数。

```js
function partial(func, ...args) {
  return function(...arg) {
    return func.call(this, ...args, ...arg);
  };
}
/**
 *  占位符版
 */
function partial(fn, ...args) {
  return function(...arg) {
    let position = 0,
      len = args.length;

    // 处理参数中的占位符
    for (let i = 0; i < len; i++) {
      args[i] = args[i] === _ ? arg[position++] : args[i];
    }
    // 两次参数拼接到一起
    while (position < arg.length) {
      args.push(arg[position++]);
    }

    return fn.apply(this, args);
  };
}
```

## [深入理解 new 操作符](https://www.cnblogs.com/onepixel/p/5043523.html)

```js
function _new() {
  const obj = {};

  const [constructor, ...args] = [...arguments];

  _new.target = constructor;

  obj.__proto__ = constructor.prototype;

  const result = constructor.apply(obj, args);
  const isObject = result !== null && typeof result === 'object';
  return isObject ? result : obj; // 忽略 null
}
```

## for...in 迭代和 for...of 有什么区别

- for...in

  > 以任意顺序遍历对象的可枚举属性 （enumerable properties），包括对象从其构造函数原型中继承的属性。

- for...of

  > 遍历可迭代对象（iterable object, 定义了 Symbol.iterator 方法） 定义的可迭代的数据 ，比如遍历 Array，Map，Set，String，TypedArray，arguments 等对象的数据。

- [for...in 和 for...of 区别](https://blog.csdn.net/wangjun5159/article/details/51479569)
- [for in 和 for of 的区别](https://www.jianshu.com/p/c43f418d6bf0)

## [深入理解 Babel 原理及其使用](https://www.jianshu.com/p/e9b94b2d52e2)

- 转义过程

  三个阶段：`parsing`、`transforming`、`generating`

  > ES6 代码输入 -> babylon 进行词法解析 -> 得到 AST -> plugin 调用 babel-traverse 对 AST 树进行遍历转译 -> 得到新的 AST 树 -> 用 babel-generator 通过 AST 生成 ES5 代码

  > babel 只是转译新标准引入的语法，新标准引入的原生对象，部分原生对象新增的原型方法，新增的 API 等，需要用户自行引入 polyfill 来解决。

- polyfill: `core-js` 和 `regenerator runtime` 的包装
- babel-runtime

  polyfill 是会污染原来的全局环境，babel-runtime 不会污染全局环境

  babel-runtime 其实也不是真正的实现代码所在，真正的代码实现是在 core-js 中

- transform-runtime

  babel-plugin-transform-runtime 插件依赖 babel-runtime，babel-runtime 是真正提供 runtime 环境的包；也就是说 transform-runtime 插件是把 js 代码中使用到的新原生对象和静态方法转换成对 runtime 实现包的引用

  1. 把代码中的使用到的 ES6 引入的新原生对象和静态方法用 babel-runtime/core-js 导出的对象和方法替代
  2. 当使用 generators 或 async 函数时，用 babel-runtime/regenerator 导出的函数取代（类似 polyfill 分成 regenerator 和 core-js 两个部分）
  3. 把 Babel 生成的辅助函数改为用 babel-runtime/helpers 导出的函数来替代（babel 默认会在每个文件顶部放置所需要的辅助函数，如果文件多的话，这些辅助函数就在每个文件中都重复了，通过引用 babel-runtime/helpers 就可以统一起来，减少代码体积）

  > Note: 由于 runtime 不会污染全局空间，所以实例方法是无法工作的（因为这必须在原型链上添加这个方法，这是和 polyfill 最大的不同）

## [前端基础进阶（二）：执行上下文详细图解](https://www.jianshu.com/p/a6d37c77e8db)

### [什么是作用域和执行上下文](https://segmentfault.com/a/1190000009522006)

### [Javascript 函数声明的优先级高于变量声明的优先级，但不会覆盖变量赋值](https://blog.csdn.net/wy818/article/details/49247675)

## Set 和 Map 数据结构

<iframe src="http://es6.ruanyifeng.com/#docs/set-map" width="100%" frameborder="0" height="500px" ></iframe>

## 异步解决方案

### Promise

- [【剖析 Promise 内部结构，一步一步实现一个完整的、能通过所有 Test case 的 Promise 类】](https://github.com/xieranmaya/blog/issues/3)

* [深入 Promise(一)——Promise 实现详解](https://zhuanlan.zhihu.com/p/25178630)
* [深入 Promise(二)——进击的 Promise](https://zhuanlan.zhihu.com/p/25198178)
* [深入 Promise(三)——命名 Promise](https://zhuanlan.zhihu.com/p/25199781)

- [实现](https://github.com/xieranmaya/Promise3/blob/master/Promise3.js)

  ```js
  function Promise(executor) {
    var self = this;
    self.status = 'pending';
    self.value = undefined;
    self.onResolveCallback = [];
    self.onRejectCallback = [];

    function resolve(value) {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      setTimeout(function() {
        if (self.status === 'pending') {
          self.status = 'fulfilled';
          self.value = value;
          for (var i = 0; i < self.onResolveCallback.length; i++) {
            self.onResolveCallback[i](value);
          }
        }
      });
    }

    function reject(reason) {
      setTimeout(function() {
        if (self.status === 'pending') {
          self.status = 'rejected';
          self.value = reason;
          for (var i = 0; i < self.onRejectCallback.length; i++) {
            self.onRejectCallback[i](reason);
          }
        }
      });
    }

    try {
      executor(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }

  function resolvePromise(promise2, x, resolve, reject) {
    var then;
    var thenCalledOrThrow = false;

    if (promise2 === x) {
      return reject(new TypeError('Chaining cycle detected for promise!'));
    }

    if (x instanceof Promise) {
      if (x.status === 'pending') {
        x.then(function(value) {
          resolvePromise(promise2, value, resolve, reject);
        }, reject);
      } else {
        x.then(resolve, reject);
      }
      return;
    }

    if (x !== null && (typeof x === 'object' || typeof x === 'function')) {
      try {
        then = x.then;
        if (typeof then === 'function') {
          then.call(
            x,
            function rs(y) {
              if (thenCalledOrThrow) return;
              thenCalledOrThrow = true;
              return resolvePromise(promise2, y, resolve, reject);
            },
            function rj(r) {
              if (thenCalledOrThrow) return;
              thenCalledOrThrow = true;
              return reject(r);
            }
          );
        } else {
          resolve(x);
        }
      } catch (e) {
        if (thenCalledOrThrow) return;
        thenCalledOrThrow = true;
        return reject(e);
      }
    } else {
      resolve(x);
    }
  }

  Promise.prototype.then = function(onResolved, onRejected) {
    var self = this;
    var promise2;

    onResolved =
      typeof onResolved === 'function'
        ? onResolved
        : function(value) {
            return value;
          };
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : function(reason) {
            throw reason;
          };

    if (self.status === 'fulfilled') {
      return (promise2 = new Promise(function(resolve, reject) {
        setTimeout(function() {
          try {
            var x = onResolved(self.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }));
    }

    if (self.status === 'rejected') {
      return (promise2 = new Promise(function(resolve, reject) {
        setTimeout(function() {
          try {
            var x = onReject(self.value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }));
    }

    if (self.status === 'pending') {
      return (promise2 = new Promise(function(resolve, reject) {
        self.onResolvedCallback.push(function(value) {
          try {
            var x = onResolved(value);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });

        self.onRejectedCallback.push(function(reason) {
          try {
            var x = onReject(reason);
            resolvePromise(promise2, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }));
    }
  };

  Promise.prototype.catch = function(onReject) {
    return this.then(null, onReject);
  };

  Promise.deferred = Promise.defer = function() {
    var dfd = {};
    dfd.promise = new Promise(function(resolve, reject) {
      dfd.resolve = resolve;
      dfd.reject = reject;
    });
    return dfd;
  };

  Promise.prototype.all = function(promises) {
    return new Promise((resolve, reject) => {
      promises = Array.from(promises);
      const len = promises.length;
      if (len === 0) {
        resolve([]);
      } else {
        let result = [];
        let resolvedCount = 0;
        for (let i = 0; i < len; i++) {
          Promise.resolve(promises[i]).then(
            data => {
              result[i] = data;
              resolvedCount++;
              if (resolvedCount === len) {
                resolve(result);
              }
            },
            err => {
              return reject(err);
            }
          );
        }
      }
    });
  };

  Promise.prototype.race = function(promises) {
    return new Promise((resolve, reject) => {
      promises = Array.from(promises);
      const len = promises.length;
      if (len === 0) {
        resolve();
      } else {
        for (let i = 0; i < len; i++) {
          Promise.resolve(promises[i]).then(resolve, reject);
        }
      }
    });
  };
  ```

### generator

<iframe src="http://es6.ruanyifeng.com/#docs/generator" width="100%" frameborder="0" height="500px" ></iframe>

### async/await

```js
function spawn(genF) {
  return new Promise(function(resolve, reject) {
    const gen = genF();

    function step(nextF) {
      let next;
      try {
        next = nextF();
      } catch (err) {
        return reject(err);
      }
      if (next.done) {
        return resolve(next.value);
      }

      Promise.resolve(next.value).then(
        function(v) {
          step(function() {
            return gen.next(v);
          });
        },
        function(err) {
          step(function() {
            return gen.throw(err);
          });
        }
      );
    }

    step(function() {
      return gen.next(undefined);
    });
  });
}
```

<iframe src="http://es6.ruanyifeng.com/#docs/async#async-%E5%87%BD%E6%95%B0%E7%9A%84%E5%AE%9E%E7%8E%B0%E5%8E%9F%E7%90%86" width="100%" frameborder="0" height="500px" ></iframe>

### promise 和 async 区别

async 和 promise 都不会阻塞执行，await 只会对 async 函数内 await 之后的代码产生阻塞。

async 异常捕获用 try...catch, promise 直接用 catch(), try...catch 无法捕获 promise 异常。

async...await 是 Generator 函数语法糖。[ co 模块类似实现](#asyncawait)。

## 防抖与节流

- 防抖

  将多次高频操作优化为只在最后一次执行，通常使用的场景是：用户输入，只需再输入完成后做一次输入校验即可。

  [lodash debounce](https://github.com/lodash/lodash/blob/master/debounce.js)

  ```js
  function debounce(fn, interval) {
    let timeout = null;
    return function() {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        fn.apply(this, arguments);
      }, interval);
    };
  }
  ```

- 节流

  每隔一段时间后执行一次，也就是降低频率，将高频操作优化成低频操作，通常使用场景: 滚动条事件 或者 resize 事件，通常每隔 100~500 ms 执行一次即可。

  [lodash throttle](https://github.com/lodash/lodash/blob/master/throttle.js)

  ```js
  function throttle(fn, interval) {
    let canRun = true;
    return function() {
      if (!canRun) return;

      canRun = false;

      setTimeout(() => {
        fn.apply(this, arguments);
        canRun = true;
      }, interval);
    };
  }
  ```

## this 指向

- [彻底理解 js 中 this 的指向，不必硬背。](https://www.cnblogs.com/pssp/p/5216085.html)
- [彻底理解 JavaScript 中的 this](https://juejin.im/post/5c049e6de51d45471745eb98)

## [前端基础进阶：详细图解 JavaScript 内存空间](https://juejin.im/entry/589c29a9b123db16a3c18adf)

## import 和 require 的区别

- import 是关键字， 而 require 是个局部变量

  使用 require 的时候，其实会将 module 的代码进行包装，变成如下样子的代码：

  ```js
    function (exports, require, module, __filename, __dirname) {
      const m = 1;
      module.exports.m = m;
    }
  ```

- ES6 模块的设计思想是尽量的静态化，使得编译时就能确定模块的依赖关系，以及输入和输出的变量。CommonJS 和 AMD 模块，都只能在运行时确定这些东西。

  ```js
  // CommonJS模块
  let { stat, exists, readFile } = require('fs');

  // 等同于
  let _fs = require('fs');
  let stat = _fs.stat;
  let exists = _fs.exists;
  let readfile = _fs.readfile;
  ```

  > 上面代码的实质是整体加载 fs 模块（即加载 fs 的所有方法），生成一个对象（`_fs`），然后再从这个对象上面读取 3 个方法。这种加载称为“运行时加载”，因为只有运行时才能得到这个对象，导致完全没办法在编译时做“静态优化”。

  > ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，再通过 import 命令输入。

  ```js
  // ES6模块
  import { stat, exists, readFile } from 'fs';
  ```

  > 上面代码的实质是从 fs 模块加载 3 个方法，其他方法不加载。这种加载称为“编译时加载”或者静态加载，即 ES6 可以在编译时就完成模块加载，效率要比 CommonJS 模块的加载方式高。当然，这也导致了没法引用 ES6 模块本身，因为它不是对象。

- export 语句输出的接口，与其对应的值是动态绑定关系，即通过该接口，可以取到模块内部实时的值。

  ```js
  export default function() {}
  =>
  function a(){}
  export { a as default }

  ================华丽分割线=====================

  import a from './d';
  =>
  import { default as a } from './d'
  ```

1. CommonJS 还是 ES6 Module 输出都可以看成是一个具备多个属性或者方法的对象；

- require

  理论上可以运用在代码的任何地方，甚至不需要赋值给某个变量之后再使用

  ```js
  require('./a')(); // a模块是一个函数，立即执行a模块函数
  var data = require('./a').data; // a模块导出的是一个对象
  var a = require('./a')[0]; // a模块导出的是一个数组
  ```

## [ES6 模块与 CommonJS 模块的差异](http://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82)

<iframe src="http://es6.ruanyifeng.com/#docs/module-loader#ES6-%E6%A8%A1%E5%9D%97%E4%B8%8E-CommonJS-%E6%A8%A1%E5%9D%97%E7%9A%84%E5%B7%AE%E5%BC%82" width="100%" frameborder="0" height="500px" ></iframe>

## script 属性 defer 和 async 区别

defer 要等到整个页面在内存中正常渲染结束（DOM 结构完全生成，以及其他脚本执行完成），才会执行；async 一旦下载完，渲染引擎就会中断渲染，执行这个脚本以后，再继续渲染。一句话，defer 是“渲染完再执行”，async 是“下载完就执行”。另外，如果有多个 defer 脚本，会按照它们在页面出现的顺序加载，而多个 async 脚本是不能保证加载顺序的。

“每一个 defer 属性的脚本都是在页面解析完毕之后，按照原本的顺序执行，同时会在 document 的 DOMContentLoaded 之前执行。”--------------HTML5 规范要求脚本执行应该按照脚本出现的先后顺序执行，但实际情况下，延迟脚本不一定按照先后顺序执行！！！

![](https://segmentfault.com/img/bVWhRl?w=801&h=814)

## 判断元素是否在视窗之内

- Element.getBoundingClientRect(): 除了 width 和 height 外的属性都是相对于视口的左上角位置而言的。

  - left
  - right
  - top
  - bottom
  - width
  - height
  - x(同 left)
  - y(同 top)

  ![](./imgs/rect.png)

- IntersectionObserver

  1. 创建一个 intersection observer

     ```js
     let options = {
       root: document.querySelector('#scrollArea'), // 指定根(root)元素，用于检查目标的可见性。必须是目标元素的父级元素。如果未指定或者为null，则默认为浏览器视窗。
       rootMargin: '0px', // root元素的外边距。类似于css中的 margin 属性，比如 "10px 20px 30px 40px" (top, right, bottom, left)。如果有指定root参数，则rootMargin也可以使用百分比来取值。该属性值是用作root元素和target发生交集时候的计算交集的区域范围，使用该属性可以控制root元素每一边的收缩或者扩张。默认值为0。
       threshold: 1.0 // 可以是单一的number也可以是number数组，target元素和root元素相交程度达到该值的时候IntersectionObserver注册的回调函数将会被执行。
     };
     let observer = new IntersectionObserver(callback, options);
     ```

  2. 为每个观察者配置一个目标

     ```js
     let target = document.querySelector('#listItem');
     observer.observe(target);

     let callback = function(entries, observer) {
       entries.forEach(entry => {
         // Each entry describes an intersection change for one observed
         // target element:
         //   entry.boundingClientRect
         //   entry.intersectionRatio
         //   entry.intersectionRect
         //   entry.isIntersecting
         //   entry.rootBounds
         //   entry.target
         //   entry.time
       });
     };
     ```

## window.requestIdleCallback()

> 在浏览器空闲时期依次调用函数，这就可以让开发者在主事件循环中执行后台或低优先级的任务，而且不会对像动画和用户交互这样延迟敏感的事件产生影响。函数一般会按先进先出调用的顺序执行，然而，如果回调函数指定了执行超时时间 timeout，则有可能为了在超时前执行函数而打乱执行顺序。

- 语法：`let handle = window.requestIdleCallBack(callback[,options])`
  - 返回值：无符号长整数，可以传入`window.cancelIdleCallback()`结束回调
  - callback
    - 一个在事件循环空闲时即将被调用的函数的引用。函数会接受到一个名为 IdleDeadline 的参数，这个参数可以获取当前空闲时间以及回调是否在超时时间前已经执行的状态。
  - options
    - timeout: timeout 值被指定为正数时，当做浏览器调用 callback 的最后期限。它的单位是毫秒。当指定的时间过去后回调还没有被执行，那么回调会在下一次空闲时期被强制执行，尽管可能会对性能造成负面影响。

## window.requestAnimationFrame(callback)

> 告诉浏览器——你希望执行一个动画，并且要求浏览器在下次重绘之前调用指定的回调函数更新动画。该方法需要传入一个回调函数作为参数，该回调函数会在浏览器下一次重绘之前执行

- window.cancelAnimationFrame(id)

## 时间精度问题

- [JavaScript 中的高精度计时](http://jimliu.net/2014/03/16/hrt-in-js/)

以 Windows 为例，这一类时间戳所使用的系统调用，比如 [GetSystemTime()](https://docs.microsoft.com/en-us/windows/desktop/api/sysinfoapi/nf-sysinfoapi-getsystemtime)、[GetTickCount()](https://docs.microsoft.com/en-us/windows/desktop/api/sysinfoapi/nf-sysinfoapi-gettickcount)，其函数的取值并不是实时的，而是通过硬件的时钟中断被动刷新的，这里的刷新间隔“正好”就是上面那个 16ms。以 GetSystemTime()为例，它返回的是 SYSTEMTIME 结构体，这用来进行时间日期处理的，因为时间日期处理通常根本不需要也不应该用那么高的精度（甚至很多时候只需要秒级别的精度），所以(new Date()).getTime()通过它们实现的确是可以胜任的。

- `webkit` 中提供了 `performance.now()`

> 和 JavaScript 中其他可用的时间类函数（比如 Date.now ）不同的是，window.performance.now() 返回的时间戳没有被限制在一毫秒的精确度内，而它使用了一个浮点数来达到微秒级别的精确度。

> 另外一个不同点是，window.performance.now() 是以一个恒定的速率慢慢增加的，它不会受到系统时间的影响（可能被其他软件调整）。另外，performance.timing.navigationStart + performance.now() 约等于 Date.now()。

```js
let t0 = window.performance.now();
doSomething();
let t1 = window.performance.now();
console.log('doSomething 函数执行了' + (t1 - t0) + '毫秒。');
```

- node.js 中有 `process.hrtime()`, 返回一个数组 `[seconds, nanoseconds]`

  > HRT 是用来计算时间差的，不是用来计算现实中时间（挂钟时间）的

## 如何主动中止 Promise 调用链

- throw Error, 每个 catch 度需要向后抛 Error
- return new Promise(function(){})
  > 状态是 pending, 潜在的内存泄漏
- 修改原型链 then 方法
  > 状态可能是 pending, 潜在的内存泄漏

```js
(function() {
  const STOP = {};

  Promise.prototype._then = Promise.prototype.then;

  Promise.prototype.then = function(onResolved, onRejected) {
    return this._then(result => {
      if (result === STOP) {
        return result;
      } else {
        return onResolved(result);
      }
    }, onRejected);
  };
})();
```

## [JavaScript 中的对象拷贝](https://juejin.im/entry/5a28ec86f265da43163cf720)

- 浅拷贝

  - Object.assign()、扩展运算符(...)
    1. 复制对象的可枚举属性
    2. 可以拷贝方法，和循环引用
    3. 复制的嵌套属性是引用，共享

- 深拷贝

  - [深入深入再深入 js 深拷贝对象](https://juejin.im/post/5ad6b72f6fb9a028d375ecf6)
  - [lodash baseClone](https://github.com/lodash/lodash/blob/master/.internal/baseClone.js)
  - JSON.parse(JSON.stringify(obj))  
    原型改变，不能复制对象方法，不能复制循环引用
  - 递归遍历属性，复制属性 Object.getOwnPropertyDescriptor

    - 可枚举属性
    - 循环引用
    - Symbol 键
    - 原型上的属性
    - 不可枚举的属性：属性描述符、setters、getters 等

    ```js
    function isObject(data) {
      return data != null && (typeof data === 'object' || typeof data === 'function');
    }

    function deepClone(obj, hash = new WeakMap()) {
      if (!isObject(obj)) {
        return obj;
      }
      // 查表，防止循环拷贝
      if (hash.has(obj)) {
        return hash.get(obj);
      }

      let isArray = Array.isArray(obj);
      // 初始化拷贝对象
      let cloneObj = isArray ? [] : {};
      // 哈希表设置
      hash.set(obj, cloneObj);
      // 获取原对象的所有属性描述符
      let descriptors = Object.getOwnPropertyDescriptors(obj);
      // 获取原对象所有 symbol 类型值
      let symbolKeys = Object.getOwnPropertySymbols(obj);
      // 拷贝所有 symbol 属性
      if (symbolKeys.length > 0) {
        symbolKeys.forEach(symbolKey => {
          cloneObj[symbolKey] = isObject(obj[symbolKey]) ? deepClone(obj[symbolKey], hash) : obj[symbolKey];
        });
      }

      // 拷贝不可枚举属性 ?????
      cloneObj = Object.create(Object.getPrototypeOf(cloneObj), descriptors);

      // 拷贝可枚举属性（包括原型链上的）
      for (let key in obj) {
        cloneObj[key] = isObject(obj[key]) ? deepClone(obj[key]) : obj[key];
      }

      return cloneObj;
    }
    /**
     * 拷贝原型链
     * 拷贝属性描述符
     * 拷贝symbol属性
     */
    function cloneDeep(obj) {
      // 拷贝原型链
      let family = {};
      let parent = Object.getPrototypeOf(obj);
      while (parent != null) {
        family = completeAssign(deepClone(obj), parent); //
        parent = Object.getPrototypeOf(parent);
      }

      // 拷贝所有自有属性的属性描述符,来自于 MDN
      // https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
      function completeAssign(target, ...sources) {
        sources.forEach(source => {
          // 复制属性描述符
          let descriptors = Object.keys(source).reduce((descriptors, curKey) => {
            descriptors[curKeys] = Object.getOwnPropertyDescriptor(source, curKey);
            return descriptors;
          }, {});

          // 复制可枚举的 symbols 属性
          Object.getOwnPropertySymbols(source).forEach(sym => {
            let descriptor = Object.getOwnPropertyDescriptor(source, sym);
            if (descriptor.enumerable) {
              descriptors[sym] = descriptor;
            }
          });

          Object.defineProperties(target, descriptors);
        });

        return target;
      }

      return completeAssign(deepClone(obj), family);
    }
    ```
