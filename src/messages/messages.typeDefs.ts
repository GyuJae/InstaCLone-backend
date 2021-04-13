import { gql } from "apollo-server";

export default gql`
  type Message {
    id: Int!
    read: Boolean!
    payload: String!
    user: User!
    room: Room!
    createdAt: String!
    updatedAt: String!
  }
  type Room {
    id: Int!
    unreadTotal: Int!
    user: [User]
    messages: [Message]
    createdAt: String!
    updatedAt: String!
  }
`;
