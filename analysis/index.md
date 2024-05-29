# 手搓低代码表单（一）工欲善其事

在开发过程中，经常会遇到表单开发，表单开发是一个重复性工作，我们可以通过低代码的形式来生成表单，提高开发效率。

从今天开始我们一步步实现低代码表单。

## 需求分析
大家见过市面上的一些低代码平台，直观上看，这些低代码平台有一些共性，他们都包括三个区域：
+ 左边的物料区
+ 中间的画布区
+ 右边的属性区

从流程上看，就是从物料区拖拽到画布区，然后配置属性，生成表单，我们也将按照这样的布局来实现我们的低代码表单玩具。

在正式开始撸码之前，我们先思考一下，我们要的是什么？站在业务的角度来看，我们在低代码平台中，通过拖拉拽的方式快速生成一个表单，那么这个表单如何描述呢？在业务使用中，如何使用这个表单呢？
其实最好的方式就是低代码平台将页面结构、组件配置、样式布局等信息以结构化的方式存储到数据库中，例如使用 JSON 或 XML 等。这里我们将使用 JSON 来描述表单。

## 技术栈
技术栈笔者使用了不vue+element-ui

## 方案设计
### 数据结构
低代码平台的核心在于如何用数据结构来描述和生成 UI 组件。下面是一个可以描述表单项的数据结构设计
举例如下：
#### 表单项数据结构设计
```js
const inputJson = {
  __config__: {
    label: '单行文本',
    labelWidth: null,
    showLabel: true,
    changeTag: true,
    tag: 'el-input',
    tagIcon: 'input',
    defaultValue: undefined,
    required: true,
    layout: 'colFormItem',
    span: 24,
    document: 'https://element.eleme.cn/#/zh-CN/component/input',
    // 正则校验规则
    regList: []
  },
  // 组件的插槽属性
  __slot__: {
    prepend: '',
    append: ''
  },
  // 其余的为可直接写在组件标签上的属性
  placeholder: '请输入',
  style: { width: '100%' },
  clearable: true,
  'prefix-icon': '',
  'suffix-icon': '',
  maxlength: null,
  'show-word-limit': false,
  readonly: false,
  disabled: false
}
```
#### 使用数据结构生成表单
以上数据结构描述了一个输入框的属性，我们可以根据这个数据结构生成一个输入框。
- `__config__`：配置属性，这个JSON中配置是给报过组件的formItem消费的
- 其余的属性则是给组件消费的

1. 解析数据： 将上述 JSON 格式的表单项数据解析为 JavaScript 对象。
2. 渲染表单项：

+ 根据 tag 属性，选择对应的表单项组件进行渲染，例如 <el-input>, <el-select> 等。
+ 根据 `__config__`中的属性label, labelWidth, defaultValue 等属性设置`el-form-item`的对应属性。
+ 根据 `rules` 属性配置表单项的验证规则。
+ 根据 `options` 属性渲染下拉选择框、单选框、复选框等类型的选项。
+ 根据 `placeholder` , `style` ,`clearable`等属性设置其他特定于表单项类型的属性。
+ 根据 `__slot__` 属性设置组件的插槽属性。

3. 表单布局： 布局的话我们就使用elementUI的布局，自定义的操作余地不大，也没必要搞那么复杂。

### 页面设计
页面有三个区域：
1. 物料区：用来展示可用组件
2. 画布区：用来展示拖拽的组件
3. 配置区：用来配置组件属性

我们先设计一个简单的页面，然后再逐步完善。代码如下：
```html
<div class="left-board"></div>
<div class="center-board"></div>
<div class="right-board"></div>
```
#### 物料区
我们先来搭建物料区，物料区的数据源是从配置文件中获取的，示例如下：
我们把输入型的组件配置放在一个数组中，然后循环遍历这个数组，生成多个组件。
```js
// 配置文件
export const inputComponents = [
	{
		__config__: {
			tag: 'el-input',
			// ...other props
		}
		// ...other props
	},
	{
		__config__: {
			tag: 'el-input-number',
			// ...other props
		}
		// ...other props
	},
  
]
```
```vue
<template>
  <div v-for="(item, index) in leftComponents" :key="index">
    <div class="components-title">{{ item.title }}</div>
    <draggable
        class="components-draggable"
        :list="item.list"
        :group="{ name: 'componentsGroup', pull: 'clone', put: false }"
        :clone="cloneComponent"
        draggable=".components-item"
        :sort="false"
        @end="endHandler"
    >
      <div v-for="(component, index) in item.list" :key="index" class="components-item" @click="addComponent(component)">
        <div class="components-body">{{ component.__config__.label }}</div>
      </div>
    </draggable>
  </div>
</template>
<script>
  import draggable from 'vuedraggable'
  export default {
		data() {
          return {
            leftComponents: [
              {
                title: '输入型组件',
                list: inputComponents
              },
              // {
              //   title: '选择型组件',
              //   list: selectComponents
              // }
            ]
          }
		}
  }
</script>
```
上面的代码搭建了物料区，我们通过循环遍历配置文件，生成多个组件，这里我们通过`vuedraggable`组件来实现拖拽功能，关于`vuedraggable`组件的用法，请参考官方文档,这里我们不过多赘述

## 总结
今天分享了低代码表单的架构设计，我们通过数据结构来描述表单项，然后根据数据结构生成表单，物料区来展示可用的组件，通过画布区来展示拖拽的组件，通过配置区来配置组件属性。
我们重点讲解了数据结构设计，以及物料区的实现，代码比较简单，很好理解，希望对大家有所帮助。

后续我们将继续完善画布区的渲染和配置区的实现。

下一期我们将完善画布区的渲染，敬请期待！

> 如果觉得本文有帮助 记得点赞三连哦 十分感谢！



