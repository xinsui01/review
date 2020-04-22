const fs = require('fs');
const path = require('path');
const { runLoaders } = require('loader-runner');

// runLoaders(
//   {
//     resource: './src/demo.txt',
//     loaders: [
//       {
//         loader: path.join(__dirname, '../loaders/raw-loader.js'),
//         options: {
//           name: 'test',
//         },
//       },
//     ],
//     context: {
//       minimize: true,
//     },
//     readResource: fs.readFile.bind(fs),
//   },
//   (err, result) => {
//     err ? console.log(err) : console.log(result);
//   }
// );

runLoaders(
  {
    resource: './src/index.css',
    loaders: [
      {
        loader: path.join(__dirname, '../loaders/sprite-loader/index.js'),
        options: {
          name: 'test',
        },
      },
    ],
    context: {
      minimize: true,
    },
    readResource: fs.readFile.bind(fs),
  },
  (err, result) => {
    err ? console.log(err) : console.log(result);
  }
);
