import { Resolvers } from "../../type";

const resolvers: Resolvers = {
  Query: {
    seePhotoLikes: async (_, { id: photoId }, { client }) => {
      try {
        const likes = await client.like.findMany({
          where: {
            photoId,
          },
          select: {
            user: true,
          },
        });
        return likes.map((like) => like.user);
      } catch (error) {
        throw Error(error);
      }
    },
  },
};

export default resolvers;
