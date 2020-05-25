const express = require('express') // import express
const bodyParser = require('body-parser') // import body-parser
const graphqlHttp = require('express-graphql') // import graphql to use as middleware
const { buildSchema } = require('graphql') // import the function to build our schema
const mongoose = require('mongoose') // impor the mongoose drivers
const Blog = require('./models/blog')

const app = express() // create express server

app.use(bodyParser.json()) // use body-parser middleware to parse incoming json

app.use('/graphql', graphqlHttp({ // set up our graphql endpoint with the express-graphql middleware
    // build a graphql schema
    schema: buildSchema(`
        type Blog {
            _id: ID!
            title: String!
            text: String!
            description: String!
            date: String
        }

        input BlogInput {
            title: String!
            text: String!
            description: String!
            date: String
        }


        type blogQuery {
            blogs: [Blog!]!
        }

        type blogMutation {
            createBlog(blogInput: BlogInput): Blog
        }

        schema {
            query: blogQuery
            mutation: blogMutation
        }
    `),
    rootValue: {
        blogs: () => {

            // return all the blogs unfiltered using Model
            return Blog.find().then(blogs => {
                return blogs
            }).catch(err => {
                throw err
            })
        },
        createBlog: (args) => {

            const blog = new Blog({
                title: args.blogInput.title,
                text: args.blogInput.text,
                description: args.blogInput.description,
                date: new Date()
            })

            // save new blog using model which will save in MongoDB
            return blog.save().then(result => {
                console.log(result)
                return result
            }).catch(err => {
                console.log(err)
                throw err
            })
        }
    }, // an object with resolver functions
    graphiql: true // enable the graphiql interface to test our queries
}))

// connect to our MongoDB server.
mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@test-4uyiw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`
).then(() => {

    app.listen(5000) // setup server to run on port 5000

}).catch(err => {
    console.log(err)
})

