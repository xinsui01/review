// const fs = require('fs')

// const file = fs.createWriteStream('./big.file')

// for (let i = 0; i < 1e6; i++) {
//   file.write(
//     'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n'
//   )
// }

// file.end()

// const fs = require('fs')
// const server = require('http').createServer()

// server.on('request', (req, res) => {
//   fs.createReadStream('./big.file').pipe(res)
// })

// server.listen(8000, () => {
//   console.log('server listen at localhost:8000')
// })

// const {Writable} = require('stream')
// const outStream = new Writable({
//   write(chunk, encoding,callback) {
//     console.log(chunk.toString())
//     callback();
//   }
// })

// process.stdin.pipe(outStream);

// process.stdin.pipe(process.stdout)

// const { Readable } = require('stream')
// const inStream = new Readable({})

// inStream.push('ABCDEFGHIJKLM')
// inStream.push('NOPQRSTUVWXYZ')

// inStream.push(null)
// inStream.push('NOPQRSTUVWXYZ')

// inStream.pipe(process.stdout)

// const { Readable } = require('stream')

// const inStream = new Readable({
//   read(size) {
//     console.log('size: ', size)
//     this.push(String.fromCharCode(this.currentCharCode++))
//     if (this.currentCharCode > 90) {
//       this.push(null)
//     }
//   }
// })

// inStream.currentCharCode = 65
// inStream.pipe(process.stdout)

// const { Duplex } = require('stream')

// const inOutStream = new Duplex({
//   write(chunk, encoding, callback) {
//     console.log(chunk.toString())
//     callback()
//   },

//   read(size) {
//     this.push(String.fromCharCode(this.currentCharCode++))
//     if (this.currentCharCode > 90) {
//       this.push(null)
//       process.exit(0)
//     }
//   }
// })

// inOutStream.currentCharCode = 65

// process.stdin.pipe(inOutStream).pipe(process.stdout)

// const { Transform } = require('stream')
// const upperCaseTr = new Transform({
//   transform(chunk, encoding, callback) {
//     this.push(chunk.toString().toUpperCase())
//     callback()
//   }
// })

// process.stdin.pipe(upperCaseTr).pipe(process.stdout)

// const { Transform } = require('stream')

// const commaSplit = new Transform({
//   readableObjectMode: true,
//   transform(chunk, encoding, callback) {
//     this.push(
//       chunk
//         .toString()
//         .trim()
//         .split(',')
//     )
//     callback()
//   }
// })

// const arrayToObj = new Transform({
//   readableObjectMode: true,
//   writableObjectMode: true,
//   transform(chunk, encoding, callback) {
//     const obj = {}
//     for (let i = 0; i < chunk.length; i += 2) {
//       obj[chunk[i]] = chunk[i + 1]
//     }
//     console.log('obj: ', obj)
//     this.push(obj)
//     callback()
//   }
// })

// const objToStr = new Transform({
//   writableObjectMode: true,
//   transform(chunk, encoding, callback) {
//     console.log('chunk: ', chunk.toString(encoding))
//     console.log('encoding:', encoding)
//     this.push(JSON.stringify(chunk.toString(encoding)) + '\n', encoding)
//     callback()
//   }
// })

// process.stdin
//   // .pipe(commaSplit)
//   // .pipe(arrayToObj)
//   .pipe(objToStr)
//   .pipe(process.stdout)

// const fs = require("fs");
// const zlib = require("zlib");
// const file = process.argv[2];
// console.log("argv: ", process.argv);

// const { Transform } = require("stream");
// const { exception } = require("console");

// const transform = new Transform({
//   transform(chunk, encoding, callback) {
//     process.stdout.write(".");
//     callback(null, chunk);
//   },
// });

// fs.createReadStream(file)
//   .pipe(zlib.createGzip())
//   // .on('data', () => {
//   //   process.stdout.write('.')
//   // })
//   .pipe(transform)
//   .pipe(fs.createWriteStream(file.split(".")[0] + ".gz"))
//   .on("finish", () => process.stdout.write("\ndone"));

// var findRepeatNumber = function (nums) {
//   let caches = {};
//   for (let i = 0, { length: len } = nums; i < len; i++) {
//     let val = nums[i];
//     console.log(val, caches[val] > 1);
//     if (caches[val] > 1) return val;
//     caches[val] = (caches[val] || 0) + 1;
//   }
// };

