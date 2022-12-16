const path = require('path')
const webpackConfig = require('@nextcloud/webpack-vue-config')
const webpackRules = require('@nextcloud/webpack-vue-config/rules')

webpackConfig.entry['settings'] = path.join(__dirname, 'src', 'main-admin-settings.js')
webpackConfig.entry['dashboard'] = path.join(__dirname, 'src', 'main-dashboard.js')
webpackConfig.entry['filesplugin'] = path.join(__dirname, 'src', 'filesplugin.js')

webpackConfig.module.rules = Object.values(webpackRules)

module.exports = webpackConfig
