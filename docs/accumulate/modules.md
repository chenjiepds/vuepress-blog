# 模块化

## 模块化发展过程
### Stage 1 - 文件划分方式
最早我们会基于文件划分的方式实现模块化，也就是 Web 最原始的模块系统。具体做法是将每个功能及其相关状态数据各自单独放到不同的 JS 文件中，约定每个文件是一个独立的模块。使用某个模块将这个模块引入到页面中，一个 script 标签对应一个模块，然后直接调用模块中的成员（变量 / 函数）。
```
└─ stage-1
    ├── module-a.js
    ├── module-b.js
    └── index.html
```
```
// module-a.js 
function foo () {
   console.log('moduleA#foo') 
}
```
```
// module-b.js 
var data = 'something'
```
```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Stage 1</title>
</head>
<body>
  <script src="module-a.js"></script>
  <script src="module-b.js"></script>
  <script>
    // 直接使用全局成员
    foo() // 可能存在命名冲突
    console.log(data)
    data = 'other' // 数据可能会被修改
  </script>
</body>
</html>
```

**缺点：**

+ 模块直接在全局工作，大量模块成员污染全局作用域；
+ 没有私有空间，所有模块内的成员都可以在模块外部被访问或者修改；
+ 一旦模块增多，容易产生命名冲突；
+ 无法管理模块与模块之间的依赖关系；
+ 在维护的过程中也很难分辨每个成员所属的模块。
总之，这种原始“模块化”的实现方式完全依靠约定实现，一旦项目规模变大，这种约定就会暴露出种种问题，非常不可靠，所以我们需要尽可能解决这个过程中暴露出来的问题。

### Stage 2 - 命名空间方式
后来，我们约定每个模块只暴露一个全局对象，所有模块成员都挂载到这个全局对象中，具体做法是在第一阶段的基础上，通过将每个模块“包裹”为一个全局对象的形式实现，这种方式就好像是为模块内的成员添加了“命名空间”，所以我们又称之为命名空间方式。

```
// module-a.js
window.moduleA = {
  method1: function () {
    console.log('moduleA#method1')
  }
}
```
```
// module-b.js
window.moduleB = {
  data: 'something'
  method1: function () {
    console.log('moduleB#method1')
  }
}
```
```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Stage 2</title>
</head>
<body>
  <script src="module-a.js"></script>
  <script src="module-b.js"></script>
  <script>
    moduleA.method1()
    moduleB.method1()
    // 模块成员依然可以被修改
    moduleA.data = 'foo'
  </script>
</body>
</html>
```
这种命名空间的方式只是解决了命名冲突的问题，但是其它问题依旧存在。

### Stage 3 - IIFE
使用立即执行函数表达式（IIFE，Immediately-Invoked Function Expression）为模块提供私有空间。具体做法是将每个模块成员都放在一个立即执行函数所形成的私有作用域中，对于需要暴露给外部的成员，通过挂到全局对象上的方式实现。

```
// module-a.js
;(function () {
  var name = 'module-a'

  function method1 () {
    console.log(name + '#method1')
  }

  window.moduleA = {
    method1: method1
  }
})()
```
```
// module-b.js
;(function () {
  var name = 'module-b'

  function method1 () {
    console.log(name + '#method1')
  }

  window.moduleB = {
    method1: method1
  }
})()
```
这种方式带来了私有成员的概念，私有成员只能在模块成员内通过闭包的形式访问，这就解决了前面所提到的全局作用域污染和命名冲突的问题。

### Stage 4 - IIFE依赖参数
在 IIFE 的基础之上，我们还可以利用 IIFE 参数作为依赖声明使用，这使得每一个模块之间的依赖关系变得更加明显。

```
// module-a.js
;(function ($) { // 通过参数明显表明这个模块的依赖
  var name = 'module-a'

  function method1 () {
    console.log(name + '#method1')
    $('body').animate({ margin: '200px' })
  }

  window.moduleA = {
    method1: method1
  }
})(jQuery)
```

### 模块化加载问题
以上 4 个阶段是早期的开发者在没有工具和规范的情况下对模块化的落地方式，这些方式确实解决了很多在前端领域实现模块化的问题，但是仍然存在一些没有解决的问题。

```
<!DOCTYPE html>
<html>
<head>
  <title>Evolution</title>
</head>
<body>
  <script src="https://unpkg.com/jquery"></script>
  <script src="module-a.js"></script>
  <script src="module-b.js"></script>
  <script>
    moduleA.method1()
    moduleB.method1()
  </script>
</body>
</html>
```
最明显的问题就是：模块的加载。在这几种方式中虽然都解决了模块代码的组织问题，但模块加载的问题却被忽略了，我们都是通过 script 标签的方式直接在页面中引入的这些模块，这意味着模块的加载并不受代码的控制，时间久了维护起来会十分麻烦。试想一下，如果你的代码需要用到某个模块，如果 HTML 中忘记引入这个模块，又或是代码中移除了某个模块的使用，而 HTML 还忘记删除该模块的引用，都会引起很多问题和不必要的麻烦。

