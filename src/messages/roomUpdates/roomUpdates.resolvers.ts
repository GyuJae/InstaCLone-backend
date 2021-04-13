import { NEW_MESSAGE } from "../../constants";
import pubsub from "../../pubsub";
import { Resolvers } from "../../type";

const resolvers = {
  Subscription: {
    roomUpdates: {
      subscribe: () => pubsub.asyncIterator(NEW_MESSAGE),
    },
  },
};

export default resolvers;