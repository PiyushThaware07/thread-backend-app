import express from "express";
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import bodyParser from 'body-parser';
import { prismaClient } from "./db";  // Import prisma client

async function init() {
    const app = express();
    const port = Number(process.env.PORT) || 8000;

    // * Create GraphQL Server
    const gqlServer = new ApolloServer({
        typeDefs: `
        type Query {
            hello: String
        }
        
        type Mutation {
            createUser(
                firstName: String!, 
                lastName: String!, 
                email: String!, 
                password: String!, 
                salt: String!, 
                imgUrl: String!
            ): String
        }
        `,
        resolvers: {
            Query: {
                hello: () => "Hey there, I am a GraphQL server",
            },
            Mutation: {
                createUser: async (_, {
                    firstName,
                    lastName,
                    email,
                    password,
                    salt,
                    imgUrl
                }: {
                    firstName: string,
                    lastName: string,
                    email: string,
                    password: string,
                    salt: string,
                    imgUrl: string
                }) => {
                    // Create user in the database using prismaClient
                    await prismaClient.user.create({
                        data: {
                            firstName,
                            lastName,
                            email,
                            password,
                            salt,
                            imgUrl
                        }
                    });
                    return `User ${firstName} ${lastName} created successfully with email ${email}`;
                }
            }
        }
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
