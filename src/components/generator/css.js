function addCss(cssList, el) {
	if (el.__config__.children) {
		el.__config__.children.forEach(el2 => addCss(cssList, el2))
	}
}

export function cookCss(conf) {
	const cssList = []
	conf.fields.forEach(el => addCss(cssList, el))
	return cssList.join('\n')
}
