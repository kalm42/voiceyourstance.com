/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

require("ts-node").register({ files: true })

/** @type { import("gatsby").GatsbyNode["createPages"] } */
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions

  if (page.path.match(/^\/reps/)) {
    page.matchPath = `/reps/*`
    createPage(page)
  }
  if (page.path.match(/^\/write/)) {
    page.matchPath = `/write/*`
    createPage(page)
  }
}
