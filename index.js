const { Neo4jGraphQL } = require("@neo4j/graphql");
const { ApolloServer, gql } = require("apollo-server");
// const typeDefs = require('./schema')

require('dotenv').config();
const neo4j = require("neo4j-driver");
const password = process.env.NEO4J_PASSWORD;

const driver = neo4j.driver(
    "bolt://localhost:7687",
    neo4j.auth.basic("neo4j", password)
);

const typeDefs = gql`
    type Movie {
        title: String
        actors: [Actor] @relationship(type: "ACTED_IN", direction: IN)
        startTime: DateTime
    }

    type Actor {
        name: String
        movies: [Movie] @relationship(type: "ACTED_IN", direction: OUT)
    }
`;

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: neoSchema.schema,
});

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});