import { Resolvers } from "../../type";

const resolvers: Resolvers = {
  Query: {
    seeHashtag: (_, { hashtag }, { client }) =>
      client.hashtag.findUnique({
        where: {
          hashtag,
        },
      }),
  },
};

export default resolvers;