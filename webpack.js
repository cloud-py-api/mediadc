const path = require('path')
const webpackConfig = require('@nextcloud/webpack-vue-config')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')

const BabelLoaderExcludeNodeModulesExcept = require('babel-loader-exclude-node-modules-except')

webpackConfig.entry['settings'] = path.join(__dirname, 'src', 'main-admin-settings.js')
webpackConfig.entry['dashboard'] = path.join(__dirname, 'src', 'main-dashboard.js')
webpackConfig.entry['filesplugin'] = path.join(__dirname, 'src', 'filesplugin.js')
webpackRules.RULE_JS.exclude = BabelLoaderExcludeNodeModulesExcept([
	'@nextcloud/event-bus',
	'@nextcloud/dialogs',
	'camelcase',
	'webdav',
])

// webpackRules.RULE_ASSETS.test = /\.(png|jpe?g|gif|woff2?|eot|ttf)$/
// webpackRules.RULE_RAW_SVGS = {
// 	test: /\.svg$/,
// 	loader: 'raw-loader',
// }

webpackConfig.module.rules = Object.values(webpackRules)

module.exports = webpackConfig
