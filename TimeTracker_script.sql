create database TimeTrackerDB
use TimeTrackerDB
drop database TimeTrackerDB

create table [Users] 
(
	[Id] int primary key identity(1, 1),
	[Email] nvarchar(100) not null,
	[Password] nvarchar(100) not null,
	[LastName] nvarchar(50),
	[FirstName] nvarchar(50),
	[IsFullTimeEmployee] bit default 1, 
	[WeeklyWorkingTime] int default 144000,
	[RemainingVacationDays] int default 30,
	[PrivilegesValue] int default 0
)

create table [Records]
(
	[Id] int primary key identity(1, 1),
	[WorkingTime] int default 28800,
	[EmployeeId] int foreign key references [Users]([Id]) on delete no action,
	[EditorId] int foreign key references [Users]([Id]) on delete no action,
	[IsAutomaticallyCreated] bit default 1, 
	[CreatedAt] datetime default getdate(),
)

create table [Vacation]
(
	[Id] int primary key identity(1, 1),
	[UserId] int foreign key references [Users]([Id]) on delete no action,
	[StartingTime] date not null,
	[EndingTime] date not null,
	[Comment] text,
    [IsAccepted] bit ,
)

create table [AuthenticationTokens] 
(
	[Id] int primary key identity(1, 1),
	[UserId] int not null foreign key references [Users]([Id]) on delete cascade,
	[Token] text not null
)

create table [Calendar]
(
	[Id] int primary key identity(1, 1),
	[Title] nvarchar(50) not null,
	[Date] date not null,
	[EndDate] date null,
	[DayTypeId] int 
)

