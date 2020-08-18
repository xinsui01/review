# 编程

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
  let promise = new Promise((resolve) => {
    setTimeout(() => {
      console.log("A");
      resolve();
    }, 4000);
  });

  promise
    .then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("B");
          resolve();
        }, 3000);
      });
    })
    .then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("C");
          resolve();
        }, 2000);
      });
    })
    .then(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("D");
          resolve();
        }, 1000);
      });
    });
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
      let diffIndex = arr.indexOf(diff);
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
    return result.concat(left, right);
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
    if (obj === null) return max;
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
   *
   */
  ```

  ```js
  // 大数越界
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

    let pre, head;
    dfs(root);

    // 头尾节点相连
    head.left = pre;
    pre.right = head;
    return head;

    // 中序遍历
    function dfs(root) {
      if (!root) return;
      dfs(root.left);
      // 当 pre==null 时，root 左侧没有节点,即此时 root 为双向链表中的头节点
      if (pre) pre.right = root;
      else head = root;

      root.left = pre;
      pre = root;
      dfs(root.right);
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
