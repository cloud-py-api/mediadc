module.exports = {
	preset: '@vue/cli-plugin-unit-jest/presets/no-babel',
	testMatch: ['**/tests/**/*.spec.js'],
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: 'coverage',
	coverageProvider: 'v8',
	coverageReporters: ['json','text','lcov','clover','html'],
	collectCoverageFrom: ['./src/**'],
	transformIgnorePatterns: [
		// '<rootDir>/node_modules/',
	],
	unmockedModulePathPatterns: [
		'<rootDir>/node_modules/(?!@nextcloud/moment)',
	],
	moduleNameMapper: {
		"^.+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2)$": "jest-transform-stub"
	},
	testEnvironment: 'jsdom',
	transform: {
		'.*\\.(vue)$': '@vue/vue2-jest',
		'^.+\\.js$': '<rootDir>/node_modules/babel-jest',
	}
}
