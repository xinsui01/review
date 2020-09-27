# 编程

## compose

```js
function compose(...funcs) {
  if (funcs.length === 0) return (arg) => arg;
  if (funcs.length === 1) return funcs[0];
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
```

## Array.prototype.flatDeep

```js
function flatDeep(arr) {
  return arr.reduce((ret, cur) => {
    return ret.concat(Array.isArray(cur) ? flatDeep(cur) : cur);
  }, []);
}
```

- 数字千分位处理，正则和非正则都要实现(千位加逗号)

  - `numObj.toLocaleString([locales [, options]])`

    ```js
    // 方法一
    var num = 234982347.73;
    console.log(num.toLocaleString());

    // 方法二
    var num = 234982347.73;
    num
      .toString()
      .replace(/^\d+/, (m) => m.replace(/(\d{1,3})(?=(?:\d{3})+$)/g, "$1,"));
    ```

- 有如下对象 testData, 请将该对象所有 key 从下划线转换为大驼峰

  ```js
  var testData = {
    aa_bb: 123,
    bb_cc_dd: [1, 2, 3],
  };

  testData.cc = [
    { abc_xy: testData },
    { aa_bb_cc: testData.bb_cc_dd },
    1,
    "st_ri_n_g",
  ];
  testData.dd_xyz_cc_bb_ax = {
    c: testData.cc,
    xy: [1, 2, 3, null, undefined, false],
    z: undefined,
    is_string: false,
    is_array: function () {},
  };

  ////////////////////// 解答  ///////////////////////////
  function mapKeysToCamelCase(data) {
    function _mapKeysToCamelCase(data, map) {
      if (map.get(data)) return map.get(data);
      /**
       * 如果是基本常量return
       */
      if (isBaseType(data)) {
        map.set(data, data);
        return data;
      }

      if (Array.isArray(data)) {
        let _data = [];
        map.set(data, _data);
        data.forEach((key, index) => {
          _data[index] = isBaseType(key) ? key : _mapKeysToCamelCase(key, map);
        });
        return _data;
      }

      let obj = {};
      map.set(data, obj);
      Object.keys(data).forEach((key) => {
        const _key = strToCamelCase(key);
        obj[_key] = _mapKeysToCamelCase(data[key], map);
      });

      return obj;
    }

    const isBaseType = (function () {
      const baseTypes = [
        "Number",
        "String",
        "Boolean",
        "Null",
        "Undefined",
        "Function",
      ].map((item) => `[object ${item}]`);
      return (val) => {
        const tp = Object.prototype.toString.call(val);
        return baseTypes.includes(tp);
      };
    })();

    function strToCamelCase(key) {
      return key
        .split("_")
        .map((key) =>
          key.replace(/\b(\w)(\w*)/g, function ($0, $1, $2) {
            return $1.toUpperCase() + $2.toLowerCase();
          })
        )
        .join("");
    }

    let map = new Map();
    return _mapKeysToCamelCase(data, map);
  }
  ////////////////////// 解答结束  ///////////////////////////
  console.log(mapKeysToCamelCase(testData));
  ```

- JS 中判断字符串中出现次数最多的字符及出现的次数

  ```js
  function maxN(str) {
    // const obj = [...str].reduce((accu, cur, index) => {
    // accu[cur] = (accu[cur] || 0) + 1;
    // return accu
    // },
    // {}
    // );

    let obj = {};
    ("" + str).replace(/./g, (letter) => {
      obj[letter] = (obj[letter] || 0) + 1;
      return letter;
    });

    let letter = "",
      maxNum = 0;

    for (let _letter in obj) {
      if (obj[_letter] > maxNum) {
        maxNum = obj[_letter];
        letter = _letter;
      }
    }

    return { letter, maxNum };
  }

  const str = "qweqrtyuiqqqwrtyudfgerqtywer";
  console.log(maxN(str));
  ```

- 请编写一个 JavaScript 函数 parseQueryString ，他的用途是把 URL 参数解析为一个对象

  ```js
  function parseQueryString(url) {
    let result = {};
    let arr = url.split("?");
    if (arr.length <= 1) {
      return result;
    } else {
      arr = arr[1].split("#");
      arr = arr[0].split("&");
      arr.forEach((item) => {
        const [key, value] = item.split("=");
        result[key] = value;
      });
    }

    return result;
  }

  var url = "http://witmax.cn/index.php?key0=0&key1=1&key2=2#location";

  console.log(parseQueryString(url));
  ```

- 在 IE6.0 下面是不支持 `position：fixed` 的，请写一个 JS 使用固定在页面的右下角。

  ```html
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <title>Document</title>
      <style>
        .tit {
          position: absolute;
          width: 100px;
          height: 100px;
          background: red;
          right: 0;
          bottom: 0;
        }
      </style>
    </head>
    <body>
      <div id="box" class="tit"></div>
      <!-- <script>
          window.onscroll = window.onresize = window.onload = function() {
            const box = document.getElementById('box')
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
            box.style.left = document.documentElement.clientWidth - box.offsetWidth + 'px'
            box.style.top = document.documentElement.clientHeight + scrollTop - box.offsetHeight + 'px'
          }
        </script> -->
    </body>
  </html>
  ```

- 请实现，鼠标移到页面中的任意标签，显示出这个标签的基本矩形轮廓。

  ```js
  function mouseOverShowBorder(container) {
    const children = container.childNodes;
    for (let i = 0; i < children.length; i++) {
      const child = children[i];

      if (child.nodeType === 1) {
        child.onmouseover = function (evt) {
          if (evt && evt.stopPropagation) {
            evt.stopPropagation();
          } else {
            evt.cancelBubble = true; // IE 阻止事件冒泡
          }
          this.style.border = "1px solid #ccc";
        };

        child.onmouseout = function () {
          this.style.border = "";
        };

        mouseOverShowBorder(child);
      }
    }
  }

  mouseOverShowBorder(document.body);
  ```

  nodeType:

  | 常量                             | 值  | 描述                                                                              |
  | :------------------------------- | :-- | :-------------------------------------------------------------------------------- |
  | Node.ELEMENT_NODE                | 1   | 一个 元素 节点，例如 `<p>` 和 `<div>`。                                           |
  | Node.TEXT_NODE                   | 3   | Element 或者 Attr 中实际的文字                                                    |
  | Node.PROCESSING_INSTRUCTION_NODE | 7   | 一个用于 XML 文档的 ProcessingInstruction ，例如 `<?xml-stylesheet ... ?>` 声明。 |
  | Node.COMMENT_NODE                | 8   | 一个 Comment 节点。                                                               |
  |                                  |     |                                                                                   |
  | Node.DOCUMENT_NODE               | 9   | 一个 Document 节点。                                                              |
  | Node.DOCUMENT_TYPE_NODE          | 10  | 描述文档类型的 DocumentType 节点。例如 `<!DOCTYPE html>` 就是用于 HTML5 的。      |
  | Node.DOCUMENT_FRAGMENT_NODE      | 11  | 一个 DocumentFragment 节点                                                        |

