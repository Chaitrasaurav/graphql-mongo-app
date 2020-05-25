Available commands:

npm install

Graphql server:

localhost:5000/graphql

Push item to graphql:

mutation {
  createBlog(blogInput: {
    title: "Best Parks in Austin",
    text: "Zilker is the best park ...",
    description: "The best parks in ATX rated by yours truly!"
    date: "2019-06-11T15:53:43.964Z"})
  {
    _id
    title
  }
}

graphql query:

query {
  blogs{
    _id
    title
    description
  }
}