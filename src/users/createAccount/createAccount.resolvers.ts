import { Resolvers, User } from "../../type";
import * as bcrypt from "bcrypt";

type CreateAccountArgs = {
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  password: string;
};

type CreateAccountResult = {
  ok: boolean;
  error?: string;
  user?: User;
};

const resolvers: Resolvers = {
  Mutation: {
    createAccount: async (
      _,
      createAccountArgs: CreateAccountArgs,
      { client }
    ): Promise<CreateAccountResult> => {
      const { username, email, password } = createAccountArgs;
      try {
        const existingUser = await client.user.findFirst({
          where: {
            OR: [{ username }, { email }],
          },
        });

        if (existingUser) {
          return {
            ok: false,
            error: "This username/email is already taken",
            user: null,
          };
        }
        const uglyPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
          data: { ...createAccountArgs, password: uglyPassword },
        });
        return {
          ok: true,
          error: null,
          user,
        };
      } catch (error) {
        return {
          ok: false,
          error,
          user: null,
        };
      }
    },
  },
};

export default resolvers;
