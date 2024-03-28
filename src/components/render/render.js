import {cloneDeep} from "lodash-es";

const componentChild = {}

const slotsFiles = require.context('./slots', false, /\.js$/) // require.context() 方法接受三个参数：要搜索的文件夹目录，是否还应该搜索它的子目录，以及一个匹配文件的正则表达式。`
const keys = slotsFiles.keys() || [] // keys() 方法返回一个数组，其中包含匹配给定正则表达式的模块的键。
keys.forEach(key => {
	const tag = key.replace(/^\.\/(.*)\.\w+$/, '$1') // 提取文件名
	const value = slotsFiles(key).default // 提取文件内容
	componentChild[tag] = value // 挂载到对象componentChild上
})

function makeDataObject() {
	// 深入数据对象：
	// https://cn.vuejs.org/v2/guide/render-function.html#%E6%B7%B1%E5%85%A5%E6%95%B0%E6%8D%AE%E5%AF%B9%E8%B1%A1
	return {
		class: {},
		attrs: {},
		props: {},
		domProps: {},
		nativeOn: {},
		on: {},
		style: {},
		directives: [],
		scopedSlots: {},
		slot: null,
		key: null,
		ref: null,
		refInFor: true
	}
}

function vModelHandler(dataObject, defaultValue) {
	dataObject.props.value = defaultValue
	dataObject.on.input = val => {
		this.$emit('input', val)
	}
}

function mountSlotFiles(h, confClone, children) {
	const childObjs = componentChild[confClone.__config__.tag]
	if (childObjs) {
		Object.keys(childObjs).forEach(key => {
			const childFunc = childObjs[key]
			if (confClone.__slot__ && confClone.__slot__[key]) {
				children.push(childFunc(h, confClone, key))
			}
		})
	}
}

function buildDataObject(confClone, dataObject) {
	Object.keys(confClone).forEach(key => {
		const val = confClone[key]
		if(key === '__vModel__') {
			vModelHandler.call(this, dataObject, confClone.__config__.defaultValue)
		} else if(dataObject[key] !== undefined) {
			if (dataObject[key] === null
				|| dataObject[key] instanceof RegExp
				|| ['boolean', 'string', 'number', 'function'].includes(typeof dataObject[key])) {
				dataObject[key] = val
			} else if(Array.isArray(dataObject[key])) {
				dataObject[key] = [...dataObject[key], ...val]
			} else {
				dataObject[key] = {...dataObject[key], ...val}
			}
		} else {
			// 将属性挂载到attrs上，然后在render函数中使用，传给组件
			dataObject.attrs[key] = val
		}
	})
}

export default {
	props: {
		conf: {
			type: Object,
			required: true
		}
	},
	render(h) {
		const dataObject = makeDataObject()
		const children = this.$slots.default || []
		const confClone = cloneDeep(this.conf)

		// 插入slot
		mountSlotFiles.call(this, h, confClone, children)

		buildDataObject.call(this, confClone, dataObject)

		return h(this.conf.__config__.tag, dataObject, children)
	}
}
