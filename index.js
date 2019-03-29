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

const fs = require('fs')
const zlib = require('zlib')
const file = process.argv[2]
console.log('argv: ', process.argv)

const { Transform } = require('stream')

const transform = new Transform({
  transform(chunk, encoding, callback) {
    process.stdout.write('.')
    callback(null, chunk)
  }
})

fs.createReadStream(file)
  .pipe(zlib.createGzip())
  // .on('data', () => {
  //   process.stdout.write('.')
  // })
  .pipe(transform)
  .pipe(fs.createWriteStream(file.split('.')[0] + '.gz'))
  .on('finish', () => process.stdout.write('\ndone'))