// const ret = findRepeatNumber([2, 3, 1, 0, 2, 5, 3]);
// console.log(ret);

// let nums = [0, 1, 2, 3, 4, 11, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

// // var findRepeatNumber = function (nums) {
// //   let set = new Set();
// //   for (let val of nums) {
// //     const { size } = set;
// //     set.add(val);
// //     if (set.size === size) return val;
// //   }
// // };

// function findRepeatNumber(nums) {
//   for (let i = 0, { length: len } = nums; i < len; i++) {
//     // 检查下标为 i 的元素是否放在了 nums[i] 位置
//     while ((num = nums[i]) !== i) {
//       if (num === nums[num]) {
//         return num;
//       }
//       [nums[nums[i]], nums[i]] = [nums[i], nums[nums[i]]];
//     }
//   }
// }

// console.log(findRepeatNumber(nums));

// var matrix = [
//   [1, 4, 7, 11, 15],
//   [2, 5, 8, 12, 19],
//   [3, 6, 9, 16, 22],
//   [10, 13, 14, 17, 24],
//   [18, 21, 23, 26, 30],
// ];

// var findNumberIn2DArray = function (matrix, target) {
//   const { length: n } = matrix; // 行
//   const { length: m } = matrix[0] || []; // 列

//   if (m === 0 || matrix[0][0] > target || matrix[n - 1][m - 1] < target)
//     return false;

//   for (let i = 0; i < n; i++) {
//     if (binarySearch(matrix[i], target)) {
//       return true;
//     }
//   }
//   return false;

//   function binarySearch(arr, target) {
//     let low = 0,
//       high = arr.length - 1;
//     if (arr[low] > target || arr[high] < target) {
//       return false;
//     }
//     if (arr[low] === target || arr[high] === target) {
//       return true;
//     }
//     while (low <= high) {
//       let mid = Math.floor(low + ((high - low) >> 1));
//       if (arr[mid] === target) {
//         return true;
//       } else if (arr[mid] > target) {
//         high = mid - 1;
//       } else {
//         low = mid + 1;
//       }
//     }
//   }
// };

// var findNumberIn2DArray = function (matrix, target) {
//   const { length: n } = matrix; // 行
//   const { length: m } = matrix[0] || []; // 列

//   if (m === 0 || matrix[0][0] > target || matrix[n - 1][m - 1] < target)
//     return false;

//   for (let i = 0, minLen = Math.min(n, m); i < minLen; i++) {
//     const vFound = binarySearch(matrix, target, i, true); // 垂直方向是否找到
//     const hFound = binarySearch(matrix, target, i, false); // 水平是否找到
//     if (vFound || hFound) {
//       return true;
//     }
//   }
//   return false;

//   function binarySearch(matrix, target, start, vertical) {
//     let low = start,
//       high = vertical ? matrix.length - 1 : matrix[0].length - 1;
//     while (low <= high) {
//       let mid = Math.floor(low + ((high - low) >> 1));
//       let val = vertical ? matrix[mid][start] : matrix[start][mid];
//       if (vertical) {
//         if (val === target) {
//           return true;
//         } else if (val > target) {
//           high = mid - 1;
//         } else {
//           low = mid + 1;
//         }
//       } else {
//         if (val === target) {
//           return true;
//         } else if (val > target) {
//           high = mid - 1;
//         } else {
//           low = mid + 1;
//         }
//       }
//     }
//   }
// };

// matrix.forEach((i) => {
//   i.forEach((it) => {
//     console.log(findNumberIn2DArray(matrix, it));
//   });
// });
// console.log(findNumberIn2DArray(matrix, 30));

// for (let index = 0; index < array.length; index++) {
//   const element = array[index];

// }

// for(let i = 0, len = ; i < len; i++) {}

// var replaceSpace = function (str) {
//   const { length: len } = str;
//   let newStr = "";
//   let i = 0;
//   while (i < len) {
//     const letter = str[i];
//     newStr += letter === " " ? "%20" : letter;
//     i++;
//   }
//   return newStr;
// };

// console.log(replaceSpace("We are happy."));

// function TreeNode(val) {
//   this.val = val;
//   this.left = this.right = null;
// }