更为理想的方式应该是在页面中引入一个 JS 入口文件，其余用到的模块可以通过代码控制，按需加载进来。

## 模块化规范的出现
除了模块加载的问题以外，目前这几种通过约定实现模块化的方式，不同的开发者在实施的过程中会出现一些细微的差别，因此，为了统一不同开发者、不同项目之间的差异，我们就需要制定一个行业标准去规范模块化的实现方式。

再接合我们刚刚提到的模块加载的问题，我们现在的需求就是两点：

+ 一个统一的模块化标准规范
+ 一个可以自动加载模块的基础库
提到模块化规范，你可能会想到 CommonJS 规范，它是 Node.js 中所遵循的模块规范，该规范约定，一个文件就是一个模块，每个模块都有单独的作用域，通过 module.exports 导出成员，再通过 require 函数载入模块。现如今的前端开发者应该对其有所了解，但是如果我们想要在浏览器端直接使用这个规范，那就会出现一些新的问题。

如果你对 Node.js 的模块加载机制有所了解，那么你应该知道，CommonJS 约定的是以同步的方式加载模块，因为 Node.js 执行机制是在启动时加载模块，执行过程中只是使用模块，所以这种方式不会有问题。但是如果要在浏览器端使用同步的加载模式，就会引起大量的同步模式请求，导致应用运行效率低下。

所以在早期制定前端模块化标准时，并没有直接选择 CommonJS 规范，而是专门为浏览器端重新设计了一个规范，叫做 AMD （ Asynchronous Module Definition） 规范，即异步模块定义规范。同期还推出了一个非常出名的库，叫做 Require.js，它除了实现了 AMD 模块化规范，本身也是一个非常强大的模块加载器。

### RequireJS
在 AMD 规范中约定每个模块通过 define() 函数定义，这个函数默认可以接收两个参数，第一个参数是一个数组，用于声明此模块的依赖项；第二个参数是一个函数，参数与前面的依赖项一一对应，每一项分别对应依赖项模块的导出成员，这个函数的作用就是为当前模块提供一个私有空间。如果在当前模块中需要向外部导出成员，可以通过 return 的方式实现。

```
// AMD 规范定义一个模块
define(['jquery', './module2.js'], function($, module){
    return{
        start: function() {
            $('body').animate({margin: '200px'})
            module2()
        }
    }
})
```
除此之外，Require.js 还提供了一个 require() 函数用于自动加载模块，用法与 define() 函数类似，区别在于 require() 只能用来载入模块，而  define() 还可以定义模块。当 Require.js 需要加载一个模块时，内部就会自动创建 script 标签去请求并执行相应模块的代码。

```
// AMD 规范载入一个模块
require(['./modules/module1.js'], funciton(module1) {
    module1.start()
})
```
目前绝大多数第三方库都支持 AMD 规范，但是它使用起来相对复杂，而且当项目中模块划分过于细致时，就会出现同一个页面对 js 文件的请求次数过多的情况，从而导致效率降低。在当时的环境背景下，AMD 规范为前端模块化提供了一个标准，但这只是一种妥协的实现方式，并不能成为最终的解决方案。

### SeaJS
同期出现的规范还有淘宝的 Sea.js，只不过它实现的是另外一个标准，叫作 CMD，这个标准类似于 CommonJS，在使用上基本和 Require.js 相同，可以算上是重复的轮子。但随着前端技术的发展，Sea.js 后来也被 Require.js 兼容了。
```
// Require.js 兼容CommonJS规范
// 所有模块都通过define 来定义
define(function(require, exports, module) {
    // 通过require 引入依赖
    var $ = require('jquery')
    // 通过exports 或者 moudle.exports 对外暴露成员
    module.exports = function() {
        console.log('module 2')
        $('body').append('<p>module2</p>')
    }
})
```

### 模块化标准规范
尽管上面介绍的这些方式和标准都已经实现了模块化，但是都仍然存在一些让开发者难以接受的问题。

随着技术的发展，JavaScript 的标准逐渐走向完善，可以说，如今的前端模块化已经发展得非常成熟了，而且对前端模块化规范的最佳实践方式也基本实现了统一。

+ 在 Node.js 环境中，我们遵循 CommonJS 规范来组织模块。
+ 在浏览器环境中，我们遵循 ES Modules 规范。
而且在最新的 Node.js 提案中表示，Node 环境也会逐渐趋向于 ES Modules 规范，也就是说作为现阶段的前端开发者，应该重点掌握 ES Modules 规范。