- 找出数组中的第一个重复项

  ```js
  /**
   * const nums = [0, 1, 2, 3, 4, 11, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
   * @param {number[]} nums
   * @return {number}
   */
  function findRepeatNumber(nums) {
    let set = new Set();
    for (let i = 0, { length: len } = nums; i < len; i++) {
      const { size } = set;
      set.add(nums[i]);
      if (set.size === size) return nums[i];
    }
  }

  /**
   * 使用哈希表
   * const nums = [0, 1, 2, 3, 4, 11, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
   * @param {number[]} nums
   * @return {number}
   */
  function findRepeatNumber(nums) {
    const map = {};
    for (let num of nums) {
      if (!map[num]) {
        map[num] = true;
      } else {
        return num;
      }
    }
  }
  /**
   * 原地哈希
   * const nums = [0, 1, 2, 3, 4, 11, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
   * @param {number[]} nums
   * @return {number}
   */
  function findRepeatNumber(nums) {
    for (let i = 0, { length: len } = nums; i < len; i++) {
      // 检查下标为 i 的元素是否放在了 nums[i] 位置
      while ((num = nums[i]) !== i) {
        if (num === nums[num]) {
          return num;
        }
        [nums[nums[i]], nums[i]] = [nums[i], nums[nums[i]]];
      }
    }
  }
  ```

- 数组去重

  ```js
  function unique(arr) {
    return [...new Set(arr)];
  }
  ```

  ```js
  function unique(arr) {
    return arr.filter((item, index) => arr.indexOf(item) === index);
  }
  ```

  ```js
  function unique(arr) {
    let obj = {};
    return arr.filter((item) => {
      if (obj[item]) {
        return false;
      }

      return (obj[item] = true);
    });
  }
  ```

  ```js
  function unique(arr) {
    return arr.reduce((accu, curValue) => {
      if (accu.indexOf(curValue) === -1) {
        accu.push(curValue);
      }
      return accu;
    }, []);
  }
  ```

- 替换空格

  ```js
  /**
   * 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
   * 输入：s = "We are happy."
   * 输出："We%20are%20happy."
   */
  var replaceSpace = function (str) {
    const { length: len } = str;
    let newStr = "";
    let i = 0;
    while (i < len) {
      const letter = str[i];
      newStr += letter === " " ? "%20" : letter;
      i++;
    }
    return newStr;
  };
  ```

  ```js
  /**
   * 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
   * 输入：s = "We are happy."
   * 输出："We%20are%20happy."
   */
  var replaceSpace = function (str) {
    if (!str) return str;
    return (str || "").split(" ").join("%20");
  };
  ```

  ```js
  /**
   * 请实现一个函数，把字符串 s 中的每个空格替换成"%20"。
   * 输入：s = "We are happy."
   * 输出："We%20are%20happy."
   */
  var replaceSpace = function (str) {
    if (!str) return str;
    return (str || "").replace(/\s/g, "%20");
  };
  ```

- 字符串去重

  ```js
  function unique(str) {
    return [...new Set(str)].join("");
  }
  ```

- 字符串去除相邻的重复项

  ```js
  function unique(str) {
    return str.replace(/(.)(?=\1+)/g, "");
  }
  ```

- 输入 `携程C2t0r1i8p2020校招`, 输出 `2018Ctrip`

  ```js
  function handleStr(str) {
    let nums = str.match(/\d/g).join("");
    let words = str.match(/[a-zA-Z]/g).join("");

    return uniqueStr(nums) + words;
  }

  function uniqueStr(str) {
    const arr = str.split("");
    return arr.filter((item, index) => arr.indexOf(item) === index).join("");
  }
  ```

- 对一维数组，根据 type 类型分组成二维数组

  ```js
  // var input = [null, 2, "test", undefined, {
  //        "type": "product",
  //        "content": "product1"
  //      }, {
  //        "type": "product",
  //        "content": "product2"
  //      }, {
  //        "type": "tag",
  //        "content": "tag1"
  //      }, {
  //        "type": "product",
  //        "content": "product3"
  //      }, {
  //        "type": "tag",
  //        "content": "tag2"
  //      }];

  // output = [{"type":"product","contents":["product1","product2","product3"]},{"type":"tag","contents":["tag1","tag2"]}]

  function groupList(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return [];
    }

    const validItems = getValidItems(arr);
    const result = {};

    validItems.forEach((item) => {
      result[item.type]
        ? result[item.type].push(item)
        : (result[item.type] = [item]);
      // if(result.hasOwnProperty(item.type)) {
      //  result[item.type].push(item)
      // } else {
      //  result[item.type] = [];
      //  result[item.type].push(item)
      // }
    });

    return resultFormat(result);
  }

  function getValidItems(arr) {
    return arr.filter(
      (item) => isPureObject(item) && item.type && item.content
    );
  }

  function isPureObject(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === "Object";
  }

  function resultFormat(obj) {
    return Object.keys(obj).map((type) => {
      return { type, contents: obj[type] };
    });
  }
  ```

- 计算目录 `/a/b/c/d/e.js` 和 `/a/b/f/g.js` 的相对目录

  ```js
  function calculateRoute(path1, path2) {
    let pathArr1 = path1.split("/"),
      pathArr2 = path2.split("/"),
      routeArr = [],
      fileArr = [],
      diff = false;

    for (let i = 1, len = pathArr1.length; i < len; i++) {
      if (pathArr1[i] !== pathArr2[i] || diff) {
        if (pathArr1[i]) {
          routeArr.push("..");
        }
        if (pathArr2[i]) {
          fileArr.push(pathArr2[i]);
        }
        diff = true;
      } else {
        diff = false;
      }
    }

    return `${routeArr.join("/")}/${fileArr.join("/")}`;
  }

  let path = caculateRoute("/a/b/c/d/e.js", "/a/b/f/g.js");
  ```

- 实现一个数组中删除一个子数组的函数，要求函数中不 return 返回新的数组。

  ```js
  function removeSubArray(main, sub) {
    for (let i = 0; i < main.length; i++) {
      if (sub.includes(main[i])) {
        main.splice(i, 1);
        i--;
      }
    }
  }
  ```

- 使用 promise 4 秒后打印’A’，然后经过 3 秒打印’B’，再经过 2 秒打印’C’，再经过一秒打印’D’。

  ```js
  function fnFactory(text, interval) {
    return function () {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log(text);
          resolve();
        }, interval);
      });
    };
  }

  function sequenceTasks(arr, input) {
    return arr.reduce(
      (promiseChain, curFn) => promiseChain.then(curFn),
      Promise.resolve(input)
    );
  }

  const arr = [
    fnFactory("A", 4000),
    fnFactory("B", 3000),
    fnFactory("C", 2000),
    fnFactory("D", 1000),
  ];
  sequenceTasks(arr, undefined);
  ```

- 数组中的 Promise 顺序执行

  ```js
  function sequenceTasks(arr, input) {
    return arr.reduce(
      (promiseChain, currentFunction) => promiseChain.then(currentFunction),
      Promise.resolve(input)
    );
  }
  ```

  ```js
  function sequenceTasks(arr) {
    let p = Promise.resolve();
    arr.forEach((promiseFn) => {
      p = p.then(function (...args) {
        return promiseFn(...args);
      });
    });
    return p;
  }
  ```

  ```js
  async function sequenceTasks(arr) {
    for (let promiseFn of arr) {
      await promiseFn();
    }
  }
  ```

- 在一个数组中，找出里面其中两项相加后的和为 num，如果存在就返回两个数的索引位置，否则 false

  ```js
  function fn(num = 0, arr = []) {
    for (let i = 0, len = arr.length; i < len; i++) {
      let diff = num - arr[i];
      let diffIndex = arr.indexOf(diff, i + 1);
      if (diffIndex !== -1) {
        return [i, diffIndex];
      }
    }
    return false;
  }
  ```

- 将两个有序数组合并为一个排好序的大数组

  ```js
  function mergeArray(arr1 = [], arr2 = []) {
    const result = [];
    while (arr1.length && arr2.length) {
      result.push(arr1[0] <= arr2[0] ? arr1.shift() : arr2.shift());
    }
    return result.concat(arr1, arr2);
  }
  ```

