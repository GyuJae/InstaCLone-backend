import { gql } from "apollo-server";

export default gql`
  type CoreResult {
    ok: Boolean!
    error: String
  }
`;
