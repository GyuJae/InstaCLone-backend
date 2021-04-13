import * as jwt from "jsonwebtoken";
import client from "../client";
import { Resolver, User, Context } from "../type";

export const getUser = async (token: string): Promise<User> => {
  try {
    if (!token) {
      return null;
    }
    const verifiedToken: any = await jwt.verify(token, process.env.SECRET_KEY);
    if ("id" in verifiedToken) {
      const id = verifiedToken["id"];
      const user = await client.user.findUnique({ where: { id } });
      if (user) {
        return user;
      }
    }
    return null;
  } catch {
    return null;
  }
};

export const protectedResolver = (ourResolver: Resolver) => (
  root: any,
  args: any,
  context: Context,
  info: any
) => {
  if (!context.loggedUser) {
    const query = info.operation.operation === "query";
    if (query) {
      return null;
    }
    return {
      ok: false,
      error: "Please log in to perform this action.",
    };
  }
  return ourResolver(root, args, context, info);
};
