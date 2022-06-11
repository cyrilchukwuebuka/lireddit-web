import { dedupExchange, Exchange, fetchExchange, Mutation, Query } from "urql";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
  LogoutMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LoginMutation,
  ChangePasswordMutation,
  VoteMutationVariables,
  DeletePostMutationVariables,
} from "../generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import Router from "next/router";
import { pipe, tap } from "wonka";
import { isServer } from "./isServer";
import { stringifyVariables, gql } from "@urql/core";

export type MergeMode = "before" | "after";

export const errorExchange: Exchange =
  ({ forward }) =>
  (ops$) => {
    return pipe(
      forward(ops$),
      tap(({ error }) => {
        // if the Operation result has an error, send a request to sentry
        if (error) {
          !isServer && Router.replace("/login");
        }
      })
    );
  };

export interface PaginationParams {
  offsetArgument?: string;
  limitArgument?: string;
  mergeMode?: MergeMode;
}

export const cursorPagination = (
  cursorArgument = "cursor"
): Resolver<any, any, any> => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;
    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    let hasMore = true;
    const fieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const isItInTheCache = cache.resolve(
      cache.resolveFieldByKey(entityKey, fieldKey) as string,
      "posts"
    );
    info.partial = !isItInTheCache;
    const results: string[] = [];
    fieldInfos.forEach((fi) => {
      const keys = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(keys, "posts") as string[];
      const _hasMore = cache.resolve(keys, "hasMore");
      if (!_hasMore) hasMore = _hasMore as boolean;
      results.push(...data);
    });

    return {
      __typename: "PaginatedPosts",
      hasMore,
      posts: results,
    };
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = '';
  if (isServer){
    cookie = ctx?.req?.headers.cookie;
  }
  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, info) => {
              // const allFields = cache.inspectFields("Query");
              // const fieldInfos = allFields.filter(
              //   (info) => info.fieldName === "posts"
              // );
              // fieldInfos.forEach((fi) => {
              //   cache.invalidate("Query", "post", fi.arguments || {});
              // });
              cache.invalidate({__typename: "Post", _id: (args as DeletePostMutationVariables).postId})
            },
            vote: (_result, args, cache, info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment readPost on Post {
                    _id
                    points
                    voteStatus
                  }
                `,
                { _id: postId }
              );
              if (data) {
                if (data.voteStatus === value) return;
                const newPoints =
                  (data.points as number) + (!data.voteStatus ? 1 : 2) * value;
                cache.writeFragment(
                  gql`
                    fragment writePost on Post {
                      points
                      voteStatus
                    }
                  `,
                  { _id: postId, points: newPoints, voteStatus: value }
                );
              }
            },
            createPost: (_result, args, cache, info) => {
              const allFields = cache.inspectFields("Query");
              const fieldInfos = allFields.filter(
                (info) => info.fieldName === "posts"
              );
              fieldInfos.forEach((fi) => {
                cache.invalidate("Query", "posts", fi.arguments || {});
              });
            },
            changePassword: (_result, args, cache, info) => {
              betterUpdateQuery<ChangePasswordMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.changePassword.errors) {
                    return query;
                  } else {
                    return {
                      me: result.changePassword.user,
                    };
                  }
                }
              );
            },

            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                () => ({ me: null })
              );
            },

            register: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.register.errors) {
                    return query;
                  } else {
                    return {
                      me: result.register.user,
                    };
                  }
                }
              );
            },

            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
