"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const body_parser_1 = __importDefault(require("body-parser"));
const db_1 = require("./db"); // Import prisma client
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        const app = (0, express_1.default)();
        const port = Number(process.env.PORT) || 8000;
        // * Create GraphQL Server
        const gqlServer = new server_1.ApolloServer({
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
                    createUser: (_1, _a) => __awaiter(this, [_1, _a], void 0, function* (_, { firstName, lastName, email, password, salt, imgUrl }) {
                        // Create user in the database using prismaClient
                        yield db_1.prismaClient.user.create({
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
                    })
                }
            }
        });
        // * Start GraphQL server
        yield gqlServer.start();
        // * Middleware for parsing JSON bodies (Express)
        app.use(body_parser_1.default.json());
        // * Apply GraphQL middleware to Express
        app.use('/graphql', (0, express4_1.expressMiddleware)(gqlServer));
        // * Basic route
        app.get("/", (req, res) => {
            res.send("Server Running");
        });
        // * Listen on the specified port
        app.listen(port, () => {
            console.log(`Server Running at http://localhost:${port}`);
            console.log(`GraphQL endpoint at http://localhost:${port}/graphql`);
        });
    });
}
init().catch(error => {
    console.error('Error starting server:', error);
});
