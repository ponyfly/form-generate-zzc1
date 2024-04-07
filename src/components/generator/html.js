import ruleTrigger from "@/components/generator/ruleTrigger";

let confGlobal
let someSpanIsNot24

const layouts = {
	colFormItem(scheme) {
		const config = scheme.__config__
		let labelWidth = ''
		let label = `label="${config.label}"`
		if (config.labelWidth && config.labelWidth !== confGlobal.label) {
			labelWidth = `label-width="${config.labelWidth}px"`
		}
		if(config.showLabel === false) {
			label = ''
			labelWidth = 'label-width="0"'
		}
		const required = ruleTrigger[config.tag] && config.required ? 'required' : ''
		const tagDom = tags[config.tag] ? tags[config.tag](scheme) : null
		let str = `<el-form-item ${label} ${labelWidth} ${required} prop="${scheme.__vModel__}">
				${tagDom}
				</el-form-item>`
		return str
	}
}

const tags = {
	'el-input': el => {
		const {tag, disabled, vModel, clearable, placeholder, width} = attrBuilder(el)
		const maxLength = el.maxlength ? `maxlength=="${el.maxlength}"` : ''
		const showWordLimit = el['show-word-limit'] ? 'show-word-limit' : ''
		const readonly = el.readonly ? 'readonly' : ''
		const prefixIcon = el['prefix-icon'] ? `prefix-icon='${el['prefix-icon']}'` : ''
		const suffixIcon = el['suffix-icon'] ? `suffix-icon='${el['suffix-icon']}'` : ''
		const showPassword = el['show-password'] ? 'show-password' : ''
		const type = el.type ? `type="${el.type}"` : ''
		const autosize = el.autosize && el.autosize.minRows
			? `:autosize="{minRows: ${el.autosize.minRows}, maxRows: ${el.autosize.maxRows}}"`
			: ''
		let child = buildElInputChild(el)

		if (child) child = `\n${child}\n`
		return `<${tag} ${vModel} ${clearable} ${placeholder} ${width} ${disabled} ${maxLength} ${showWordLimit} ${readonly} ${prefixIcon} ${suffixIcon} ${showPassword} ${type} ${autosize}>`
	}
}

function buildElInputChild(scheme) {
	const children = []
	const slot = scheme.__slot__
	if (slot && slot.prepend) {
		children.push(`<template slot="prepend">${slot.prepend}</template>`)
	}
	if (slot && slot.append) {
		children.push(`<template slot="append">${slot.append}</template>`)
	}
	return children.join('\n')
}

function attrBuilder(el) {
	return {
		tag: el.__config__.tag,
		vModel: `v-model="${confGlobal.formModel}.${el.__vModel__}"`,
		clearable: el.clearable ? 'clearable' : '',
		placeholder: el.placeholder ? `placeholder="${el.placeholder}"` : '',
		width: el.style && el.style.width ? ':style="{width: \'100%\'}"' : '',
		disabled: el.disabled ? ':disabled=\'true\'' : ''
	}
}

function buildFormTemplate(schema, child, type) {
	console.log(type)
	let labelPosition = ''
	if (schema.labelPosition !== 'right') {
		labelPosition = `label-position="${schema.labelPosition}"`
	}
	const disabled = schema.disabled ? `:disabled="${schema.disabled}"` : ''
	let str = `<el-form ref="${schema.formRef}" :model="${schema.formModel}" :rules="${schema.formRules}" label-width="${schema.labelWidth}px" ${labelPosition} ${disabled}>
		${child}
			</el-form>`
	if(someSpanIsNot24) {
		str = `<el-row :gutter="${schema.gutter}">
			${str}
			</el-row>`
	}
	return str
}


export function vueTemplate(str) {
	return `<template>
    <div>
      ${str}
    </div>
  </template>`
}


export function vueScript(str) {
	return `<script>
    ${str}
  </script>`
}

export function cssStyle(cssStr) {
	return `<style>
    ${cssStr}
  </style>`
}

export function cookHtml(formConfig, type) {
	const htmlList = []
	confGlobal = formConfig
	someSpanIsNot24 = formConfig.fields.some(item => item.__config__.span !== 24)

	formConfig.fields.forEach(el => {
		htmlList.push(layouts[el.__config__.layout](el))
	})

	const htmlStr = htmlList.join('\n')
	// 将组件代码放入form标签
	let res = buildFormTemplate(formConfig, htmlStr, type)

	if (type === 'dialog') {
		console.log('dialog')
	}
	confGlobal = null
	return res
}
