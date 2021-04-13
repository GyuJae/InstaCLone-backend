import { Resolvers } from "../type";

const resolvers: Resolvers = {
  Photo: {
    user: ({ userId: id }, _, { client }) =>
      client.user.findUnique({ where: { id } }),
    hashtags: ({ id }, _, { client }) =>
      client.hashtag.findMany({
        where: {
          photos: {
            some: {
              id,
            },
          },
        },
      }),
    likes: ({ id: photoId }, _, { client }) =>
      client.like.count({ where: { photoId } }),
    isMine: ({ userId }, _, { loggedUser }) => {
      if (!loggedUser) {
        return false;
      }
      return userId == loggedUser.id;
    },
    comments: ({ id: photoId }, _, { client }) =>
      client.comment.count({
        where: {
          photoId,
        },
      }),
  },
  Hashtag: {
    photos: ({ id }, _, { client }) =>
      client.hashtag
        .findUnique({
          where: {
            id,
          },
        })
        .photos(),
    totalPhotos: ({ id }, _, { client }) =>
      client.photo.count({
        where: {
          hashtags: {
            some: {
              id,
            },
          },
        },
      }),
  },
};

export default resolvers;
