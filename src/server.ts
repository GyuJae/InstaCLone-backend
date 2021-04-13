require("dotenv").config();
import * as http from "http";
import * as express from "express";
import * as logger from "morgan";
import { ApolloServer } from "apollo-server-express";
import { typeDefs, resolvers } from "./schema";
import client from "./client";

import { getUser } from "./users/users.utils";

type ParamsType = {
  token: string;
};

const apollo = new ApolloServer({
  typeDefs,
  resolvers,
  context: async (ctx) => {
    if (ctx.req) {
      return {
        loggedUser: await getUser(ctx.req.headers.token),
        client,
      };
    } else {
      const {
        connection: { context },
      } = ctx;
      return {
        loggedUser: context.loggedUser,
      };
    }
  },
  subscriptions: {
    onConnect: async ({ token }: ParamsType) => {
      if (!token) {
        throw new Error("You can't listen.");
      }
      const loggedUser = await getUser(token);
      return { loggedUser };
    },
  },
});

const PORT = process.env.PORT;

const app = express();
app.use(logger("tiny"));
apollo.applyMiddleware({ app });
app.use("/static", express.static("uploads"));

const httpServer = http.createServer(app);
apollo.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: PORT }, () =>
  console.log(`🔥🔥🔥 Server Running: http://localhost:${PORT}/graphql ✔`)
);
