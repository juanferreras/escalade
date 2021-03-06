const chokidar = require('chokidar')
const { remove } = require('fs-extra')
const touch = require('touch')
const glob = require('globby')

// Add babel plugin
exports.onCreateBabelConfig = ({ actions }) => {
	actions.setBabelPlugin({
		name: 'styled-jsx/babel',
		options: { plugins: ['styled-jsx-plugin-postcss'] },
	});
};

// Watch CSS files
exports.onCreateWebpackConfig = ({ stage, actions }, options) => {
	if (stage === `develop`) {
		options = {
			watchCss: true,
			watch: 'src/**/*.css',
			remove: `node_modules/.cache`,
			touch: `src/**/*.js`,
			...options,
		}
		if (options.watchCss) {
			const watcher = chokidar.watch(options.watch)
			watcher.on(`change`, event => {
				remove(options.remove)
					.then(() => glob(options.touch))
					.then(files => {
						return Promise.all(files.map(file => {
							return touch(file)
						}))
					})
					.catch(console.error)
			})
			process.on(`exit`, () => watcher.close())
		}
	}

	return actions
}
