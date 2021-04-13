import { Resolvers } from "../../type";

const resolvers: Resolvers = {
  Query: {
    seePhoto: (_, { id }, { client }) =>
      client.photo.findUnique({
        where: {
          id,
        },
      }),
  },
};

export default resolvers;
