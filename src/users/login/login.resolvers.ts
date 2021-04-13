import { Resolvers } from "../../type";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

type LoginResult = {
  ok: boolean;
  token?: string;
  error?: string;
};

type LoginArgs = {
  username: string;
  password: string;
};

const resolvers: Resolvers = {
  Mutation: {
    login: async (
      _,
      { username, password }: LoginArgs,
      { client }
    ): Promise<LoginResult> => {
      try {
        const user = await client.user.findFirst({ where: { username } });
        if (!user) {
          return {
            ok: false,
            error: "User not found",
          };
        }
        const passwordOk = await bcrypt.compare(password, user.password);
        if (!passwordOk) {
          return {
            ok: false,
            error: "Incorrect password",
          };
        }
        const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY);
        return {
          ok: true,
          token,
        };
      } catch (error) {
        return {
          ok: false,
          error,
        };
      }
    },
  },
};

export default resolvers;
