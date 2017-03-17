var hbs = {
  templateData: {
    template1: {
      foo: 'bar'
    },
    template2: {
      foo2: 'bar2'
    }
  },
  helpers: {
    sampleHelper: function (p) {
      return p + 1
    }
  }
}

module.exports = hbs
