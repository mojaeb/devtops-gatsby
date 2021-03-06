const path = require(`path`)
const fs = require('fs')

const generateAllPostsPage = require('./generatePage/postsPage')
const generatePostPage = require('./generatePage/postPage')
const generateAllCategoryPage = require('./generatePage/categoryPage')



exports.createPages = async ({graphql, actions}) => {
  const { createPage } = actions;
  const result = await graphql(`
        {
            allWordpressPost {
                edges {
                    node {
                        id
                        path
                        title
                        status
                        template
                        format
                        slug
                    }
                }
            }
            allWordpressCategory {
              edges {
                node {
                  id
                  count
                  slug
                }
              }
            }
              
        }
    `)
  if (result.errors) throw new Error(result.errors)
  const { allWordpressPost, allWordpressCategory } = result.data
  const postTemplate = path.resolve(`./src/templates/post.js`)
  const postsTemplate = path.resolve(`./src/templates/posts.js`)
  const categoriesTemplate = path.resolve(`./src/templates/posts-by-categories.js`)


  generatePostPage(allWordpressPost.edges, createPage, postTemplate)
  generateAllPostsPage(allWordpressPost.edges, createPage, postsTemplate)
  generateAllCategoryPage(allWordpressCategory.edges, createPage, categoriesTemplate)

  generateJsonFile(allWordpressPost.edges)
}

function generateJsonFile(allWordpressCategory) {
  const data = JSON.stringify(allWordpressCategory)
  const file = fs.writeFile("./data.json",data, () => {
    console.log("write")
  })
}