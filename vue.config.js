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
		}
	}
}
