import { gql } from "apollo-server-core";

export default gql`
  type SeeFolloingResult {
    ok: Boolean!
    error: String
    following: [User]
  }
  type Query {
    seeFollowing(username: String!, lastId: Int): SeeFolloingResult!
  }
`;
