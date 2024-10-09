import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';


async function init() {
    const app = express();
    const port = Number(process.env.PORT) || 8000;

    // * Create GraphQL Server
    const gqlServer = new ApolloServer({
        typeDefs: `
        type Query {
            hello : String
        }
        `,
        resolvers: {
            Query: {
                hello: () => "Hey there,I am a graphql server"
            }
        },
    });

    // * Start GraphQL server
    await gqlServer.start();

    // * Middleware for parsing JSON bodies (Express)
    app.use(bodyParser.json());

    // * Apply GraphQL middleware to Express
    app.use('/graphql', expressMiddleware(gqlServer));

    // * Basic route
    app.get("/", (req, res) => {
        res.send("Server Running");
    });

    // * Listen on the specified port
    app.listen(port, () => {
        console.log(`Server Running at http://localhost:${port}`);
        console.log(`GraphQL endpoint at http://localhost:${port}/graphql`);
    });
}

init().catch(error => {
    console.error('Error starting server:', error);
});
