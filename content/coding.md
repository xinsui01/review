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
      .replace(/^\d+/, m => m.replace(/(\d{1,3})(?=(?:\d{3})+$)/g, "$1,"));
    ```

- 有如下对象 testData, 请将该对象所有 key 从下划线转换为大驼峰

  ```js
  var testData = {
    aa_bb: 123,
    bb_cc_dd: [1, 2, 3]
  };

  testData.cc = [
    { abc_xy: testData },
    { aa_bb_cc: testData.bb_cc_dd },
    1,
    "st_ri_n_g"
  ];
  testData.dd_xyz_cc_bb_ax = {
    c: testData.cc,
    xy: [1, 2, 3, null, undefined, false],
    z: undefined,
    is_string: false,
    is_array: function() {}
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
      Object.keys(data).forEach(key => {
        const _key = strToCamelCase(key);
        obj[_key] = _mapKeysToCamelCase(data[key], map);
      });

      return obj;
    }

    const isBaseType = (function() {
      const baseTypes = [
        "Number",
        "String",
        "Boolean",
        "Null",
        "Undefined",
        "Function"
      ].map(item => `[object ${item}]`);
      return val => {
        const tp = Object.prototype.toString.call(val);
        return baseTypes.includes(tp);
      };
    })();

    function strToCamelCase(key) {
      return key
        .split("_")
        .map(key =>
          key.replace(/\b(\w)(\w*)/g, function($0, $1, $2) {
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
    ("" + str).replace(/./g, letter => {
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
      arr.forEach(item => {
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
        child.onmouseover = function(evt) {
          if (evt && evt.stopPropagation) {
            evt.stopPropagation();
          } else {
            evt.cancelBubble = true; // IE 阻止事件冒泡
          }
          this.style.border = "1px solid #ccc";
        };

        child.onmouseout = function() {
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

- 排序算法

  - 冒泡排序

    ```js
    /**
     * 每次比较相邻两个值
     */
    function bubbleSort(arr) {
      if (arr === null || arr.length === 0) return arr;

      const length = arr.length;

      /**
       * 从前往后冒泡
       */
      // for(let i=0; i < length -1; i++) {
      //   for(let j=0; j < length - 1 - i; j++){
      //     if(arr[j]>arr[j+1]){
      //       swap(arr, j, j+1);
      //     }
      //   }
      // }

      /**
       * 从后往前冒泡
       */
      for (let i = 0, len = length - 1; i < len; i++) {
        for (let j = length - 1; j > i; j--) {
          if (arr[j] < arr[j - 1]) {
            swap(arr, j, j - 1);
          }
        }
      }

      function swap(arr, i, j) {
        // let temp = arr[i];
        // arr[i] = arr[j];
        // arr[j] = temp;
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }

      return arr;
    }
    ```

  - 选择排序

    ```js
    function selectSort(arr) {
      if (arr === null || arr.length === 0) return arr;

      for (let i = 0, len = arr.length - 1; i < len; i++) {
        let minIndex = i;
        for (let j = i + 1, len = arr.length; j < len; j++) {
          if (arr[minIndex] > arr[j]) {
            minIndex = j;
          }
        }

        if (minIndex !== i) {
          swap(arr, i, minIndex);
        }
      }

      function swap(arr, i, j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    ```

  - 插入排序

    ```js
    function insertSort(arr) {
      if (arr === null || arr.length === 0) return arr;

      for (let i = 1, len = arr.length; i < len; i++) {
        // 假设第一个数是正确的
        let j = i,
          target = arr[i]; //待插入的

        //后移
        while (j > 0 && target < arr[j - 1]) {
          arr[j] = arr[j - 1];
          j--;
        }

        //插入
        arr[j] = target;
      }

      return arr;
    }
    ```

  - 快速排序

    ```js
    /**
     * 1. 选择一个基准元素
     * 2. 将所有小于基准值得元素放在基准值的左边，所有大于基准值的元素放在基准值的右边
     * 3. 对分割后的两个子序列重复上述步骤
     */
    function quickSort(arr) {
      if (arr === null || arr.length === 0) return arr;

      let left = [],
        right = [],
        current = arr.splice(0, 1); // 注意splice 后数据的长度少了一个

      for (let i = 0, len = arr.length; i < len; i++) {
        if (arr[i] < current) {
          left.push(arr[i]); // 放在左边
        } else {
          right.push(arr[i]); // 放在右边
        }
      }

      return quickSort(left).concat(current, quickSort(right)); // 递归
    }
    ```

- 二分查找

```js
/**
 * 递归
 */
function binarySearch(arr, target, start = 0, end = arr.length) {
  if (start > end) {
    return -1;
  }
  let midIndex = Math.floor((start + end) / 2);
  let mid = arr[midIndex];

  if (target === mid) {
    return midIndex;
  }

  if (target < mid) {
    return binarySearch(arr, target, 0, midIndex - 1);
  }

  if (target > mid) {
    return binarySearch(arr, target, midIndex + 1, end);
  }

  return -1;
}
```

```js
/**
 * 非递归
 */
function binarySearch(arr, target) {
  let min = 0;
  let max = arr.length - 1;

  while (min <= max) {
    let mid = Math.floor((min + max) / 2);
    if (target < arr[mid]) {
      max = mid - 1;
    } else if (target > arr[mid]) {
      min = mid + 1;
    } else {
      return mid;
    }
  }
  return -1;
}
```

- 二维数组查找

```js
function binarySearch(arr, target) {
  let i = 0;
  let j = arr[i].length - 1;

  while (i < arr.length && j >= 0) {
    if (target < arr[i][j]) {
      j--;
    } else if (target > arr[i][j]) {
      i++;
    } else {
      return [i, j];
    }
  }
  return -1;
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
    return arr.filter(item => {
      if (obj[item]) {
        return false;
      }

      return (obj[item] = true);
    });
  }
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

    validItems.forEach(item => {
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
    return arr.filter(item => isPureObject(item) && item.type && item.content);
  }

  function isPureObject(obj) {
    return Object.prototype.toString.call(obj).slice(8, -1) === "Object";
  }

  function resultFormat(obj) {
    return Object.keys(obj).map(type => {
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
  let promise = new Promise(resolve => {
    setTimeout(() => {
      console.log("A");
      resolve();
    }, 4000);
  });

  promise
    .then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log("B");
          resolve();
        }, 3000);
      });
    })
    .then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log("C");
          resolve();
        }, 2000);
      });
    })
    .then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log("D");
          resolve();
        }, 1000);
      });
    });
  ```

- 数组中的 Promise 顺序执行

```js
function sequenceTasks(arr) {
  return arr.reduce(function(prevPromise, promiseFn, index) {
    return prevPromise.then(function() {
      return promiseFn();
    });
  }, Promise.resolve());
}
```

```js
function sequenceTasks(arr) {
  let p = Promise.resolve();
  arr.forEach(promiseFn => {
    p = p.then(function() {
      return promiseFn();
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
String.prototype.repeat = function(count) {
  return Array(count)
    .fill(this)
    .join("");
};

String.prototype.repeat = function(count) {
  return Array(count + 1).join(this);
};

String.prototype.repeat = function(count) {
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

  CodingMan.prototype.sleep = function(time) {
    const curTime = Date.now();
    const delay = time * 1000;
    setTimeout(() => {
      while (Date.now() - curTime < delay) {}
      console.log(`Wake up after ${time}s`);
    }, 0);
    return this;
  };

  CodingMan.prototype.sleepFirst = function(time) {
    const curTime = Date.now();
    const delay = time * 1000;
    while (Date.now() - curTime < delay) {}
    console.log(`Wake up after ${time}s`);
    return this;
  };

  CodingMan.prototype.eat = function(food) {
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
    }
  };
  ```

  ```js
  let a = {
    a: 1,
    [Symbol.toPrimitive]: function() {
      return this.a++;
    }
  };
  ```

- 利用数据劫持(Proxy/Object.definedProperty)

```js
let a = new Proxy(
  { i: 1 },
  {
    get: function(target) {
      return () => target.i++;
    }
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
    const maxArr = Object.values(obj).map(val => getDepth(val, max + 1));
    return Math.max(...maxArr, max);
  }
  return max;
}
```

- 请把俩个数组 [A1, A2, B1, B2, C1, C2, D1, D2] 和 [A, B, C, D]，合并为 [A1, A2, A, B1, B2, B, C1, C2, C, D1, D2, D]

```js
let a1 = ["A1", "A2", "B1", "B2", "C1", "C2", "D1", "D2"];
let a2 = ["A", "B", "C", "D"].map(item => {
  return item + 3;
});
let a3 = [...a1, ...a2].sort().map(item => item.replace(/3$/, ""));
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
  (i =>
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
    i => {
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
    "{": "}"
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