因为 CommonJS 属于内置模块系统，所以在 Node.js 环境中使用时不存在环境支持问题，只需要直接遵循标准使用 require 和 module 即可。

但是对于 ES Modules 规范来说，情况会相对复杂一些。我们知道 ES Modules 是 ECMAScript 2015（ES6）中才定义的模块系统，也就是说它是近几年才制定的标准，所以肯定会存在环境兼容的问题。在这个标准刚推出的时候，几乎所有主流的浏览器都不支持。但是随着 Webpack 等一系列打包工具的流行，这一规范才开始逐渐被普及。

经过 5 年的迭代， ES Modules 已发展成为现今最主流的前端模块化标准。相比于 AMD 这种社区提出的开发规范，ES Modules 是在语言层面实现的模块化，因此它的标准更为完善也更为合理。而且目前绝大多数浏览器都已经开始能够原生支持 ES Modules 这个特性了，所以说在未来几年，它还会有更好的发展，短期内应该不会有新的轮子出现了。

综上所述，如何在不同的环境中去更好的使用 ES Modules 将是你重点考虑的问题。

## CommonJs
伴随 nodejs 而诞生的 commonjs 规范。commonjs 规范应用于 nodejs 应用中，在 nodejs 应用中每个文件就是一个模块，拥有自己的作用域，文件中的变量、函数都是私有的，与其他文件相隔离。
CommonJS规范规定，每个模块内部， module 变量代表当前模块。这个变量是一个对象，它的 exports 属性（即 module.exports ）是对外的接口。加载某个模块，其实是加载该模块的 module.exports 属性。

```
// util\index.js
let name = 'now';
let age = 18;

let fun = () => {
    console.log('into fun');
    name = 'change'
}

module.exports = {
    name,
    fun
}
console.log(module)

// appJsBridge\index.js
var { name, fun } = require('./util/index.js')
```
上面这个文件有两个变量，一个函数，通过 module.exports 暴露变量 name 和函数 fun ,age 这个变量就是私有的，外部无法直接访问，如果想让 age 变量全局都可以访问，那么可以改成 global.age = 18 ，但这样子会污染全局作用域.
!()[./assets/images/module.jpg]

module 中有这些属性

module.id 模块的识别符，通常是带有绝对路径的模块文件名。module.filename 模块的文件名，带有绝对路径。module.loaded 返回一个布尔值，表示模块是否已经完成加载。module.parent 返回一个module对象，表示调用该模块的模块，如果改该模块没有被引用，那么 parent 就是 null module.children 返回一个module数组，表示该模块要用到的其他模块。module.exports 表示模块对外输出的值。module.paths 这个用于 require 查找该文件的位置。
在开发中我们常使用的就是 module.exports ， 通过 module.exports 输出的对象就是引用方 require 出来的值

### require
既然有 module.exports 导出，那么就有与之相对应的 require 导入，如下
var { name, fun, object } = require('./util/index.js') // 不用解构，直接导出对象也可以使用 require 我们最关心的就是文件路径，这里还是引用阮一峰老师的解释

根据参数的不同格式，require命令去不同路径寻找模块文件。

1. 如果参数字符串以“/”开头，则表示加载的是一个位于绝对路径的模块文件。比如，require('/home/marco/foo.js')将加载/home/marco/foo.js。

2. 如果参数字符串以“./”开头，则表示加载的是一个位于相对路径（跟当前执行脚本的位置相比）的模块文件。比如，require('./circle')将加载当前脚本同一目录的circle.js。

3. 如果参数字符串不以“./“或”/“开头，则表示加载的是一个默认提供的核心模块（位于Node的系统安装目录中），或者一个位于各级node_modules目录的已安装模块（全局安装或局部安装）。大家还记得 module.paths 吧，这里就派上用场了。举例来说，脚本/home/user/projects/foo.js执行了require('bar.js')命令，Node会依据 module.paths 路径加上文件名称，依次搜索。这样设计的目的是，使得不同的模块可以将所依赖的模块本地化。

4. 如果参数字符串不以“./“或”/“开头，而且是一个路径，比如require('example-module/path/to/file')，则将先找到example-module的位置，然后再以它为参数，找到后续路径。

5. 如果指定的模块文件没有发现，Node会尝试为文件名添加.js、.json、.node后，再去搜索。.js件会以文本格式的JavaScript脚本文件解析，.json文件会以JSON格式的文本文件解析，.node文件会以编译后的二进制文件解析。所以文件名的后缀可以省略。

6. 如果想得到require命令加载的确切文件名，使用require.resolve()方法。

### module.exports 和 exports
我们还可以导出 exports 直接使用，但需要注意一点，exports 是已经定义的常量，在导出的时候不能在给它定义，如下