- 在数组中找到三个不同元素 其中两项的和当于第三项 arr[x] + arr[y] = arr[z] 如果数组中存在返回这三个数否则返回 false

  ```js
  function find(_arr) {
    let arr = Array.from(_arr).sort((a, b) => a - b);
    for (let i = 0, len = arr.length - 1; i < len; i++) {
      let cur = arr[i];
      for (let j = i + 1; j < arr.length; j++) {
        let next = arr[j];
        let sum = cur + next;
        let idx = arr.indexOf(sum, j + 1); // 开始查找的位置。如果该索引值大于或等于数组长度，意味着不会在数组里查找，返回-1。
        if (idx > -1) {
          return [cur, next, sum];
        }
      }
    }
    return false;
  }
  ```

- 字符串 repeat 实现

  ```js
  String.prototype.repeat = function (count) {
    return Array(count).fill(this).join("");
  };

  String.prototype.repeat = function (count) {
    return Array(count + 1).join(this);
  };

  String.prototype.repeat = function (count) {
    let rpt = "";
    let str = "" + this;
    for (;;) {
      if ((count & 1) == 1) {
        rpt += str;
      }
      count >>>= 1;
      if (count == 0) {
        break;
      }
      str += str;
    }
    return rpt;
  };
  ```

- 请实现函数 CodingMan, 此函数可以按照以下方式调用：
  ![](https://user-gold-cdn.xitu.io/2018/3/21/162468732563a3da?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

  ```js
  function CodingMan(name) {
    if (!(this instanceof CodingMan)) return new CodingMan(name); // 检查是否new
    setTimeout(() => {
      console.log(`Hi! This is ${name}`);
    }, 0);
  }

  CodingMan.prototype.sleep = function (time) {
    const curTime = Date.now();
    const delay = time * 1000;
    setTimeout(() => {
      while (Date.now() - curTime < delay) {}
      console.log(`Wake up after ${time}s`);
    }, 0);
    return this;
  };

  CodingMan.prototype.sleepFirst = function (time) {
    const curTime = Date.now();
    const delay = time * 1000;
    while (Date.now() - curTime < delay) {}
    console.log(`Wake up after ${time}s`);
    return this;
  };

  CodingMan.prototype.eat = function (food) {
    setTimeout(() => {
      console.log(`Eat ${food}~~`);
    }, 0);
    return this;
  };
  ```

## 如何让 (a == 1 && a == 2 && a == 3) 的值为 true

- 利用隐式类型转换
  `a == 1 && a == 2 && a == 3` 的值意味着其不可能是基本数据类型。因为如果 a 是 null 或者是 undefined、bool 类型，都不可能返回 true。

  因此可以推测 a 是复杂数据类型，JS 中复杂数据类型只有 object。

  Object 转换为原始类型

  - 如果部署了 `[Symbol.toPrimitive]` 接口，那么调用此接口，若返回的不是基本数据类型，抛出错误。
    > 该函数由字符串参数 hint 调用，目的是指定原始值转换结果的首选类型。 hint 参数可以是 "number"、"string" 和 "default" 中的一种。
  - 如果没有部署 `[Symbol.toPrimitive]` 接口，那么根据要转换的类型，先调用 valueOf / toString
    - 非 Date 类型对象，hint 是 default 时，调用顺序为：valueOf >>> toString，即 valueOf 返回的不是基本数据类型，才会继续调用 toString，如果 toString 返回的还不是基本数据类型，那么抛出错误。
    - 如果 hint 是 string(Date 对象的 hint 默认是 string) ，调用顺序为：toString >>> valueOf，即 toString 返回的不是基本数据类型，才会继续调用 valueOf，如果 valueOf 返回的还不是基本数据类型，那么抛出错误。
    - 如果 hint 是 number，调用顺序为： valueOf >>> toString

  ```js
  let a = {
    a: 1,
    valueOf() {
      return this.a++;
    },
  };
  ```

  ```js
  let a = {
    a: 1,
    [Symbol.toPrimitive]: function () {
      return this.a++;
    },
  };
  ```

- 利用数据劫持(Proxy/Object.definedProperty)

  ```js
  let a = new Proxy(
    { i: 1 },
    {
      get: function (target) {
        return () => target.i++;
      },
    }
  );
  ```

- 数组的 toString 接口默认调用数组的 join 方法，重新 join 方法

  ```js
  let a = [1, 2, 3];
  a.join = a.shift;
  ```

- 检测字符串中括号表达式是否平衡

  ```js
  function isBalance(str) {
    function match(a, b) {
      return (
        (a === "(" && b === ")") ||
        (a === ")" && b === "(") ||
        (a === "[" && b === "]") ||
        (a === "]" && b === "[")
      );
    }
    return (
      [...str].reduce((stack, cur) => {
        match(stack[stack.length - 1], cur) ? stack.pop() : stack.push(cur);
        return stack;
      }, []).length === 0
    );
  }

  console.log(isBalance("[()()()]"));
  ```

- 括号是否匹配

  ```js
  function isBalance(str) {
    const brackets = {
      "(": ")",
      "[": "]",
      "{": "}",
    };

    const stack = [],
      leftBrackets = Object.keys(brackets),
      rightBrackets = Object.values(brackets);

    for (let i of str) {
      if (leftBrackets.includes(i)) {
        stack.push(brackets[i]);
      } else if (rightBrackets.includes(i)) {
        if (stack.length === 0 || stack.pop() !== i) {
          return false;
        }
      }
    }

    return stack.length === 0;
  }
  ```

- 求相邻两项最大和

  ```js
  function maxSum(arr) {
    let sumArr = [];
    arr.reduce((prev, cur, index) => {
      sumArr.push(prev + cur);
      return cur;
    });
    return Math.max(...sumArr);
  }
  ```

- 计算对象最大深度

  ```js
  function getDepth(obj, max = 0) {
    if (!obj) return max;
    if (
      ["[object Array]", "[object Object]"].includes(
        Object.prototype.toString.call(obj)
      )
    ) {
      const maxArr = Object.values(obj).map((val) => getDepth(val, max + 1));
      return Math.max(...maxArr, max);
    }
    return max;
  }
  ```

- 请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 和 [A, B, C, D]，合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D]

  ```js
  let a1 = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];
  let a2 = ["A", "B", "C", "D"].map((item) => {
    return item + 3;
  });
  let a3 = [...a1, ...a2].sort().map((item) => item.replace(/3$/, ""));
  ```

- 改造下面的代码，使之输出 0 - 9，写出你能想到的所有解法。

  ```js
  for (var i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
  ```

  解法：

  ```js
  for (let i = 0; i < 10; i++) {
    setTimeout(() => {
      console.log(i);
    }, 1000);
  }
  ```

  ```js
  for (let i = 0; i < 10; i++) {
    ((i) =>
      setTimeout(() => {
        console.log(i);
      }, 1000))(i);
  }
  ```

  ```js
  /**
   *  var timeoutID = scope.setTimeout(function[, delay, param1, param2, ...]);
   *  var timeoutID = scope.setTimeout(function[, delay]);
   *  var timeoutID = scope.setTimeout(code[, delay]);
   *  let intervalID = window.setInterval(func, delay[, param1, param2, ...]);
   *  let intervalID = window.setInterval(code, delay);
   */
  for (let i = 0; i < 10; i++) {
    setTimeout(
      (i) => {
        console.log(i);
      },
      1000,
      i
    );
  }
  ```

