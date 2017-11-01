const htmlStandards = require('reshape-standard')
const cssStandards = require('spike-css-standards')
const jsStandards = require('spike-js-standards')
const Records = require('spike-records')
const path = require('path')
const MarkdownIt = require('markdown-it')

const md = new MarkdownIt()
const locals = {
  md: md.render.bind(md),
  mediaUrl: 'https://media.graphcms.com'
}
const apiUrl = 'https://api.graph.cool/simple/v1/cj9fhgrrt0ci601299vqa2e20'

module.exports = {
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'views/templates/*.sgr'],
  reshape: htmlStandards({
    root: path.join(__dirname, 'views'),
    locals: (ctx) => locals
  }),
  postcss: cssStandards(),
  babel: jsStandards(),
  plugins: [
    new Records({
      addDataTo: locals,
      dishes: {
        graphql: {
          url: apiUrl,
          query: `{
            allDishes {
              name
            }
          }`
        },
        transform: (res) => {
          if(res.data && res.data.allDishes)
          {
            console.log(res.data.allDishes);
            return res.data.allDishes;
          }
          console.log(res.errors);
          return [];
        },
        template: {
          path: 'views/templates/dish.sgr',
          output: (dish) => `dish/${dish.slug}.html`
        }
      }
    })
  ]
}
