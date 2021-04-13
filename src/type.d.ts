import { PrismaClient } from ".prisma/client";

export type Context = {
  loggedUser: User;
  client: PrismaClient;
};

export type Resolver = (
  root: any,
  args: any,
  context: Context,
  info: any
) => any;

export type Resolvers = {
  [key: string]: {
    [key: string]: Resolver;
  };
};

export type User = {
  id: number;
  firstName: string;
  lastName?: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
};

export type Photo = {
  id: number;
  user: User;
  file: string;
  caption?: string;
  hashtag?: Hashtag[];
};

export type Hashtag = {
  id: number;
  hashtag: string;
  photos?: Photo[];
};

export type CoreOutputType = {
  ok: boolean;
  error?: string;
};
