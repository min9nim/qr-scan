module.exports = function({ env }) {
  return {
    eslint: {
      enable: true /* (default value) */,
      mode: 'extends' /* (default value) */ || 'file',
      configure: (eslintConfig, { env, paths }) => {
        // console.log('eslintConfig', eslintConfig)
        return eslintConfig
      },
      loaderOptions: (eslintOptions) => {
        // console.log('eslintOptions', eslintOptions)
        return { ...eslintOptions, useEslintrc: true }
      },
    },
    plugins: [
      {
        plugin: require('craco-plugin-scoped-css'),
      },
    ],
  }
}
