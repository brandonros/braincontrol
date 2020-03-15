const ejs = require('ejs')
const LRU = require('lru-cache')
const glob = require('glob')
const fs = require('fs')

let templatesInitialized = false

const initTemplates = () => {
  const filenames = glob.sync('./templates/**/*.ejs')
  const templates = filenames.reduce((prev, filename) => {
    const templateName = filename.replace('./templates', '')
    return Object.assign({}, prev, {
      [templateName]: fs.readFileSync(filename).toString()
    })
  }, {})
  ejs.fileLoader = (templateName) => {
    if (templates[templateName] === undefined) {
      throw new Error('Missing template: ' + templateName)
    }
    return templates[templateName]
  }
  ejs.cache = new LRU(256)
}

const renderTemplate = (name, model = {}) => {
  if (!templatesInitialized) {
    initTemplates()
    templatesInitialized = true
  }
  return ejs.renderFile(name, model)
}

module.exports = {
  renderTemplate
}
