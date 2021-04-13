import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";

const loadTypeDef = loadFilesSync(`${__dirname}/**/**/*.typeDefs.ts`);
const loadResolvers = loadFilesSync(`${__dirname}/**/**/*.resolvers.ts`);

export const typeDefs = mergeTypeDefs(loadTypeDef);
export const resolvers = mergeResolvers(loadResolvers);
