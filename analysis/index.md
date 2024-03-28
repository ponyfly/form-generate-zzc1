# 表单生成

在公司开发过程中，我们经常会遇到表单的开发，表单的开发是一个重复性工作，我们可以通过低代码的形式来生成表单，提高开发效率。

## 需求分析
我们需要一个表单生成器，可以通过拖拽的形式生成表单，表单的组件有输入框、下拉框、单选框、多选框、日期选择器等，我们可以通过拖拽这些组件到画布区，然后配置这些组件的属性，最后生成一个JSON数据，这个JSON数据可以用来生成表单。

## 功能分析
1. 编辑器功能
    - 拖拽组件到画布区
    - 配置组件属性
    - 生成JSON数据
2. 解析器功能
    - 解析JSON数据
    - 生成表单

## 技术选型
因为我们司内的前端框架是基于Vue的，UI框架为iview，所以我们选择：
+ 开发框架：Vue
+ UI框架：iview

## 设计
### 数据结构
低代码的核心是数据结构，我们需要设计一个数据结构，这个数据结构可以描述一个表单，最后我们也需要用这个数据来生成我们的表单，因为我们只涉及到表单的生成，所以只需要设计表单项的数据结构，举例如下：
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
这个数据结构描述了一个输入框的属性，我们可以根据这个数据结构生成一个输入框。
属性说明：
- `__config__`：配置属性，这个JSON中配置是给报过组件的formItem消费的
- 其余的属性则是给组件消费的

### 页面设计
我们需要设计一个页面，这个页面有三个区域：
1. 物料区：用来展示可用组件
2. 画布区：用来展示拖拽的组件
3. 配置区：用来配置组件属性


