﻿using GraphQL.Types;
using GraphQL;
using TimeTrackerApp.GraphQL.GraphQLTypes;
using TimeTrackerApp.Business.Repositories;
using TimeTrackerApp.Business.Models;
using System;

namespace TimeTrackerApp.GraphQL.GraphQLQueries
{
    public class AppQuery : ObjectGraphType
    {
        public AppQuery(
            IAuthenticationTokenRepository authTokenRep,
            IRecordRepository recordRep,
            IUserRepository userRep,
            IVacationRequestRepository vacationRequestRep
        )
        {
            Field<ListGraphType<AuthTokenType>>(
               "authToken_FetchAll",
               resolve: context => authTokenRep.FetchAllAsync()
           );
            Field<AuthTokenType>(
                "authToken_GetById",
                arguments: new QueryArguments(new QueryArgument<IdGraphType> { Name = "id" }),
                resolve: context =>
                {
                    int id = Convert.ToInt32(context.Arguments["id"]);
                    return authTokenRep.GetByIdAsync(id);
                }
            );


            Field<ListGraphType<RecordType>>(
               "record_FetchAll",
               resolve: context => recordRep.FetchAllAsync()
           );
            Field<RecordType>(
                "record_GetById",
                arguments: new QueryArguments(new QueryArgument<IdGraphType> { Name = "id" }),
                resolve: context =>
                {
                    int id = Convert.ToInt32(context.Arguments["id"]);
                    return recordRep.GetByIdAsync(id);
                }
            );



            Field<ListGraphType<UserType>>(
               "user_FetchAll",
               resolve: context => userRep.FetchAllAsync()
           );
            Field<UserType>(
                "user_GetById",
                arguments: new QueryArguments(new QueryArgument<IdGraphType> { Name = "id" }),
                resolve: context =>
                {
                    int id = Convert.ToInt32(context.Arguments["id"]);
                    return userRep.GetByIdAsync(id);
                }
            );



            Field<ListGraphType<AuthTokenType>>(
               "user_FetchAll",
               resolve: context => userRep.FetchAllAsync()
           );
            Field<AuthTokenType>(
                "user_GetById",
                arguments: new QueryArguments(new QueryArgument<IdGraphType> { Name = "id" }),
                resolve: context =>
                {
                    int id = Convert.ToInt32(context.Arguments["id"]);
                    return userRep.GetByIdAsync(id);
                }
            );
        }
    }
}