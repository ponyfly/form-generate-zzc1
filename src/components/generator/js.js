import {cloneDeep} from "lodash-es";
import ruleTrigger from "@/components/generator/ruleTrigger";

let confGlobal;

const inheritAttrs = {
	file: '',
	dialog: 'inheritAttrs: false,'
}
export function cookJs(formConfig, type) {
	confGlobal = formConfig = cloneDeep(formConfig)
	const dataList = []
	const ruleList = []
	const optionsList = []
	const propsList = []
	const methodList = mixinMethod(type)
	const uploadVarList = []
	const created = []

	formConfig.fields.forEach(el => {
		buildAttributes(el, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, created)
	})

	const script = buildexport(
		formConfig,
		type,
		dataList.join('\n'),
		ruleList.join('\n'),
		optionsList.join('\n'),
		uploadVarList.join('\n'),
		propsList.join('\n'),
		methodList.join('\n'),
		created.join('\n')
	)

	confGlobal = null
	return script
}

function mixinMethod(type) {
	const list = []
	const mixins = {
		file: confGlobal.formBtns ? {
			submitForm: `submitForm() {
				this.$refs['${confGlobal.formRef}'].validate(valid => {
					if(!valid) return
					// TODO 提交表单
				})
			},`,
			resetForm: `resetForm() {
				this.$refs['${confGlobal.formRef}'].resetFields()
			},`
		} : null,
		dialog: {
			onOpen: 'onOpen() {},',
			onClose: `onClose() {
				this.$refs['${confGlobal.formRef}'].resetFields()
			},`,
			close: `close() {
				this.$emit('update:visible', false)
			},`,
			handelConfirm: `handelConfirm() {
				this.$refs['${confGlobal.formRef}'].validate(valid => {
					if(!valid) return
					this.close()
				})
			},`
		}
	}
	const methods = mixins[type]

	if (methods) {
		Object.keys(methods).forEach(key => {
			list.push(methods[key])
		})
	}

	return list
}
// eslint-disable-next-line no-unused-vars
function buildAttributes(schema, dataList, ruleList, optionsList, methodList, propsList, uploadVarList, created) {
	// const config = schema.__config__
	const slot = schema.__slot__

	buildData(schema, dataList)
	buildRules(schema, ruleList)

	// 特殊处理options属性
	if(slot && slot.options && slot.options.length) {
		buildOptions(schema, optionsList)
	}

	// 处理props

	// 处理el-upload的action

	// 构建子级组件属性
}

function buildData (schema, dataList) {
	const config = schema.__config__
	if (config.__vModel__) {
		const defaultValue = JSON.stringify(config.defaultValue)
		dataList.push(`${schema.__vModel__}: ${defaultValue},`)
	}
}

function buildRules(schema, ruleList) {
	const config = schema.__config__
	if (schema.__vModel__ === undefined) return
	const rules = []
	if (ruleTrigger[config.tag]) {
		if(config.required) {
			const type = Array.isArray(config.defaultValue) ? 'type: \'array\',' : ''
			const message = Array.isArray(config.defaultValue) ? `请至少选择一个${config.label}` : (schema.placeholder || `${config.label}不能为空`)
			rules.push(`{ required: true, ${type} message: '${message}', trigger: '${ruleTrigger[config.tag]}' }`)
		}
		if (config.regList && config.regList.length) {
			config.regList.forEach(item => {
				if (item.pattern) {
					rules.push(`{ pattern: ${item.pattern}, message: '${item.message}', trigger: '${ruleTrigger[config.tag]}' }`)
				}
			})
		}
	}

	ruleList.push(`${schema.__vModel__}: [${rules.join(',')}],`)
}

function buildOptions(schema, optionsList) {
	if (schema.__vModel__ === undefined) return
	let { options } = schema
	if (!options) options = schema.__slot__.options
	if (schema.__config__.dataType === 'dynamic') { options = [] }
	const str = `${schema.__vModel__}Options: ${JSON.stringify(options)},`
	optionsList.push(str)
}

function buildexport(formConfig, type, data, rules, options, uploadVar, props, methods, created) {
	const str = `export default {
	${inheritAttrs[type]}
	components: {},
	props: {},
	data() {
		return {
			${formConfig.formModel}: {
				${data}
			},
			${formConfig.formRules}: {
				${rules}
      },
      ${options}
		}
	},
	computed: {},
	watch: {},
	created() {
		${created}
	},
	mounted() {},
	methods: {
		${methods}
	}
}`
	return str
}
