# CSS

## 选择器

- 属性选择器

  - `[attr]`: 根据元素属性来选择元素
    ```css
    li[class] {
      color: red;
      background: yellow;
    }
    ```
  - `[attr=value]`: 根据具体的属性值来选择元素
    ```css
    li[class="second done"] {
      color: red;
      background: yellow;
    }
    ```
  - `[attr~=value]`: 属性包含 value 的元素

    ```html
    <li class="second done"></li>
    ```

    ```css
    li[class~="done"] {
      color: red;
      background: yellow;
    }
    ```

  - `[attr^=value]`: 属性以 XX 开头的元素

    ```html
    <li class="second done"></li>
    ```

    ```css
    li[class^="se"] {
      color: red;
      background: yellow;
    }
    ```

  - `[attr$=value]`: 属性值以 XX 结尾的元素

    ```html
    <li class="second done"></li>
    ```

    ```css
    li[class$="ne"] {
      color: red;
      background: yellow;
    }
    ```

  - `[attr*=value]`: 属性值包含 XX 的元素

    ```html
    <li class="first"></li>
    <li class="second done"></li>
    <li class="third done"></li>
    ```

    ```css
    li[class*="ir"] {
      color: red;
      background: yellow;
    }
    ```

- 语言值匹配

  ```html
  <!DOCTYPE html>
  <html lang="zh">
    <head>
      <meta charset="utf-8" />
      <title>表示“谢谢”的语言</title>
    </head>
    <body>
      <h1>表示“谢谢”的语言</h1>
      <dl>
        <dt>英语</dt>
        <dd lang="en">Thank you.</dd>
        <dt>日语</dt>
        <dd lang="ja">ありがとう.</dd>
        <dt>法语</dt>
        <dd lang="en">Merci.</dd>
        <dt>澳洲英语</dt>
        <dd lang="en-au">Thank you very much.</dd>
      </dl>
    </body>
  </html>
  ```

  选择 lang 属性等于 `en` 或者以 `en-` 开头的所有元素

  ```css
  *[lang|="en"] {
    color: red;
    background: yellow;
  }
  ```

- 组合选择器

  - `+`: 相邻的下一个兄弟元素;

    ```html
    <h2></h2>
    <p></p>
    ```

    ```css
    h2 + p {
      text-decoration: line-through;
    }
    ```

  - `~`: 后面不相邻的所有同胞节点

    ```html
    <h2 id="haha">标题</h2>
    <p>拼</p>
    <h2>标题1</h2>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
    </ul>
    <h2>标题2</h2>
    ```

    ```css
    #haha ~ h2 {
      color: red;
    }
    ```

