# 国际化面临的问题及解决方案

- 文案样式，针对不同语言写不同的样式，做精细化控制
- 时间格式、数字格式、货币单位、货币汇率
- LTR／RTL

  - direction

    - 与在 html 标签上直接添加 dir="rtl" 的作用一样
    - 定义过 direction:rtl 的元素，如果没有预先定义过 text-align，那么这个元素的 text-align 的值就变成了 right，如果设置了 left/center 则无效
    - 对于数字和标点符号以外的编码，顺序仍然是从左到右的
    - 改变了 flex/inline-block 元素的书写顺序，对于 float/绝对定位布局就无能为力
    - direction 无法改变 margin, padding, border 的水平方向

    ```html
    <style>
      span {
        display: inline-block;
      }
    </style>
    <div style="direction: rtl;">1 2 3 4 5 6</div>
    <div style="text-align:left;direction:rtl;">1 2 3 4 5 6</div>
    <div style="text-align:right;">1 2 3 4 5 6</div>
    <div style="direction: rtl;"><span>This is </span><span>my blog</span></div>
    <div style="direction: rtl;">这是我的博客。</div>
    <div style="text-align:right;">这是我的博客。</div>
    <div style="direction: rtl;">.</div>
    <div style="text-align:right;">.</div>
    ```

    效果如下：
    ![](https://pic4.zhimg.com/80/v2-1d4c6a2e447d47c4972b23d0b0810e9f_hd.jpg)

    > direction + rtlcss 模块对 css 文件进行处理来解决布局问题

    ```css
    .test {
      direction: ltr;
      float: left;
      position: relative;
      left: 20px;
      margin-left: 100px;
      padding-right: 30px;
    }
    ```

    通过 rtlcss 模块处理后的 css 将变成：

    ```css
    .test {
      direction: rtl;
      float: right;
      position: relative;
      right: 20px;
      margin-right: 100px;
      margin-left: 30px;
    }
    ```

    问题：

    - 涉及到 JS 就无能为力了。

      比如在轮播图中，通过 JS 去控制图片的下一帧，在不同的 LTR、RTL 布局中就产生额外的兼容代码。

    - 无法处理 html 中内嵌在标签中的样式。

    - 需要有更加细粒度的控制。

      不是所有的内容都一定是从右到左进行排版的。在整体 RTL 的页面中忽视掉某些模块，使其仍然是以从左往右顺序的能力。

      给不需要翻转的模块的 CSS 文件中添加像 `* rtl:ignore *`

  - "神奇" 的 transform 镜像翻转: `transform: scaleX(-1)`

    - 无需考虑你的布局：flex/浮动/绝对定位等等，都可以很好地从 LTR 布局变成 RTL 布局。

      ```css
      html[lang='ar'] {
        transform: scaleX(-1);
      }
      ```

    - 不需要翻转的再次 `transform: scaleX(-1)`
    - 细粒度的控制
    - 缺点
      - 对于一些页面滚动组件需要做额外的兼容操作
      - 它需要对我们已有的业务场景进行改造，入侵业务代码

  - [国际化 - 通用 LTR/RTL 布局解决方案](https://zhuanlan.zhihu.com/p/47864242)

- 图片：国际化如果你想把国际化做的足够精细，那么图片国际化也是需要考虑的。
- 第三方 UI 组件：antD
- 打包方案

  - 编译期间转化：例如 wepack 的 i18n-webpack-plugin，打包的时候对`_('key')`进行转义
  - 运行期间转化：react-intl 等，把中文词条写成 intl.get()的方式，在运行时获取中文文案

    - vue + vue-i18n
    - angular + angular-translate
    - react + react-intl
    - jquery + jquery.i18n.property

    |                          | react-intl                     | react-intl-universal(阿里开源) |
    | :----------------------- | :----------------------------- | :----------------------------- |
    | 切换不刷新页面           | 优                             | 劣                             |
    | js 文件支持（重要）      | 劣                             | 优                             |
    | 名词单双数，默认值，html | 优                             | 优                             |
    | 无破坏性                 | 劣(装饰器的代码实现会改变 ref) | 优                             |

    > react-intl 只支持在 jsx 文件的内容中使用，但是由于项目配置化编程的缘故，很多中文是写在 js 对象中的。react-intl 不支持在普通 js 对象中使用，很不方便。而且他的装饰器实现会改变组件的 ref。他唯一的好处是他的切换不需要刷新页面.

- [i18n-pick](https://github.com/ProtoTeam/i18n-pick)
- [Kiwi-国际化全流程解决方案](https://github.com/alibaba/kiwi)
- [I18N-loader](https://github.com/webpack-contrib/i18n-loader)
