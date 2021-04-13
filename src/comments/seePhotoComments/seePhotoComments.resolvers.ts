import { Resolvers } from "../../type";

const resolvers: Resolvers = {
  Query: {
    seePhotoComments: (_, { id: photoId }, { client }) =>
      client.comment.findMany({
        where: {
          photoId,
        },
        orderBy: {
          createdAt: "asc",
        },
      }),
  },
};

export default resolvers;
