const Spritesmith = require('spritesmith');
const fs = require('fs');
const path = require('path');

// const sprites = ['./images/cta.jpg', './images/initial-sprite.png'];

// Spritesmith.run({ src: sprites }, (err, result) => {
//   console.log(result.image);
//   console.log(result.coordinates);
//   console.log(result.properties);
//   fs.writeFileSync(path.join(__dirname, '../../dist/sprite.png'), result.image);
// });

module.exports = function (source) {
  const callback = this.async();
  const imgs = source.match(/url\((\S*)\?__sprite\)/g);
  const matchedImgs = [];

  for (let i = 0; i < imgs.length; i++) {
    const img = imgs[i].match(/url\((\S*)\?__sprite/)[1];
    matchedImgs.push(path.join(__dirname, img));
  }

  Spritesmith.run({ src: matchedImgs }, (err, result) => {
    fs.writeFileSync(path.join(__dirname, '../../dist/sprite.png'), result.image);
    source = source.replace(/url\((\S*)\?__sprite/g, (match) => {
      return `url('dist/sprite.png')`;
    });
    fs.writeFileSync(path.join(__dirname, '../../dist/index.css'), source);
    callback(null, source);
  });
};