// var buildBTree = function (preOrder, inOrder) {
//   if (preOrder.length === 0 || inOrder.length === 0) {
//     return null;
//   }
//   let root = new TreeNode(preOrder[0]);
//   let stack = [root];
//   let inOrderIndex = 0;
//   for (let i = 1, { length: len } = preOrder; i < len; i++) {
//     const preOrderVal = preOrder[i];
//     let node = stack.pop();
//     stack.push(node);
//     if (node.val !== inOrder[inOrderIndex]) {
//       node.left = new TreeNode(preOrderVal);
//       stack.push(node.left);
//     } else {
//       let _node;
//       while (
//         stack.length &&
//         stack.push((_node = stack.pop())) &&
//         _node.val === inOrder[inOrderIndex]
//       ) {
//         node = stack.pop();
//         inOrderIndex++;
//       }
//       node.right = new TreeNode(preOrderVal);
//       stack.push(node.right);
//     }
//   }
//   return root;
// };

// console.log(buildBTree([1, 2, 3], [2, 3, 1]));
// // console.log(buildBTree([3, 9, 20, 15, 7], [9, 3, 15, 20, 7]));

// function fibonacci(n) {
//   if (n < 2) return n;
//   let a = 0,
//     b = 1;
//   let i = 2;
//   while (i <= n) {
//     [a, b] = [b, (a + b) % 1000000007];
//     i++;
//   }
//   return b;
// }
// function fibonacci(n, a = 1, b = 1) {
//   if (n < 2) return n;
//   if (n === 2) return b;
//   return fibonacci(n - 1, b, (a + b) % 1000000007);
// }
// //107920472
// console.log(fibonacci(3));

// var numWays = function (n) {
//   if (n <= 1) return 1;
//   let dp = [1, 1, 2];
//   for (let i = 2; i <= n; i++) {
//     dp[i] = (dp[i - 1] + dp[i - 2]) % 1000000007;
//   }
//   return dp[n];
// };

// console.log(numWays(44));

// function exist(board, word) {
//   const { length: xLen } = board;
//   const { length: yLen } = board[0];
//   for (let x = 0; x < xLen; x++) {
//     for (let y = 0; y < yLen; y++) {
//       if (_exist(board, word, x, y, 0, xLen, yLen)) return true;
//     }
//   }

//   return false;
//   //用于判断board[x][y]的上下左右是否有work[k+1]，若有返回true
//   function _exist(board, word, x, y, k, xLen, yLen) {
//     if (x < 0 || x >= xLen || y < 0 || y >= yLen || board[x][y] !== word[k]) {
//       return false;
//     }
//     // word 到尾部了
//     if (k === word.length - 1) {
//       return true;
//     }
//     let tmp = board[x][y];
//     board[x][y] = "-"; // 当前元素暂时不能再访问
//     const isExist =
//       _exist(board, word, x - 1, y, k + 1, xLen, yLen) /* 上 */ ||
//       _exist(board, word, x + 1, y, k + 1, xLen, yLen) /* 下 */ ||
//       _exist(board, word, x, y - 1, k + 1, xLen, yLen) /* 左 */ ||
//       _exist(board, word, x, y + 1, k + 1, xLen, yLen); /* 右 */
//     board[x][y] = tmp;
//     return isExist;
//   }
// }
// let board = [
//     ["A", "B", "C", "E"],
//     ["S", "F", "C", "S"],
//     ["A", "D", "E", "E"],
//   ],
//   word = "ABCCED";

// console.log(exist(board, word));

// function movingCount(m, n, k) {
//   let set = new Set();
//   return dfs(0, 0);

//   function dfs(x, y) {
//     let key = `${x}-${y}`;
//     if (
//       x < 0 ||
//       x >= m ||
//       y < 0 ||
//       y >= n ||
//       getSum(x, y) > k ||
//       set.has(key)
//     ) {
//       return 0;
//     }
//     set.add(key);
//     return 1 + dfs(x + 1, y) /* 下 */ + dfs(x, y + 1); /* 右 */
//   }

//   function getSum(...nums) {
//     let sum = 0;
//     for (let i = 0, { length: len } = nums; i < len; i++) {
//       let num = nums[i];
//       while (num) {
//         sum += num % 10;
//         num = Math.floor(num / 10);
//       }
//     }
//     return sum;
//   }
// }

// console.log(movingCount(2, 3, 1));
var hammingWeight = function (n) {
  let res = 0;
  while (n) {
    n = n & (n - 1);
    res++;
  }
  return res;
};
console.log(hammingWeight(11111111111111111111111111111101));
