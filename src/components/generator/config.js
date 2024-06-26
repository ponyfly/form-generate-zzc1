export const formConf = {
	formRef: 'elForm',
	formModel: 'formData',
	size: 'medium',
	labelPosition: 'right',
	labelWidth: 100,
	formRules: 'rules',
	gutter: 15,
	disabled: false,
	span: 24,
	formBtns: true
}

export const inputComponents = [
	{
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
]

export const selectComponents = [
	{
		__config__: {
			label: '下拉选择',
			showLabel: true,
			labelWidth: null,
			tag: 'el-select',
			tagIcon: 'select',
			layout: 'colFormItem',
			span: 24,
			required: true,
			regList: [],
			changeTag: true,
			document: 'https://element.eleme.cn/#/zh-CN/component/select'
		},
		__slot__: {
			options: [{
				label: '选项一',
				value: 1
			}, {
				label: '选项二',
				value: 2
			}]
		},
		placeholder: '请选择',
		style: { width: '100%' },
		clearable: true,
		disabled: false,
		filterable: false,
		multiple: false
	}
]