```
let exports = module.exports // 错误 #region exports  Identifier 'exports' has already been declared
exports = module.exports; // 正确的
```
使用 exports 我们可以这么导出对象，但需要注意一点，在导出对象前不能修改 exports 的指向，若修改 exports 就与 module.exports 不是一个东西了，当然你可以在导出对象后随意修改，这时候就不会影响导出。

```
exports = module.exports
// exports = ()=>{} 不能修改
exports.fun = () => {
    console.log('into fun');
    name = 'change'
}
exports.name = 'now';
// exports = ()=>{} 随你改
```

单独使用 exports 和 module.exports 其实没啥区别，个人建议还是使用 module.exports ，毕竟这才是常规稳妥的写法。

### 隔离性
commonjs 规范是在运行时加载的，在运行时导出对象，导出的对象与原本模块中的对象是隔离的，简单的说就是克隆了一份。看下面这个栗子

```
// util\index.js
let object = {
    age: 10
}
let fun = function() {
    console.log('modules obj', object);
    object = { age: 99 }
}
module.exports = {
    fun,
    object
}

// index.js
var { name, fun, object } = require('./util/index.js')
console.log('before fun', object)
fun()
console.log('end fun', object)
```
执行 node index.js 看看打印

```
before fun { age: 10 }
modules obj { age: 10 }
end fun { age: 10 }
```
引用方调用了导出的 fun 方法，fun 方法改变了模块中的 object 对象，可是在 index.js 中导出的 object 对象并没有发生改变，所以可见 commonjs 规范下模块的导出是深克隆的。

### 在浏览器中使用 commonjs 规范 browserify
因为浏览器中缺少 module exports require global 这个四个变量，所以在浏览器中没法直接使用 commonjs 规范，非要使用就需要做个转换，使用 browserify ，它是常用的 commonjs 转换工具，可以搭配 gulp webpack 一起使用。看下经过 browserify 处理后的代码，就截取了些关键部分。
我把核心代码复制出来，大致的结构如下，browserify 给每一个模块都设置了一个唯一 id ，通过模块路径来映射模块id，以此来找到各个模块。、

原本模块中的代码被有 require module exports 这三个参数的函数所包裹，其中 require 用来加载其他模块，exports 用来导出对象。
```
!function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a)
                    return a(o, !0);
                if (i)
                    return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND",
                f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n || e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++)
        s(r[o]);
    return s
}({
    1:[function(require, module, exports) {
        "use strict"
    },{"babel-runtime/helpers/classCallCheck": 2},[3,4]},
    2: [function(require, module, exports) {
        "use strict";
        exports.__esModule = !0,
        exports["default"] = function(instance, Constructor) {
            if (!(instance instanceof Constructor))
                throw new TypeError("Cannot call a class as a function")
        }
    }
    , {}]
},{},[])
```

## ES6模块化
ECMA推出了官方标准的模块化解决方案，使用 export 导出，import 导入，编码简洁，从语义上更加通俗易懂。

ES6 支持异步加载模块 的模块不是对象，而是在编译的时候就完成模块的引用，所以是编译时才加载的。

个人认为，ES6模块化是以后的主流。

还是上面的栗子，用ES6模块化改写，改动上并不大，几个关键字做下修改即可
```
// util/index.js
let name = 'now';

let fun = () => {
    name = 'change'
}

export {
    name,
    fun
}
// app.js
import { name, fun } from "../util";
console.log('before fun', object)
fun()
console.log('end fun', object)
```
### 浏览器中使用
但是ES6模块化在浏览器上的支持并不是很好，大部分浏览器还是不支持，所以需要做转换

1. 不使用 webpack ，使用 gulp 等构建流工具，那么我们需要使用babel将 es6 转成 es5 语法
使用 babel 转换，在babel 配置文件 .babelrc 写上
```
{
"presets": ["es2015"]
}
```
在使用 browserify 对模块规范进行转换。

2. 若使用 webpack ，webpack 是支持 es6 模块化的，所以就只要引用 babel-loader ，对 es6 的语法做处理即可
### 模块的导出是对象的引用
ES6模块化下的导出是对象的引用，我们看下面这个栗子

```
// util/index.js
let name = 'now';

let fun = () => {
    name = 'change';
}
let getName = function() {
    console.log('module:',name)
}

export {
    name,
    fun,
    getName
}
// app.js
import { name, fun, getName } from "../util";
console.log("before fun:", name);
fun();
console.log("after fun:", name);
name = "change again";
getName();
```
我们看看输出

```
before fun: now
after fun: change
module: change
```
可见，模块内部函数改变了模块内的对象，外部导出使用的对象也跟着发生了变化，这一点是和 commonjs 规范区别最大的地方，这个特性可用于状态提升。

### ES6 模块规范和 commonjs 规范 运行机制的区别
CommonJS 模块是运行时加载，ES6 模块是编译时输出接口

+ 运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。

+ -编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。

CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。