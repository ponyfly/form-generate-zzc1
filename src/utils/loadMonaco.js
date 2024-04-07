// 动态加载monaco
import loadScript from "@/utils/loadScript";
import ElementUI from "element-ui";
import npmModulesUrls from "@/utils/npmModulesUrls";

let monacoEidtor;

export default function loadMonaco(cb) {
	if (monacoEidtor) {
		cb(monacoEidtor);
		return;
	}

	const { monacoEditorUrl: vs } = npmModulesUrls;

	const loading = ElementUI.Loading.service({
		fullscreen: true,
		lock: true,
		text: "编辑器资源初始化中...",
		spinner: "el-icon-loading",
		background: "rgba(255, 255, 255, 0.5)"
	})
	!window.require && (window.require = {});
	!window.require.paths && (window.require.paths = {});
	window.require.paths.vs = vs;
	// loader.js负责装载window.require，也可以单独使用requirejs而非自带的loader.js去加载
	loadScript(`${vs}/loader.js`, () => {
		window.require(["vs/editor/editor.main"], () => {
			loading.close();
			monacoEidtor = window.monaco;
			cb(monacoEidtor);
		});
	});
}
