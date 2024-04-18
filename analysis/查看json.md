# 查看json

查看json需要经过以下步骤：
1. 把js数据通过`JSON.stringify`转换为json字符串
2. 把json字符串美化为json格式
3. 通过在线编辑器将json数据展示出来

这里我们重点说下第二步和第三步。

## 把json字符串美化为json格式
这里我们依赖一个工具`js-beautify`,这里我们通过script标签引入js-beautify.js文件，然后调用`js_beautify`方法即可。

通过script标签加载js资源的方法我们已经抽象为一个函数`loadScript`，我们可以直接调用这个函数加载js-beautify.js文件。

```js
function loadScript(url, callback) {
    var script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function() {
            if (script.readyState == "loaded" || script.readyState == "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function() {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}
```
加载完成之后会暴露一个全局变量，我们用`js_beautify`接收，然后调用`js_beautify`的`js`方法。分别传入json字符串和一个配置对象，配置对象中的`indent_size`属性表示缩进的空格数。

```js
loadScript("https://cdn.bootcss.com/js-beautify/1.10.2/beautify.js", function() {
    var jsonStr = '{"name":"zhangsan","age":18}';
    var beautifyJson = js_beautify.js(jsonStr, {
        indent_size: 4
    });
    console.log(beautifyJson);
});
```

## 通过在线编辑器将json数据展示出来
这里我们依赖一个在线编辑器`monaco`，因为资源比较大（16M）,所以我们放在本地，通过本地加载的方式引入。引入的方式和普通js加载不一样，我们需要用到`requirejs`的方式，好在`monaco`提供了一个`loader.js`文件，我们可以直接引入这个文件，然后调用`require`方法加载`monaco`。
```js
loadScript("libs/monaco-editor/vs", function() {
    require(['vs/editor/editor.main'], function() {
        var jsonStr = '{"name":"zhangsan","age":18}';
        var editor = monaco.editor.create(document.getElementById('container'), {
            value: codeStr,
            theme: 'vs-dark',
            language: 'json',
            automaticLayout: true
        });
    });
});
```
经过以上两步，我们就可以查看json数据了。这里我们可以做一些其他额外的处理，当我们已经加载`js-beautify`和`monaco`之后，我们可以把这两个变量存起来，不需要每次都加载。
