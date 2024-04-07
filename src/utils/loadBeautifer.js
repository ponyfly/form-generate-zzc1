// 动态加载monaco
import loadScript from "@/utils/loadScript";
import ElementUI from "element-ui";
import npmModulesUrls from "@/utils/npmModulesUrls";

let beautifierObj;

export default function loadBeautifier(cb) {
	const { beautifierUrl } = npmModulesUrls;
	if (beautifierObj) {
		cb(beautifierObj);
		return;
	}

	const loading = ElementUI.Loading.service({
		fullscreen: true,
		lock: true,
		text: "格式化资源加载中...",
		spinner: "el-icon-loading",
		background: "rgba(255, 255, 255, 0.5)"
	});

	loadScript(beautifierUrl, () => {
		loading.close();
		// eslint-disable-next-line no-undef
		beautifierObj = beautifier;
		cb(beautifierObj);
	});
}
