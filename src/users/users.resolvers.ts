import client from "../client";
import { Resolvers } from "../type";

const resolvers: Resolvers = {
  User: {
    totalFollowing: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          followers: {
            some: {
              id,
            },
          },
        },
      }),
    totalFollowers: ({ id }, _, { client }) =>
      client.user.count({
        where: {
          followings: {
            some: {
              id,
            },
          },
        },
      }),
    isMe: ({ id }, _, { loggedUser, client }) => id === loggedUser?.id,
    isFollowing: async ({ id }, _, { loggedUser }) => {
      if (!loggedUser) {
        return false;
      }
      const exists = await client.user.count({
        where: {
          username: loggedUser.username,
          followings: {
            some: {
              id,
            },
          },
        },
      });
      return Boolean(exists);
    },
    photos: ({ id }, _, { client }) =>
      client.user.findUnique({ where: id }).photos(),
  },
};

export default resolvers;
