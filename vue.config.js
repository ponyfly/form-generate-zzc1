
const minify = process.env.NODE_ENV === 'development' ? false : {
	collapseWhitespace: true,
	removeComments: true,
	removeRedundantAttributes: true,
	removeScriptTypeAttributes: true,
	removeStyleLinkTypeAttributes: true,
	useShortDoctype: true,
	minifyCSS: true,
	minifyJS: true
}

module.exports = {
  transpileDependencies: true,
	publicPath: process.env.NODE_ENV === 'production'
		? '/form-generator/'
		: '/',
	pages: {
		index: {
			entry: 'src/views/index/main.js',
			template: 'public/index.html',
			filename: 'index.html',
			chunks: ['chunk-vendors', 'chunk-common', 'index'],
			minify
		},
		preview: {
			entry: 'src/views/preview/main.js',
			template: 'public/preview.html',
			filename: 'preview.html',
			chunks: ['chunk-vendors', 'chunk-common', 'preview'],
			minify
		}
	},
	configureWebpack: {
		externals: {
			vue: 'Vue',
			'vue-router': 'VueRouter',
			'element-ui': 'ELEMENT'
		}
	},
}
