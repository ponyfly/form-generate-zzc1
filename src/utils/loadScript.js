const callbacks = {}

const fallback = () => {}
export default function loadScript(src, callback) {
	const existingScript = document.getElementById(src)
	const cb = callback || fallback
	if (!existingScript) {
		callbacks[src] = []
		const scriptDom = document.createElement('script')
		scriptDom.src = src
		scriptDom.id = src
		scriptDom.async = 1
		document.body.appendChild(scriptDom)
		const onEnd = standardOnEnd.bind(scriptDom)
		onEnd(scriptDom)
	}

	callbacks[src].push(cb)

	function standardOnEnd(scriptDom) {
		scriptDom.onload = () => {
			this.onerror = this.onload = null
			callbacks[src].forEach(item => {
				item(null, scriptDom)
			})
			delete callbacks[src]
		}
		scriptDom.onerror = () => {
			this.onerror = this.onload = null
			cb(new Error(`Failed to load ${src}`), scriptDom)
		}
	}
}

/**
 * 顺序加载一组远程脚本
 * @param list
 * @param cb
 */
export function loadScriptQueue(list, cb) {
	const first = list.shift()
	list.length ? loadScript(first, () => loadScriptQueue(list, cb)) : loadScript(first, cb)
}