- [伪类与伪元素](http://www.alloyteam.com/2016/05/summary-of-pseudo-classes-and-pseudo-elements/)

  css 引入伪类和伪元素概念是为了格式化文档树以外的信息

  - 伪元素

    - ::before/:before
    - ::after/:after
    - ::first-line/:first-line
    - ::first-letter
    - ::selection
    - ::placeholder
    - ::backdrop 用于改变全屏模式下的背景颜色.该伪元素只支持双冒号的形式

  - 伪类

    - :link
    - :visited
    - :focus
    - :hover
    - :active

    - :first-child
    - :last-child
    - :first-of-type
    - :last-of-type
    - :nth-child
    - :nth-of-type
    - :nth-last-child
    - :nth-last-type
    - :only-child
    - :only-of-type

    - :not // 某个元素之外的所有元素
    - :target // 选取页面中的某个 target 元素。

      ```html
      <style>
        :target {
          color: red;
        }
      </style>
      <h4 id="one">...</h4>
      <p id="two">...</p>
      <div id="three">...</div>
      <a id="four">...</a> <em id="five">...</em>

      <a href="#one">First</a>
      <a href="#two">Second</a>
      <a href="#three">Third</a>
      <a href="#four">Fourth</a>
      <a href="#five">Fifth</a>
      ```

      例如, 以下 URL 拥有一个片段 (以#标识的) ，该片段指向一个 ID 为 one 的页面元素:

      > http://www.example.com/index.html#one

      若当前 URL 等于上面的 URL，下面的元素可以通过 :target 选择器被选中：

      > `<a href="#one">First</a>`

      样式会应用到以下元素

      > `<h4 id="one">...</h4>`

    - :checked
    - :disabled
    - :enabled
    - :empty // 选择不包含任何子元素的元素
    - :root // html
    - :read-write // 默认没有 readonly 属性是可读写的
    - :read-only // 元素有 readonly 属性

- 选择器权重

  - 内联样式： 1000
  - ID 选择器： 100
  - class、伪类、属性： 10
  - 元素、伪元素： 1
  - `*`： 0，0 特定性比无特定性要强。
  - inherit: 比 `*` 弱鸡
  - `!important`

## CSS 单位

- 相对长度单位： px、em、rem、
- 视口单位：vw、vh、vmin、vmax

## [自定义字体](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face)

```css
@font-face {
  font-family: "iconfont";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"), url("/fonts/OpenSans-Regular-webfont.woff")
      format("woff");
}
```

## CSS 盒模型

- IE 盒模型：`box-sizing: border-box;`， `width = borde + padding + content`

- w3c 标准盒模型：`box-sizing: content-box;`， `width = content`

## BFC

- [BFC(块格式化上下文)](https://segmentfault.com/a/1190000013647777)

  - BFC 特性

    - 一个独立的布局环境，内部的元素不会影响外部的元素，反之亦如此；
    - 内部子元素从顶端开始垂直的一个接一个的排列，子元素之间垂直的间距是由 margin 决定的；
    - 同一个 BFC 中，相邻的块级盒子的垂直外边距会发生重叠；
    - BFC 区块不会和 float 区块发生重叠；
    - BFC 能够识别并包含浮动元素，当计算其区域的高度时，浮动元素也参与计算；

  - 创建 BFC

    - 根元素或包含根元素的元素
    - 浮动元素 float: left/right/inherit(!= none);
    - 定位元素 position: absolute/fixed;
    - display:inline-block/flex/inline-flex/table-cell/table-caption
    - overflow: hidden/auto/scroll

  - BFC 作用
    - 清除浮动，解决浮动后高度塌陷问题
    - 避免外边距折叠（外边距折叠（Margin collapsing）只会发生在属于同一 BFC 的块级元素之间。如果它们属于不同的 BFC，它们之间的外边距则不会折叠。所以通过创建一个不同的 BFC ，就可以避免外边距折叠。）

- [关于 CSS-BFC 深入理解](https://juejin.im/post/5909db2fda2f60005d2093db)

- [10 分钟理解 BFC 原理](https://zhuanlan.zhihu.com/p/25321647)

## 清除浮动

- [清除浮动（clearfix）的常见方法](https://segmentfault.com/a/1190000008012247)

  - [clearfix（清除浮动）](https://segmentfault.com/a/1190000013664630)

    - 使用 clear 属性

      ```css
      .container::after {
        content: " ";
        display: block;
        clear: both;
      }
      ```

      可能有些代码有添加 `::before` ，且 `display: table`

      ```css
      .container::before,
      .container::after {
        content: " ";
        display: table;
      }

      .container::after {
        clear: both;
      }
      ```

      实际上添加的部分跟浮动并没有关系，他们的作用是防止子元素的 margin-top 发生重叠。

      但添加::before 就必须将 display 设置为 table。

      主要原理：display 设置为 table 时会出现一个匿名表格单元格（anonymous table-cell），从而创建一个新的 BFC（下文会提及），根据 BFC 的布局规则，会使 margin-top 不重叠。这里只是解释说明有些代码出现这种写法的原因，如果没有防止重叠的需求，完全可以精简代码，使用上一种写法。

      ```css
      .clearfix::after {
        content: "";
        display: block;
        clear: both;
        visibility: hidden;
        height: 0;
      }

      .clearfix {
        zoom: 1; /* For IE 6/7 (trigger hasLayout) */
      }
      ```

    - 添加标签

      ```html
      <br style="clear:both" />
      ```

    - 触发浮动元素父元素的 BFC

## 层叠上下文

- [深入理解 CSS 中的层叠上下文和层叠顺序](https://www.zhangxinxu.com/wordpress/2016/01/understand-css-stacking-context-order-z-index/)

  层叠顺序：background/border -> 负 z-index -> block 块状水平盒子 -> float 浮动盒子 -> inline/inline-block 水平盒子 -> z-index:auto/z-index:0/不依赖 z-index -> 正 z-index

  ![](https://image.zhangxinxu.com/image/blog/201601/2016-01-09_211116.png)

## Flex 布局

- [Flex 布局教程：语法篇](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)

  - container 属性

    - display: inline-flex/flex
    - flex-direction: `row`、`row-reverse`、`column`、`column-reverse`
    - flex-wrap: `nowrap`、`wrap`、`wrap-reverse`;
    - flex-flow: flex-direction 属性和 flex-wrap 属性的简写形式，默认值为 `row nowrap`;
    - justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
    - align-items: flex-start | flex-end | center | baseline | stretch;
    - align-content: 多根轴线的对齐方式。flex-start | flex-end | center | space-between | space-around | stretch

  - 子项的属性
    - order
    - flex-grow: 定义项目的放大比例，默认为 0
    - flex-shrink: 定义了项目的缩小比例，默认为 1，即如果空间不足，该项目将缩小。
    - flex-basis: `<length> | auto`。 // 在分配多余空间之前，项目占据的主轴空间（main size）。默认值为 auto，即项目的本来大小。
    - flex: flex-grow, flex-shrink 和 flex-basis 的简写，默认值为 0 1 auto。后两个属性可选。该属性有两个快捷值：auto (1 1 auto) 和 none (0 0 auto)。
    - align-self: `auto | flex-start | flex-end | center | baseline | stretch`; 允许单个项目有与其他项目不一样的对齐方式，可覆盖 align-items 属性。默认值为 auto，表示继承父元素的 align-items 属性，如果没有父元素，则等同于 stretch

- [Flex 布局教程：实例篇](http://www.ruanyifeng.com/blog/2015/07/flex-examples.html)

## Grid 布局

- [写给自己看的 display: grid 布局教程](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/)

## [居中方法](https://juejin.im/post/5b94d8965188255c5a0cdc02)

- 水平居中
  - text-align: center;(针对 inline, 内联块 inline-block, 内联表 inline-table, inline-flex 元素及 img,span,button 等元素)
  - margin: 0 auto;(不定宽块状元素居中)
  - 绝对布局
    ```css
    /*已知宽度*/
    .container {
      position: relative;
    }
    .child {
      position: absolute;
      left: 50%;
      width: 100px;
      margin-left: -50px;
    }
    ```
    ```css
    /*未知宽度*/
    .container {
      position: relative;
    }
    .child {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }
    ```
  - flex 布局
- 垂直居中
  - height: 20px; line-height: 20px;(单行内联(inline-)元素垂直居中)
  - .container{display: table;} .child {display: table-cell; vertical-align: middle;}
  - 绝对布局
    ```css
    /*已知高度*/
    .container {
      position: relative;
    }
    .child {
      position: absolute;
      top: 50%;
      height: 100px;
      margin-top: -50px;
    }
    ```
    ```css
    /*未知高度*/
    .container {
      position: relative;
    }
    .child {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
    ```
  - flex 布局
- 水平垂直居中

  - flex 布局
  - grid 布局
  - 绝对定位

    ```css
    /*已知高度*/
    .container {
      position: relative;
      width: 600px;
      height: 400px;
      background: #ccc;
    }
    .child {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 200px;
      height: 100px;
      margin-left: -100px;
      margin-top: -50px;
      background: red;
    }
    ```

    ```css
    /*未知高度*/
    .container1 {
      position: relative;
      width: 600px;
      height: 400px;
      background: #ccc;
    }
    .child1 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: red;
    }
    ```

## [transform](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)

> 开启硬件加速 transform: translateZ(0);

```css
/* Keyword values */
transform: none;

/* Function values */
transform: matrix(1, 2, 3, 4, 5, 6);
transform: translate(12px, 50%);
transform: translateX(2em);
transform: translateY(3in);
transform: scale(2, 0.5);
transform: scaleX(2);
transform: scaleY(0.5);
transform: rotate(0.5turn);
transform: skew(30deg, 20deg);
transform: skewX(30deg);
transform: skewY(1.07rad);
transform: matrix3d(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16);
transform: translate3d(12px, 50%, 3em);
transform: translateZ(2px);
transform: scale3d(2.5, 1.2, 0.3);
transform: scaleZ(0.3);
transform: rotate3d(1, 2, 3, 10deg);
transform: rotateX(10deg);
transform: rotateY(10deg);
transform: rotateZ(10deg);
transform: perspective(17px);

/* Multiple function values */
transform: translateX(10px) rotate(10deg) translateY(5px);

/* Global values */
transform: inherit;
transform: initial;
transform: unset;
```

## [小 tips:了解 CSS/CSS3 原生变量 var](https://www.zhangxinxu.com/wordpress/2016/11/css-css3-variables-var/)

- CSS 中原生的变量定义语法是：`--*`，变量使用语法是：`var(--*)`，其中`*`表示我们的变量名称。
  ```css
  :root {
    --1: #369;
    --深蓝: #369;
  }
  body {
    background-color: var(--1);
  }
  ```

## [CSS 实现长宽比的几种方案](https://www.w3cplus.com/css/aspect-ratio.html)

- CSS 实现自适应正方形

  ```html
  <div style="border: 1px solid; width: 10vmin; height: 10vmin;"></div>

  <div
    style="border: 1px solid; width: 30%; height: 0; padding-bottom: 30%;"
  ></div>

  <style>
    div::after {
      content: "";
      display: block;
      margin-top: 100%;
    }
  </style>
  <div style="border: 1px solid; width: 30%; overflow: hidden;"></div>
  ```

- [CSS3 技巧之形状（椭圆）](https://www.jianshu.com/p/f13122a9651c)

  - [border-raduis](https://developer.mozilla.org/zh-CN/docs/Web/CSS/border-radius)

    ```html
    <!-- 椭圆 -->
    <div
      style="width: 200px; height: 100px; border-radius: 100px/50px; border: 1px solid orange;"
    ></div>
    ```

    <div style="width: 200px; height: 100px; border-radius: 100px/50px; border: 1px solid orange;"></div>

- 三角形实现

  ```html
  <style>
    .caret {
      display: inline-block;
      border-top: 10px solid red;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 0;
    }
  </style>
  <div class="caret"></div>
  ```

  <style>
    .caret {
      display: inline-block;
      border-top: 10px solid red;
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 0;
    }
  </style>

  <div class="caret"></div>

  ```html
  <div
    style="width: 10px; height: 10px; border-left: 10px solid red; border-top: 10px solid blue; border-bottom: 10px solid green;border-right: 10px solid yellow"
  ></div>
  ```

  <div style="width: 10px; height: 10px; border-left: 10px solid red; border-top: 10px solid blue; border-bottom: 10px solid green;border-right: 10px solid yellow"></div>

## <a href="./index.html" target="_blank">css 布局</a>

- [css 网页的几种布局](https://juejin.im/post/5a260aaa6fb9a0451b0464f0)
- [CSS 布局说——可能是最全的](https://mp.weixin.qq.com/s/iQ8mSr4oEAC8Ve6IdiN9jQ)

## CSS 实现单行、多行文本溢出显示省略号

- 单行文本溢出显示省略号

  ```css
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  ```

- 多行文本溢出显示省略号

  ```css
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  ```

  > 比较靠谱简单的做法就是设置相对定位的容器高度，用包含省略号（...）的元素模拟实现

  ```css
  p {
    position: relative;
    line-height: 1.4em;
    /*设置容器高度为3倍行高就是显示3行*/
    height: 4.2em;
    overflow: hidden;
  }
  p::after {
    content: "...";
    font-weight: bold;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 20px 1px 45px;
    background: #fff;
  }
  ```

  <style>
  p.elliapse {
    position: relative;
    width: 200px;
    line-height: 1.4em;
    /*设置容器高度为3倍行高就是显示3行*/
    height: 4.2em;
    overflow: hidden;
    color: black;
    background: #fff;
  }
  p.elliapse::after {
    content: '...';
    font-weight: bold;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 0 10px 1px 10px;
    background: #fff;
  }
  </style>
  <p class="elliapse">多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 多行文本溢出 </p>

## 开关 switch 实现

```html
<!-- html css 实现开关 -->
<style>
  .switch {
    display: inline-flex;
    --height: 30px;
    --radius: calc(var(--height) - 4px);
    user-select: none;
  }

  #switch + label {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 80px;
    height: var(--height);
    border-radius: calc(var(--height) / 2) / 50%;
    box-shadow: 0 0 2px black;
    background-color: transparent;
    transition: background-color 0.3s ease;
  }

  #switch + label .text,
  #switch + label .circle {
    display: inline-flex;
  }

  #switch + label .on {
    margin-left: 5px;
    visibility: hidden;
  }

  #switch + label .off {
    margin-right: 5px;
    visibility: visible;
  }

  #switch + label .circle {
    position: absolute;
    left: 0;
    width: var(--radius);
    height: var(--radius);
    border-radius: 50%;
    border: 2px solid #333;
    background-color: #eee;
    transition: left 0.3s ease;
  }

  #switch:checked + label {
    background-color: #0f0;
  }

  #switch:checked + label .circle {
    left: calc(100% - var(--radius) - 2px);
  }

  #switch:checked + label .on {
    visibility: visible;
  }

  #switch:checked + label .off {
    visibility: hidden;
  }
</style>

<div class="switch">
  <input type="checkbox" name="switch" id="switch" hidden />
  <label for="switch">
    <span class="circle"></span>
    <span class="text on">ON</span>
    <span class="text off">OFF</span>
  </label>
</div>
```

<!-- html css 实现开关 -->
<style>
  .switch {
    display: inline-flex;
    --height: 30px;
    --radius: calc(var(--height) - 4px);
    user-select: none;
  }

  #switch + label {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
    width: 80px;
    height: var(--height);
    border-radius: calc(var(--height) / 2) / 50%;
    box-shadow: 0 0 2px black;
    background-color: transparent;
    transition: background-color 0.3s ease;
  }

  #switch + label .text,
  #switch + label .circle {
    display: inline-flex;
  }

  #switch + label .on {
    margin-left: 5px;
    visibility: hidden;
  }

  #switch + label .off {
    margin-right: 5px;
    visibility: visible;
  }

  #switch + label .circle {
    position: absolute;
    left: 0;
    width: var(--radius);
    height: var(--radius);
    border-radius: 50%;
    border: 2px solid #333;
    background-color: #eee;
    transition: left 0.3s ease;
  }

  #switch:checked + label {
    background-color: #0f0;
  }

  #switch:checked + label .circle {
    left: calc(100% - var(--radius) - 2px);
  }

  #switch:checked + label .on {
    visibility: visible;
  }

  #switch:checked + label .off {
    visibility: hidden;
  }
</style>

<div class="switch">
  <input type="checkbox" name="switch" id="switch" hidden />
  <label for="switch">
    <span class="circle"></span>
    <span class="text on">ON</span>
    <span class="text off">OFF</span>
  </label>
</div>

## CSS In JS

- [杂谈 CSS IN JS](https://segmentfault.com/a/1190000012454907)

- 相对于 JavaScript 的突飞猛进，CSS 的发展缓慢，相对止步不前。随着前端职能扩大化成为常态，前端工程化日趋成熟，CSS 先天缺陷愈发明显：

  - 全局作用域
  - 缺乏高级编程特性
  - 代码冗余
  - 极限压缩
  - 依赖管理

- React 对 CSS 的封装

  - React 引领的关注点混合，以组件为核心的开发模式，有效规避了 CSS 缺乏依赖管理的缺陷
  - 沿用了 DOM 的 style 属性对象

    ```js
    const style = {
      color: "red",
      fontSize: "24px",
    };
    ```

  - 对 CSS 封装非常弱，导致了一系列第三方库，用来加强 React 的 CSS 操作。

- [polished.js](https://polished.js.org/)

  - 封装普通的 JS 函数，返回 CSS 对象

- [styles-components](https://www.styled-components.com/)

  ```jsx
  import React from "react";
  import styled from "styled-components";

  const Title = styled.h1`
      font-size: 1.5em
      text-align: center;
      color: green;
    `;

  <Title>Hello World, this is my first styled component!</Title>;
  ```

- 原理解析

  1. `styled.button` 等同于 `styled('button')` 的，`SC` 在导入 `styled` 时把所有的 dom 节点柯里化后的函数都赋值给了 `styled` 的同名属性，这样就能使用上面的语法方式了，具体实现就是下面这段代码。

  ```js
  domElements.forEach((domElement) => {
    styled[domElement] = styled(domElement); // 柯里化函数
  });
  ```

  2. [tag\`font-size: 12px\` 是 ES6 字符串模板语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/template_strings)：

  ```js
  function myTag(strings, personExp, ageExp) {
    var str0 = strings[0]; // "that "
    var str1 = strings[1]; // " is a "
    var ageStr;
    if (ageExp > 99) {
      ageStr = "centenarian";
    } else {
      ageStr = "youngster";
    }

    return str0 + personExp + str1 + ageStr;
  }
  var person = "Mike";
  var age = 28;
  var output = myTag`that ${person} is a ${age}`;
  ```

- [How styled-components works: A deep dive under the hood](https://medium.com/styled-components/how-styled-components-works-618a69970421)

1. When you import the library first time in you app it creates an internal `counter` variable to count all the components created via the `styled` factory.
2. When styled-components creates a new component it also creates internal identifier `componentId`. Here is how the identifier computed:

   ```js
   counter++;
   const componentId = "sc-" + hash("sc" + counter); // sc-bdVaJa
   ```

3. As soon as the identifier is created, styled-components inserts new HTML `<style>` element into the `<head>` (if it is the first component and the element is not inserted yet) of your page and adds special comment marker with the `componentId` to the element which will be used later. In our case we got:

   ```js
   // evaluatedStyles 是获得到的 style 属性
   const style = document.createElement("style");
   // WebKit hack
   const className = hash(componentId + evaluatedStyles);
   style.appendChild(
     document.createTextNode(`.${className} { ${evaluatedStyles} }`)
   );
   document.head.appendChild(style);
   ```

   ```html
   <style data-styled-components>
     /* sc-component-id: sc-bdVaJa */
   </style>
   ```

4. When the new component is created, the target component passed to the factory target (in our case 'button') and the componentId are saved in the static fields:

   ```js
   StyledComponent.componentId = componentId;
   StyledComponent.target = TargetComponent;
   ```

5. Generating CSS class name: Each component instance with uniq props has it’s own CSS class name which generated by means of the same MurmurHash algorithm but from the componentId and the evaluatedStyles string:

   ```js
   const className = hash(componentId + evaluatedStyles); // jsZVzX
   ```

6. Then this class name is stored in the component state as `generatedClassName`.

7. CSS Preprocessing: Here is where the super fast stylis CSS preprocessor comes to the rescue and helps to obtain valid CSS string:

   ```js
   const selector = "." + className;
   const cssStr = stylis(selector, evaluatedStyles);
   ```

   Result CSS for the Button instance:

   ```css
   .jsZVzX {
     font-size: 24px;
     color: coral;
     padding: 0.25rem 1rem;
     border: solid 2px coral;
     border-radius: 3px;
     margin: 0.5rem;
   }
   .jsZVzX:hover {
     background-color: bisque;
   }
   ```

8. Injecting CSS string into the page: Now the CSS should be injected into the `<style>` element in the `head` of the page right after the component’s comment marker:
9. `render()`

```jsx
const TargetComponent = this.constructor.target; // In our case just 'button' string.
const componentId = this.constructor.componentId;
const generatedClassName = this.state.generatedClassName;

return (
  <TargetComponent
    {...this.props}
    className={
      this.props.className + " " + componentId + " " + generatedClassName
    }
  />
);
```

11. change props

    ```html
    <style data-styled-components>
      /* sc-component-id: sc-bdVaJa */
      .sc-bdVaJa {
      }
      .jsZVzX {
        font-size: 24px;
        color: coral;
        ...;
      }
      .jsZVzX:hover {
        background-color: bisque;
      }
      .kkRXUB {
        font-size: 25px;
        color: coral;
        ...;
      }
      .kkRXUB:hover {
        background-color: bisque;
      }
      .jvOYbh {
        font-size: 26px;
        color: coral;
        ...;
      }
      .jvOYbh:hover {
        background-color: bisque;
      }
      .ljDvEV {
        font-size: 27px;
        color: coral;
        ...;
      }
      .ljDvEV:hover {
        background-color: bisque;
      }
    </style>
    ```

    the only difference for each CSS class is font-size property and unused CSS classes are not removed. But why? Just because removing them adds performance overhead while keeping does not

12. There is one small optimization here: components without interpolations in the style string are marked as `isStatic` and this flag is checked in `componentWillReceiveProps()` in order to skip unnecessary calculations of the same styles.

- 优势

  - 隔离作用域 -- 样式生效通过内嵌，或者生成独一无二的类名，避免出现选择器冲突；
  - 高级编程特性 -- 充分利用 JavaScript 的能力增强对样式的控制；
  - 样式按需挂载 -- 页面需要的样式才会加载，有效避免样式冗余；
  - 依赖管理 -- 寄生于组件，利用现存的 NPM 生态进行包管理；
  - 动态样式 -- 能够更加简单，直接的修改样式

- 劣势

  - 很多库都没法定义子元素的样式
  - 无法复用现有生态，特性完全依赖于库的实现；
  - 编辑器代码补全，语法检查，语法高亮等需要插件支持；
  - 伪类选择器（disabled、:before、:nth-child）支持诡异；
  - 样式属性骆驼式命名；
  - 运行过程中不断动态创建 Element 并且创建 style 消耗了部分性能
  - 如果每次点击那个 Button 都会改变一次 background，你会发现在点 200 次后，SC 会报一个 warning

    ```js
      Over 200 classes were generated for component styled.button.
      Consider using the attrs method, together with a style object for frequently changed styles.
      Example:
        const Component = styled.div.attrs({
          style: ({ background }) => ({
            background,
          }),
        })`width: 100%;`
      <Component />
    ```

## CSS Module

将 css 代码模块化，可以避免本模块样式被污染。并且可以很方便的复用 css 代码。

```css
// 全局变量
:global(.className) {
  background-color: blue;
}

// 本地变量，其它模块无法污染
.className {
  background-color: blue;
}

.title {
  // 复用 className 类的样式
  composes: className;
  color: red;
}
```

- CSS Modules 可以有效避免全局污染和样式冲突，能最大化地结合现有 CSS 生态和 JS 模块化能力

## [Web 性能优化-CSS3 硬件加速(GPU 加速)](https://lz5z.com/Web%E6%80%A7%E8%83%BD%E4%BC%98%E5%8C%96-CSS3%E7%A1%AC%E4%BB%B6%E5%8A%A0%E9%80%9F/)

- CSS3 硬件加速又叫做 GPU 加速，是利用 GPU 进行渲染，减少 CPU 操作的一种优化方案。由于 GPU 中的 transform 等 CSS 属性不会触发 repaint，所以能大大提高网页的性能。

## 浏览器是怎样解析 CSS 选择器的?

CSS 选择器的解析是从右向左解析的。若从左向右的匹配，发现不符合规则，需要进行回溯，会损失很多性能。若从右向左匹配，先找到所有的最右节点，对于每一个节点，向上寻找其父节点直到找到根元素或满足条件的匹配规则，则结束这个分支的遍历。两种匹配规则的性能差别很大，是因为从右向左的匹配在第一步就筛选掉了大量的不符合条件的最右节点（叶子节点），而从左向右的匹配规则的性能都浪费在了失败的查找上面。

## Question

- Div 里面有个 inline block 的 span 高度设置为 20px，那 div 高度是多少？

  inline 基线对齐，所以 div 高度会比 20 多一点
