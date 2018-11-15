const mpvueSimple = require('mpvue-simple')

// build for signel Page
mpvueSimple.build()

// or more options
mpvueSimple.build({
    output: 'mp-pages',
    pageName: 'login'
})

// maybe you want to do something after building
mpvueSimple.build() // => Promise
    .then(() => console.log('mpvue build success'))
    .catch(err => console.err('error'))