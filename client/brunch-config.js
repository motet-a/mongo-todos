exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': /^(?!app)/, // Files that are not in `app` dir.
      'app.js': /^app/
    },
  },

  stylesheets: {
    joinTo: 'app.css'
  }
}

exports.modules = {
  autoRequire: {
    'app.js': ['index']
  }
}

exports.plugins = {
  babel: {
    presets: ['env'],
    plugins: ['transform-class-properties', 'syntax-object-rest-spread']
  }
}

exports.overrides = {
  production: {
    sourceMaps: true
  }
}