- [二进制中 1 的个数](https://leetcode-cn.com/problems/er-jin-zhi-zhong-1de-ge-shu-lcof/solution/mian-shi-ti-15-er-jin-zhi-zhong-1de-ge-shu-wei-yun/)

  请实现一个函数，输入一个整数，输出该数二进制表示中 1 的个数。例如，把 9  表示成二进制是 1001，有 2 位是 1。因此，如果输入 9，则该函数输出 2。

  ```js
  /**
   * 逐位判断
   *
   */
  function hammingWeight(n) {
    let count = 0;
    while (n) {
      count += n & 1; // n & 1 === 0 或者 1
      n >>>= 1; // >>>无符号位移，补0，逻辑移动  >>有符号位移，正数补0，负数补1，算术移动
    }
    return count;
  }
  ```

  ```js
  /**
   * 巧用 n & (n−1)
   * (n−1) 解析： 二进制数字 n 最右边的 1 变成 0 ，此 1 右边的 0 都变成 1 。
   * n & (n−1) 解析： 二进制数字 n 最右边的 1 变成 0 ，其余不变。
   */
  function hammingWeight(n) {
    let count = 0;
    while (n) {
      count++;
      n &= n - 1;
    }
    return count;
  }
  ```

- 打印从 1 到最大的 n 位数

  ```js
  /**
   * 递归生成全排列
   * 无论是 short / int / long ... 任意变量类型，数字的取值范围都是有限的。因此，大数的表示应用字符串 String 类型。
   * 大数越界
   */
  function printNumbers(n) {
    let len = Math.pow(10, n) - 1;
    return Array.from({ length: len }, (item, index) => index + 1);
  }
  ```

- 表示数值的字符串

  请实现一个函数用来判断字符串是否表示数值（包括整数和小数）。例如，字符串"+100"、"5e2"、"-123"、"3.1416"、"0123"都表示数值，但"12e"、"1a3.14"、"1.2.3"、"+-5"、"-1E-16"及"12e+5.4"都不是。

  [有限状态自动机](https://leetcode-cn.com/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/solution/mian-shi-ti-20-biao-shi-shu-zhi-de-zi-fu-chuan-y-2/)

  ```js
  /**
   *
   * @param {string} s
   * @return {boolean}
   */
  function isNumber(str) {
    const states = [
      { " ": 0, s: 1, d: 2, ".": 4 }, // 0. start with 'blank'
      { d: 2, ".": 4 }, // 1. 'sign' before 'e'
      { d: 2, ".": 3, e: 5, " ": 8 }, // 2. 'digit' before 'dot'
      { d: 3, e: 5, " ": 8 }, // 3. 'digit' after 'dot'
      { d: 3 }, // 4. 'digit' after 'dot' (‘blank’ before 'dot')
      { s: 6, d: 7 }, // 5. 'e'
      { d: 7 }, // 6. 'sign' after 'e'
      { d: 7, " ": 8 }, // 7. 'digit' after 'e'
      { " ": 8 }, // 8. end with 'blank'
    ];

    let p = 0,
      t;
    for (i = 0, { length: len } = str; i < len; i++) {
      const letter = str[i];
      if ("0" <= letter && letter <= "9") {
        // digit
        t = "d";
      } else if ("+-".includes(letter)) {
        // sign
        t = "s";
      } else if (".eE ".includes(letter)) {
        // dot, e, blank
        t = letter;
      } else {
        // unknown
        t = "?";
      }

      if (!states[p].hasOwnProperty(t)) {
        return false;
      }
      p = states[p][t];
    }
    return [2, 3, 7, 8].includes(p);
  }
  ```

  ```js
  /**
   * 正则表达式
   */
  function isNumber(str) {
    return /^[+-]?(\d+(\.\d*)?|(\.\d+))(e[+-]?\d+)?$/.test(s.trim());
  }
  ```

  ```js
  /**
   *
   */
  function isNumber(str) {
    str = str.trim();
    if (!str) return false;
    return !Number.isNaN(str);
  }
  ```

- 调整数组顺序使奇数位于偶数前面

  输入一个整数数组，实现一个函数来调整该数组中数字的顺序，使得所有奇数位于数组的前半部分，所有偶数位于数组的后半部分。

  ```js
  /**
   * 相对位置会变化
   * @param {number[]} nums
   * @return {number[]}
   */
  function exchange(nums) {
    let left = 0,
      right = nums.length - 1;
    while (left < right) {
      // 奇数
      if ((nums[left] & 1) !== 0) {
        left++;
        continue;
      }
      // 偶数
      if ((nums[right] & 1) !== 1) {
        right--;
        continue;
      }
      // 交换当前值后各自移动一步
      swap(nums, left++, right--);
    }
    return nums;
  }

  function swap(arr, i, j) {
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  }
  ```

  ```js
  /**
   * 相对位置不变
   * @param {number[]} nums
   * @return {number[]}
   */
  function exchange(nums) {
    let odd = [],
      even = [];
    for (let i = 0, { length: len } = nums; i < len; i++) {
      let val = nums[i];
      (val & 1) === 0 ? even.push(val) : odd.push(val);
    }
    return odd.concat(even);
  }
  ```

- 顺时针打印矩阵

  输入一个矩阵，按照从外向里以顺时针的顺序依次打印出每一个数字。

  ```js
  function spiralOrder(matrix) {
    if (!matrix.length) return [];
    let left = 0,
      right = matrix[0].length - 1,
      top = 0,
      bottom = matrix.length - 1;
    let res = [];
    while (true) {
      // left to right
      for (let i = left; i <= right; i++) {
        res.push(matrix[top][i]);
      }
      if (++top > bottom) break;

      // top to bottom
      for (let i = top; i <= bottom; i++) {
        res.push(matrix[i][right]);
      }
      if (--right < left) break;

      // right to left
      for (let i = right; i >= left; i--) {
        res.push(matrix[bottom][i]);
      }
      if (--bottom < top) break;

      // bottom to top
      for (let i = bottom; i >= top; i--) {
        res.push(matrix[i][left]);
      }
      if (++left > right) break;
    }
    return res;
  }
  ```

- 包含 min 函数的栈

  定义栈的数据结构，请在该类型中实现一个能够得到栈的最小元素的 min 函数在该栈中，调用 min、push 及 pop 的时间复杂度都是 O(1)

  > MinStack minStack = new MinStack();  
  > minStack.push(-2);  
  > minStack.push(0);  
  > minStack.push(-3);  
  > minStack.min(); --> 返回 -3.  
  > minStack.pop();  
  > minStack.top(); --> 返回 0.  
  > minStack.min(); --> 返回 -2.

  ```js
  /**
   * 双栈
   *
   */
  function MinStack() {
    this.stack = []; // 维护push, pop, top
    this.minStack = []; // 非严格降序排列，保证栈顶元素最小
  }

  MinStack.prototype.push = function (x) {
    if (!this.minStack.length || this.minStack[this.minStack.length - 1] >= x) {
      this.minStack.push(x);
    }
    return this.stack.push(x);
  };
  MinStack.prototype.pop = function () {
    let pop = this.stack.pop();
    if (pop === this.minStack[this.minStack.length - 1]) {
      this.minStack.pop();
    }
    return pop;
  };
  MinStack.prototype.top = function () {
    return this.stack[this.stack.length - 1];
  };
  MinStack.prototype.min = function () {
    return this.minStack[this.minStack.length - 1];
  };
  ```

- 二叉搜索树与双向链表

  输入一棵二叉搜索树，将该二叉搜索树转换成一个排序的循环双向链表。要求不能创建任何新的节点，只能调整树中节点指针的指向。

  ```js
  function Node(val, left, right) {
    this.val = val;
    this.left = left;
    this.right = right;
  }

  function treeToDoublyList(root) {
    if (!root) return null;

    let pre = null,
      head = null;
    dfs(root);

    // 头尾节点相连
    head.left = pre;
    pre.right = head;
    return head;

    // 中序遍历
    function dfs(cur) {
      if (!cur) return;
      dfs(cur.left);
      // 当 pre==null 时，root 左侧没有节点,即此时 root 为双向链表中的头节点
      if (pre) pre.right = cur;
      else head = cur;

      cur.left = pre;
      pre = cur;
      dfs(cur.right);
    }
  }
  ```

- 输入一个字符串，打印出该字符串中字符的所有排列。

  ```js
  /**
   * 深度优先遍历， 剪枝
   */
  function permutation(s) {
    s = [...s];
    const { length: len } = s;
    let res = [];

    dfs(0);

    return res;

    function dfs(x) {
      if (x === len - 1) {
        res.push(s.join(""));
        return;
      }

      let set = new Set();
      for (let i = x; i < len; i++) {
        // 剪枝
        if (set.has(s[i])) continue;
        set.add(s[i]);
        swap(i, x); // 交换，将 s[i] 固定在 第 x 位
        dfs(x + 1); // 固定 x+1 位字符
        swap(i, x); // 恢复交换
      }
    }

    function swap(a, b) {
      let tmp = s[a];
      s[a] = s[b];
      s[b] = tmp;
    }
  }
  ```

- 数组中有一个数字出现的次数超过数组长度的一半，请找出这个数字。

  ```js
  /**
   * 深度优先遍历， 剪枝
   * 哈希表统计法： 遍历数组 nums ，用 HashMap 统计各数字的数量，最终超过数组长度一半的数字则为众数。此方法时间和空间复杂度均为 O(N)O(N) 。
   * 数组排序法： 将数组 nums 排序，由于众数的数量超过数组长度一半，因此 数组中点的元素 一定为众数。此方法时间复杂度 O(N log_2 N)O(Nlog2N)。
   * 摩尔投票法： 核心理念为 “正负抵消” ；时间和空间复杂度分别为 O(N)O(N) 和 O(1)O(1) ；是本题的最佳解法。
   */
  function majorityElement(nums) {
    let x = 0; // 众数
    let votes = 0; // 投票
    for (let i = 0, { length: len } = nums; i < len; i++) {
      let num = nums[i];
      if (votes === 0) x = num;
      votes += num === x ? 1 : -1;
    }
    return x;
  }
  ```

- 输入整数数组 arr ，找出其中最小的 k 个数。例如，输入 4、5、1、6、2、7、3、8 这 8 个数字，则最小的 4 个数字是 1、2、3、4。

  ```js
  /**
   * 直接排序
   */
  function getLeastNumbers(arr, k) {
    return arr.sort((a, b) => a - b).slice(0, k);
  }
  ```

  ```js
  /**
   * 快排
   */
  function getLeastNumbers(arr, k) {
    const { length: len } = arr;
    if (k >= len) return arr;
    let left = 0,
      right = len - 1;

    let index = partition(arr, left, right);
    while (index !== k) {
      if (index < k) {
        left = index + 1;
        index = partition(arr, left, right);
      } else if (index > k) {
        right = index - 1;
        index = partition(arr, left, right);
      }
    }

    return arr.slice(0, k);

    function partition(arr, start, end) {
      const pivot = arr[start];
      let left = start + 1,
        right = end;

      while (true) {
        while (left < end && arr[left] <= pivot) left++;
        while (right >= start + 1 && arr[right] >= pivot) right--;

        if (left >= right) {
          break;
        }

        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
      }
      [arr[right], arr[start]] = [arr[start], arr[right]];
      return right;
    }
  }
  ```

- [数据流中的中位数](https://leetcode-cn.com/problems/shu-ju-liu-zhong-de-zhong-wei-shu-lcof/solution/mian-shi-ti-41-shu-ju-liu-zhong-de-zhong-wei-shu-y/)

  ```js
  /**
   *
   * 大顶堆、小顶堆
   */
  MedianFinder = function () {};

  MedianFinder.prototype.addNum = function (num) {};

  MedianFinder.prototype.findMedian = function () {};
  ```

- 连续子数组的最大和

  输入一个整型数组，数组中的一个或连续多个整数组成一个子数组。求所有子数组的和的最大值。（要求时间复杂度为 O(n)。）

  ```js
  /**
   *
   * 动态规划
   * 状态定义： 设动态规划列表 dp ，dp[i] 代表以元素 nums[i] 为结尾的连续子数组最大和。
   * 转移方程： 若 dp[i-1] \leq 0dp[i−1]≤0 ，说明 dp[i - 1]dp[i−1] 对 dp[i]dp[i] 产生负贡献，即 dp[i-1] + nums[i]dp[i−1]+nums[i] 还不如 nums[i]nums[i] 本身大。
   *   当 dp[i - 1] > 0 时：执行 dp[i] = dp[i-1] + nums[i]；
   *   当 dp[i − 1] ≤ 0 时：执行 dp[i] = nums[i]；
   * 初始状态： dp[0] = nums[0]，即以 nums[0]结尾的连续子数组最大和为 nums[0]。
   * 返回值： 返回 dp 列表中的最大值，代表全局最大值。
   */
  function maxSubArray(nums) {
    let res = nums[0];
    for (let i = 1, { length: len } = nums; i < len; i++) {
      nums[i] += Math.max(nums[i - 1], 0);
      res = Math.max(res, nums[i]);
    }
    return res;
  }
  ```

- [输入一个整数 n ，求 1 ～ n 这 n 个整数的十进制表示中 1 出现的次数。](https://leetcode-cn.com/problems/1nzheng-shu-zhong-1chu-xian-de-ci-shu-lcof/solution/mian-shi-ti-43-1n-zheng-shu-zhong-1-chu-xian-de-2/)

  例如，输入 12，1 ～ 12 这些整数中包含 1 的数字有 1、10、11 和 12，1 一共出现了 5 次。

  ```js
  function countDigitOne(n) {
    let digit = 1,
      res = 0;
    let high = Math.floor(n / 10),
      cur = n % 10,
      low = 0;
    while (high !== 0 || cur !== 0) {
      if (cur === 0) res += high * digit;
      else if (cur === 1) res += high * digit + low + 1;
      else res += (high + 1) * digit;
      low += cur * digit;
      cur = high % 10;
      high = Math.floor(high / 10);
      digit *= 10;
    }
    return res;
  }
  ```

- [数字序列中某一位的数字](https://leetcode-cn.com/problems/shu-zi-xu-lie-zhong-mou-yi-wei-de-shu-zi-lcof/solution/mian-shi-ti-44-shu-zi-xu-lie-zhong-mou-yi-wei-de-6/)

  数字以 0123456789101112131415…的格式序列化到一个字符序列中。在这个序列中，第 5 位（从下标 0 开始计数）是 5，第 13 位是 1，第 19 位是 4，等等。

  请写一个函数，求任意第 n 位对应的数字。

  ```js
  function findNthDigit(n) {
    let digit = 1; // 位数
    let start = 1; // 位数起始数字
    let count = 9; // 位数数字数量
    while (n > count) {
      n -= count; // 减掉当前位数数量
      digit += 1; // 增加位数
      start *= 10; // 起始数字
      count = digit * start * 9; // 当前位数数量
    }
    let num = start + Math.floor((n - 1) / digit); // n 所在 数字
    return ("" + num).charAt((n - 1) % digit); // 从 0 开始
  }
  ```

- 把数组排成最小的数

  输入一个非负整数数组，把数组里所有数字拼接起来排成一个数，打印能拼接出的所有数字中最小的一个。

  ```js
  function minNumber(nums) {
    let strs = [];
    const { length: len } = nums;
    for (let i = 0; i < len; i++) {
      strs[i] = String(nums[i]);
    }
    fastSort(strs, 0, len - 1);
    return strs.join("");

    function fastSort(arr, left, right) {
      if (left > right) return;
      let i = left,
        j = right;
      let temp = arr[i];
      while (i < j) {
        while (arr[j] + arr[left] >= arr[left] + arr[j] && i < j) j--; // arr[j] > arr[left]
        while (arr[i] + arr[left] <= arr[left] + arr[i] && i < j) i++; // arr[i] < arr[left]
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      arr[i] = arr[left];
      arr[left] = temp;
      fastSort(arr, left, i - 1);
      fastSort(arr, i + 1, right);
    }
  }
  ```

  ```js
  function minNumber(nums) {
    // 比较 "" + a + b 和 "" + b + a
    return nums.sort((a, b) => "" + a + b - ("" + b + a)).join("");
  }
  ```

- 把数字翻译成字符串

  给定一个数字，我们按照如下规则把它翻译为字符串：0 翻译成 “a” ，1 翻译成 “b”，……，11 翻译成 “l”，……，25 翻译成 “z”。一个数字可能有多个翻译。请编程实现一个函数，用来计算一个数字有多少种不同的翻译方法。

  ```js
  /**
   *  动态规划
   *  f(i) 表示以第i位结尾的前缀串翻译的方案数，
   *  第i位单独翻译对f(i)的贡献值为f(i-1)；如果第i-1位存在，并且第i-1位和第i位形成的数字x满足10<=x<=25,那么就可以把第i-1位和第i位连起来一起翻译，对f(i)的贡献值为f(i-2)，否则为0；
   *  动态转移方程： f(i)= f(i-1) + f(i-2)[i-1>=0, 10 < = x <= 25]
   *  边界条件是f(-1) = 0; f(0) = 1
   *  由于dp[i] 只与 dp[i-1] 有关，因此可以使用两个变量a,b 分别记录dp[i], dp[i-1]
   */
  function translateNum(num) {
    const str = "" + num; // 字符串化
    const len = str.length;
    let dp = [];
    dp[0] = 1;
    dp[1] = 1;
    for (let i = 2; i <= len; i++) {
      let tmp = str.substring(i - 2, i);
      if (tmp >= "10" && tmp <= "25") {
        dp[i] = dp[i - 1] + dp[i - 2];
      } else {
        dp[i] = dp[i - 1];
      }
    }
    return dp[len];
  }
  ```

  ```js
  /**
   *  递归 + 备忘录
   *
   */
  function translateNum(num) {
    const str = "" + num; // 字符串化
    const len = src.length;

    const memo = new Array(len);
    memo[len - 1] = 1;
    memo[len] = 1;

    function dfs(str, index) {
      if (memo[index]) return memo[index];
      const tmp = str[index] + str[index + 1];
      if (tmp >= "10" && tmp <= "25") {
        memo[index] = dfs(str, index + 1) + dfs(str, index + 2);
      } else {
        memo[index] = dfs(str, index + 1);
      }
      return memo[index];
    }
    return dfs(str, 0);
  }
  ```

- 礼物的最大价值

  在一个 `m*n` 的棋盘的每一格都放有一个礼物，每个礼物都有一定的价值（价值大于 0）。你可以从棋盘的左上角开始拿格子里的礼物，并每次向右或者向下移动一格、直到到达棋盘的右下角。给定一个棋盘及其上面的礼物的价值，请计算你最多能拿到多少价值的礼物？

  ```js
  /**
   * 动态规划
   * 设f(i, j)为从棋盘左上角走至单元格（i，j)的礼物最大累计价值，可以得到以下递推关系： f(i, j) = max(f(i-1, j), f(i, j-1)) + grid(i, j)
   *
   *
   */
  function maxValue(grid) {
    if (!grid.length || !grid[0].length) return 0;
    const { length: m } = grid,
      { length: n } = grid[0];
    for (let i = 1; i < m; i++) {
      // 初始化第一列
      grid[i][0] += grid[i - 1][0];
    }
    for (let j = 1; j < n; j++) {
      // 初始化第一行
      grid[0][j] += grid[0][j - 1];
    }

    for (let i = 1; i < m; i++) {
      for (let j = 1; j < n; j++) {
        grid[i][j] += Math.max(grid[i - 1][j], grid[i][j - 1]);
      }
    }
    return grid[m - 1][n - 1];
  }
  ```

- 最长不含重复字符的子字符串

  请从字符串中找出一个最长的不包含重复字符的子字符串，计算该最长子字符串的长度。

  ```js
  /**
   * 动态规划
   * 设动态规划列表 dp，dp[j] 代表以字符 s[j] 为结尾的 “最长不重复子字符串” 的长度。
   *
   *
   */
  function lengthOfLongestSubstring(s) {}
  ```

- 丑数

  我们把只包含质因子 2、3 和 5 的数称作丑数（Ugly Number）。求按从小到大的顺序的第 n 个丑数。

  ```js
  function nthUglyNumber(n) {}
  ```

- 第一个只出现一次的字符

  ```js
  function firstUniqChar(s) {
    for (let char of new Set(s)) {
      if (s.match(new RegExp(char, "g")).length === 1) {
        return char;
      }
    }
    return " ";
  }
  ```

  ```js
  function firstUniqChar(s) {
    for (let i = 0, { length: len } = s; i < len; i++) {
      if (s.indexOf(s[i]) === s.lastIndexOf(s[i])) return s[i];
    }
    return " ";
  }
  ```

- 统计一个数字在排序数组中出现的次数。

  ```js
  /**
   * 二分查找
   * 初始化，左边界0， 右边界 nums.length -1
   * 循环二分：  当闭区间 [i, j] 无元素时跳出；
   * 计算中点 m = (i + j) / 2 （向下取整）；
   * 若 nums[m] < target ，则 target 在闭区间 [m + 1, j] 中，因此执行 i = m + 1；
   * 若 nums[m] > target ，则 target 在闭区间 [i, m -1] 中，因此执行 j = m - 1；
   * 若 nums[m] = target ，则右边界 right 在闭区间 [m+1, j] 中；左边界 left 在闭区间 [i, m-1] 中。因此分为以下两种情况：
   *    若查找 右边界 right ，则执行 i = m + 1 ；（跳出时 i 指向右边界）
   *    若查找 左边界 left ，则执行 j = m - 1 ；（跳出时 j 指向左边界）
   * 返回值： 应用两次二分，分别查找 right 和 left ，最终返回 right - left - 1 即可。
   */
  function search(nums, target) {
    return find(nums, target) - find(nums, target - 1);

    function find(nums, target) {
      let left = 0,
        right = nums.length - 1;
      while (left <= right) {
        let mid = left + Math.floor((right - left) / 2);
        if (nums[mid] <= target) left = mid + 1;
        else right = mid - 1;
      }
      return left;
    }
  }
  ```

- 一个长度为 n-1 的递增排序数组中的所有数字都是唯一的，并且每个数字都在范围 0 ～ n-1 之内。在范围 0 ～ n-1 内的 n 个数字中有且只有一个数字不在该数组中，请找出这个数字。

  ```js
  /**
   * 二分查找
   * 左子数组： nums[i] = i;
   * 右子数组： nums[i] !== i;
   * 缺失的数字等于右子数组的首位元素对应的索引
   */
  function missingNumber(nums) {
    let left = 0,
      right = nums.length - 1;
    while (left <= right) {
      let mid = left + Math.floor((right - left) / 2);
      if (nums[mid] === mid) left = mid + 1;
      else right = mid - 1;
    }
    return left;
  }
  ```

- 位运算

  - 一个整型数组 nums 里除两个数字之外，其他数字都出现了两次。请写程序找出这两个只出现一次的数字。要求时间复杂度是 O(n)，空间复杂度是 O(1)。

    ```js
    /**
     * 异或的性质： 两个数字异或的结果a^b是将 a 和 b 的二进制每一位进行运算，得出的数字。 运算的逻辑是 如果同一位的数字相同则为 0，不同则为 1
     * 任何数和本身异或则为 0
     * 任何数和 0 异或是 本身
     * 异或满足交换律。 即 a ^ b ^ c ，等价于 a ^ c ^ b
     *
     *
     * 先对所有数字进行一次异或，得到两个出现一次的数字的异或值。
     * 在异或结果中找到任意为 1 的位。
     * 根据这一位对所有的数字进行分组。
     * 在每个组内进行异或操作，得到两个数字。
     */
    function singleNumbers(nums) {
      let sum = 0;
      let res = [];
      for (let i = 0; i < nums.length; i++) {
        sum ^= nums[i];
      }
      let lowBit = 1;
      while ((lowBit & sum) == 0) lowBit <<= 1;
      for (let i = 0; i < nums.length; i++) {
        const num = nums[i];
        if ((num & lowBit) === 0) {
          res[0] ^= num;
        } else {
          res[1] ^= num;
        }
      }
      return res;
    }
    ```

  - 在一个数组 nums 中除一个数字只出现一次之外，其他数字都出现了三次。请找出那个只出现一次的数字。

    ```js
    /**
     * 8bit 32位，统计每位1出现的次数，与3求余，如果不等于 0 说明只出现一次的那个数该位为1；
     *
     *
     */
    function singleNumber(nums) {
      const len = nums.length;
      let res = 0;
      for (let i = 0; i < 32; i++) {
        let count = 0;
        const bit = 1 << i;
        // 计算当前位 1 的数量
        for (let j = 0; j < len; j++) {
          if ((bit & nums[j]) === bit) {
            count++;
          }
        }

        if (count % 3 !== 0) {
          res |= bit;
        }
      }
      return res;
    }
    ```

  - 在一个数组 nums 中除一个数字只出现一次之外，其他数字都出现了了两次。请找出那个只出现一次的数字。

    ```js
    function singleNumber(nums) {
      let res = 0;
      for (let i = 0, { length: len } = nums; i < len; i++) {
        res ^= nums[i];
      }
      return res;
    }
    ```

- 输入一个递增排序的数组和一个数字 s，在数组中查找两个数，使得它们的和正好是 s。如果有多对数字的和等于 s，则输出任意一对即可。

  ```js
  /**
   * 对撞双指针
   *
   *
   */
  function twoSum(nums, target) {
    let i = 0,
      j = nums.length - 1;
    while (i < j) {
      const s = nums[i] + nums[j];
      // 如果 s 小于 target, 那么 nums[i] 和任何一个数的和都小于 target, 所以 i++
      // 如果 s 大于 target, 那么 nums[j] 和任何一个数的和都大于 target, 所以 j--
      if (s < target) i++;
      else if (s > target) j--;
      else return [nums[i], nums[j]];
    }
    return [];
  }
  ```

- 输入一个正整数 target ，输出所有和为 target 的连续正整数序列（至少含有两个数）。

  序列内的数字由小到大排列，不同序列按照首个数字从小到大排列。

  ```js
  /**
   * 暴力
   *
   */
  function findContinuousSequence(target) {
    let res = [];
    let tmp = [];
    let sum = 0;
    for (let i = 1; i <= target; i++) {
      for (let j = i; j <= target; j++) {
        if (sum === target) {
          res.push(tmp);
          tmp = [];
          sum = 0;
          break;
        }
        if (j > target || sum + j > target) {
          tmp = [];
          sum = 0;
          break;
        }
        sum += j;
        tmp.push(j);
      }
    }
    return res;
  }
  ```

- 输入一个英文句子，翻转句子中单词的顺序，但单词内字符的顺序不变。为简单起见，标点符号和普通字母一样处理。例如输入字符串"I am a student. "，则输出"student. a am I"。

  ```js
  function reverseWords(s) {
    return s
      .split(" ")
      .reverse()
      .join(" ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }
  ```

  ```js
  /**
   * 双指针法，记录单词的左（i）右(len)边界
   *
   *
   */
  function reverseWords(s) {
    s = s.trim();
    let { length: len } = s;
    let i = len;
    let res = "";
    while (i >= 0) {
      while (i >= 0 && s[i] !== " ") i--; //搜索首个空格
      res += s.substring(i + 1, len + 1) + " ";
      while (i >= 0 && s[i] === " ") i--; // 跳过单词间空格
      len = i;
    }
    return res.trim();
  }
  ```

- 字符串的左旋转操作是把字符串前面的若干个字符转移到字符串的尾部。请定义一个函数实现字符串左旋转操作的功能。比如，输入字符串"abcdefg"和数字 2，该函数将返回左旋转两位得到的结果"cdefgab"。

  ```js
  function reverseLeftWords(s, n) {
    return s.slice(n) + s.slice(0, n);
  }
  ```

  ```js
  /**
   *
   */
  function reverseLeftWords(s, n) {
    let res = "";
    const len = s.length;
    for (let i = n; i < n + len; i++) {
      res += s[i % len];
    }
    return res;
  }
  ```

- 给定一个数组 nums 和滑动窗口的大小 k(k>=1 &&k <=nums.length)，请找出所有滑动窗口里的最大值。

  ```js
  function maxSlidingWindow(nums, k) {
    if (nums.length === 0 || k === 0) return [];
    let deque = []; // 双端队列， 单调队列
    let res = [];
    // 未形成窗口
    for (let i = 0; i < k; i++) {
      let len;

      while ((len = deque.length) && deque[len - 1] < nums[i]) {
        deque.pop();
      }
      deque.push(nums[i]);
    }
    res[0] = deque[0];
    // 形成窗口后
    for (let i = k; i < nums.length; i++) {
      // 要删除的为最大值是，最大值出队
      if (deque[0] === nums[i - k]) {
        deque.shift();
      }
      // 删除右边界移动后小于右边界的值
      while (deque.length && deque[deque.length - 1] < nums[i]) {
        deque.pop();
      }
      deque.push(nums[i]);
      res[i - k + 1] = deque[0];
    }
    return res;
  }
  ```

- 请定义一个队列并实现函数 max_value 得到队列里的最大值，要求函数 max_value、push_back 和 pop_front 的均摊时间复杂度都是 O(1)。若队列为空，pop_front 和 max_value  需要返回 -1

  ```js
  function MaxQueue() {
    this.queue = [];
    this.deque = [];
  }

  MaxQueue.prototype.max_value = function () {
    if (!this.deque.length) {
      return -1;
    }
    return this.deque[0];
  };
  MaxQueue.prototype.push_back = function (value) {
    let len;
    while ((len = this.deque.length) && this.deque[len - 1] < value) {
      this.deque.pop();
    }
    this.deque.push(value);
    this.queue.push(value);
  };
  MaxQueue.prototype.pop_front = function () {
    if (!this.queue.length) return -1;
    let ans = this.queue.shift();
    if (ans === this.deque[0]) {
      this.deque.shift();
    }
    return ans;
  };
  ```

- 求 `1+2+...+n` ，要求不能使用`乘除法、for、while、if、else、switch、case`等关键字及条件判断语句`（A?B:C）`。

  ```js
  function sumNums(n) {
    n > 1 && (n += sumNums(n - 1));
    return n;
  }
  ```

- 假设把某股票的价格按照时间先后顺序存储在数组中，请问买卖该股票一次可能获得的最大利润是多少？

  ```js
  /**
   * 动态规划
   * dp[i] 表示以 prices[i] 为结尾的子数组的最大利润
   * 前 i 日的最大利润 = max(前（i-1)日的最大利润，第 i 日价格 - 前 i 日最低价格
   * dp[i] = max(dp[i-1], prices[i]-min(prices[0:i]))
   * 初始状态： dp[0] = 0,即首日利润为 0
   * 返回值： dp[n-1], n 为 dp 列表长度。
   *
   */
  function maxProfit(prices) {
    let cost = Number.MAX_VALUE,
      profit = 0; // 收益
    for (let i = 0; i < prices.length; i++) {
      const price = prices[i];
      cost = Math.min(cost, price); // 前 i 日最低价
      profit = Math.max(profit, price - cost); // 最大收益
    }
    return profit;
  }
  ```

- 0,1,,n-1 这 n 个数字排成一个圆圈，从数字 0 开始，每次从这个圆圈里删除第 m 个数字。求出这个圆圈里剩下的最后一个数字。例如，0、1、2、3、4 这 5 个数字组成一个圆圈，从数字 0 开始每次删除第 3 个数字，则删除的前 4 个数字依次是 2、0、4、1，因此最后剩下的数字是 3。

  ```js
  // 反推
  function lastRemaining(n, m) {
    let pos = 0;
    for (let i = 2; i <= n; i++) {
      pos = (pos + m) % i;
    }
    return pos;
  }
  ```

- 从扑克牌中随机抽 5 张牌，判断是不是一个顺子，即这 5 张牌是不是连续的。2 ～ 10 为数字本身，A 为 1，J 为 11，Q 为 12，K 为 13，而大、小王为 0 ，可以看成任意数字。A 不能视为 14。

  ```js
  /**
   *
   *
   *
   */
  function isStraight(nums) {
    let repeat = new Set();
    let max = 0,
      min = 14;
    for (let i = 0, len = nums.length; i < len; i++) {
      const num = nums[i];
      if (num === 0) continue; // 跳过大王
      max = Math.max(max, num); // 最大牌
      min = Math.min(min, num); // 最小牌
      if (repeat.has(num)) return false; // 有重复 return false；
      repeat.add(num);
    }
    return max - min < 5; // 最大牌 - 最小牌 < 5, 则可构成顺子
  }
  ```

- 把 n 个骰子扔在地上，所有骰子朝上一面的点数之和为 s。输入 n，打印出 s 的所有可能的值出现的概率。

  你需要用一个浮点数数组返回答案，其中第 i 个元素代表这 n 个骰子所能掷出的点数集合中第 i 小的那个的概率。

  ```js
  function twoSum(n) {}
  ```

- 实现一个函数，对一系列的版本号进行从小到大的排序

  ```js
  /**
   * ['1.0.0', '2.12.1', '1.2.3.4.5.6.7', '0.18.1']
   *
   *
   */
  function sortVersion(list) {
    return list.sort((a, b) => (a >= b ? 1 : -1));
  }

  function sortVersion(arr) {
    let maxCount = 0;
    for (let i = 0, len = arr.length; i < len; i++) {
      maxCount = Math.max(maxCount, arr[i].split(".").length);
    }

    for (let i = maxCount - 1; i >= 0; i--) {
      arr.sort(function (version1, version2) {
        let v1 = version1.split(".");
        let v2 = version2.split(".");

        v1 = v1[i] || "";
        v2 = v2[i] || "";

        if (v1 === v2) return 0;
        else {
          const v1Num = +v1.replace(/[a-zA-Z]*$/, "");
          const v2Num = +v2.replace(/[a-zA-Z]*$/, "");
          const v1Str = v1.replace(/^\d*/, "");
          const v2Str = v2.replace(/^\d*/, "");

          if (v1Num > v2Num) return 1;
          else if (v1Num < v2Num) return -1;
          else {
            return v1Str > v2Str ? 1 : -1;
          }
        }
      });
    }
  }
  ```

- 实现一个简单的仓储系统，可以不断的转入和转出货物，货物最多有两层子类目，数字代表子类目转入转出的数量，转出时不能出现爆仓情况

  ```js
  /**
   * {
   *   productA: {
   *      a: 1,
   *      b: 2,
   *      c: {
   *       c1: 1,
   *       c2: 3,
   *      }
   *   },
   *   productB: {
   *      e: 6
   *   }
   * }
   * 爆仓情况： 如转入 {productA: {a: 3, c: 1}} 转出 {productA: {a: 4} } 就会发生子类目 a 爆仓，此时要返回报错。
   * plus: 1. 考虑子类目扩展深度（不止两层） 2. 有单元测试
   */
  class Depository {
    constructor(options) {
      this.cargos = {};
    }

    // 转入货物
    transferIn(cargo, originCargos = this.cargos) {
      if (typeof cargo !== "object") return false;
      Object.entries(cargo).forEach(([product, value]) => {
        if (typeof value === "object") {
          if (!originCargos[product]) {
            originCargos[product] = {};
          }
          this.transferIn(value, originCargos[product]);
        } else {
          if (!originCargos[product]) {
            originCargos[product] = 0;
          }
          originCargos[product] += value;
        }
      });
      return true;
    }

    // 转出货物
    transferOut(cargo, originCargos = this.cargos) {
      if (typeof cargo !== "object") return false;

      if (!this.canTransferOut(cargo, originCargos)) return false;

      this._transferOut(cargo, originCargos);
      return true;
    }

    canTransferOut(cargo, originCargos) {
      return Object.entries(cargo).every(([product, value]) => {
        if (!originCargos.hasOwnProperty(product)) return false;
        if (typeof value === "object") {
          return this.canTransferOut(value, originCargos[product]);
        } else {
          return originCargos[product] >= value;
        }
      });
    }

    _transferOut(cargo, originCargos) {
      Object.entries(cargo).forEach(([product, value]) => {
        if (typeof value === "object") {
          this._transferOut(value, originCargos[product]);
        } else {
          originCargos[product] -= value;
        }
      });
    }
  }
  ```

- 地址处理

  ```js
  const addressList = [
    {
      province: "四川省",
      city: "成都市",
      county: "金牛区",
    },
    {
      province: "四川省",
      city: "绵阳市",
      county: "平武县",
    },
    {
      province: "上海市",
      city: "上海市",
      county: "长宁区",
    },
  ];

  const keys = ["province", "city", "county"];

  function fn(addressList, level = 0) {
    if (level >= keys.length) return [];
    if (!addressList.length) return [];
    // 字典
    const field = keys[level];
    const obj = addressList.reduce((dic, address) => {
      const key = address[field];
      dic[key] ? dic[key].push(address) : (dic[key] = [address]);
      return dic;
    }, {});
    return Object.entries(obj).map(([key, value]) => {
      return {
        type: field,
        name: key,
        children: fn(value, level + 1),
      };
    });
  }
  ```

- 树

  ```js
  // input = [{id: 4, pid: 3}, {id: 1}, {id: 3, pid: 1}, {id: 2}]
  // output = [{id: 1, children: [{id: 3, children: [{id: 4}]}]}, {id: 2}]
  function mergeDeepNodeList(_nodeList) {
    let ret = [];
    let obj = {};
    const nodeList = [..._nodeList];
    while (nodeList.length) {
      const cur = nodeList.shift();
      cur.children = obj[cur.id] = obj[cur.id] || [];
      if (cur.pid) {
        obj[cur.pid] ? obj[cur.pid].push(cur) : (obj[cur.pid] = [cur]);
      } else {
        ret.push(cur);
      }
    }
    return ret;
  }
  ```
