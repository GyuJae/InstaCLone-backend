import { Resolvers } from "../type";

const resolvers: Resolvers = {
  Comment: {
    user: ({ userId: id }, _, { client }) =>
      client.user.findUnique({
        where: {
          id,
        },
      }),
    photo: ({ photoId: id }, _, { client }) =>
      client.photo.findUnique({ where: { id } }),
    isMine: ({ userId }, _, { loggedUser }) => {
      if (!loggedUser) {
        return false;
      }
      return userId === loggedUser.id;
    },
  },
};

export default resolvers;
