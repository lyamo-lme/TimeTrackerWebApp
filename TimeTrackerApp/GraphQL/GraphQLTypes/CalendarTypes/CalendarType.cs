﻿using GraphQL.Types;
using TimeTrackerApp.Business.Models;

namespace TimeTrackerApp.GraphQL.GraphQLTypes.CalendarTypes
{
    public class CalendarType : ObjectGraphType<Calendar>
    {
        public CalendarType()
        {
            Field(x => x.Id, nullable: false);
            Field(x => x.Title, nullable: false);
            Field(x => x.Date, nullable: false);
            Field(x => x.TypeDayId, nullable: false);
        }
    }
}
