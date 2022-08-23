﻿const CalendarDayFragment = `
    id,
    date,
    dayTypeId,
    title,
    endDate
`

export const fetchAllCalendarDaysQuery = `
    query FetchAllCalendarDays {
        fetchAllCalendarDays {
            ${CalendarDayFragment}
        }
    }
`

export const fetchCalendarDaysRangeQuery = `
    query FetchCalendarDaysRange($startDate: Date!, $finishDate: Date!) {
        fetchCalendarDaysRange(startDate: $startDate, finishDate: $finishDate) {
            ${CalendarDayFragment}
        }
    }
`

export const getCalendarDayByIdQuery = `
    query GetCalendarDayById($id: ID!) {
        getCalendarDayById(eventId: $id) {
            ${CalendarDayFragment}
        }
    }
`

export const createCalendarDayMutation = `
    mutation CreateCalendarDay($calendarDay: CalendarDayInputType!) {
        createCalendarDay(day: $calendarDay) {
            ${CalendarDayFragment}
        }
    }
`

export const editCalendarDayMutation = `
    mutation EditCalendarDay($calendarDay: CalendarDayUpdateType!) {
        editCalendarDay(day: $calendarDay) {
            ${CalendarDayFragment}
        }
    }
`
export const removeCalendarDayMutation = `
    mutation RemoveCalendarDay($id: ID!) {
        removeCalendarDay(id: $id) {
            ${CalendarDayFragment}
        }
    }
`