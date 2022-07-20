﻿using Microsoft.Extensions.Configuration;
using System.Data.SqlClient;
using TimeTrackerApp.Business.Models;
using TimeTrackerApp.Business.Repositories;
using Dapper;

namespace TimeTrackerApp.MsSql.Repositories
{
	public class UserRepository : IUserRepository
	{
		private readonly string connectionString;

		public UserRepository(IConfiguration configuration)
		{
			connectionString = configuration.GetConnectionString("MsSqlConnection");
		}

		public async Task<User> CreateAsync(User user)
		{
			string query = @"INSERT INTO Users (Email, Password, FirstName, LastName, WeeklyWorkingTime, RemainingVacationDays, PrivilegesValue) VALUES (@Email, @Password, @FirstName, @LastName, @WeeklyWorkingTime, @RemainingVacationDays, @PrivilegesValue)";

			using (var connection = new SqlConnection(connectionString))
			{
				int affectedRows = await connection.ExecuteAsync(query, user);
				if (affectedRows > 0)
				{
					return (await FetchAllAsync()).Last();
				}
				throw new Exception("User creation error!"); 
			}
		}

		public async Task<User> EditAsync(User user)
		{
			string query = @"UPDATE Users SET Email = @Email, Password = @Password, FirstName = @FirstName, LastName = @LastName, WeeklyWorkingTime = @WeeklyWorkingTime, RemainingVacationDays = @RemainingVacationDays, PrivilegesValue = @PrivilegesValue WHERE Id = @Id";

			using (var connection = new SqlConnection(connectionString))
			{
				int affectedRows = await connection.ExecuteAsync(query, user);
				if (affectedRows > 0)
				{
					return user;
				}
				throw new Exception("User editing error!");
			}
		}

		public async Task<IEnumerable<User>> FetchAllAsync()
		{
			string query = @"SELECT * FROM Users";

			using (var connection = new SqlConnection(connectionString))
			{
				return await connection.QueryAsync<User>(query);
			}
		}

		public async Task<User> GetByIdAsync(int id)
		{
			string query = @"SELECT * FROM Users WHERE Id = @Id";

			using (var connection = new SqlConnection(connectionString))
			{
				var user = await connection.QuerySingleOrDefaultAsync<User>(query, new { Id = id });
				if (user is not null)
				{
					return user;
				}
				throw new Exception("This user was not found!");
			}
		}

		public async Task<User> RemoveAsync(int id)
		{
			string query = @"DELETE FROM Users WHERE Id = @Id";

			using (var connection = new SqlConnection(connectionString))
			{
				int affectedRows = await connection.ExecuteAsync(query, new { Id = id });
				if (affectedRows > 0)
				{
					return await GetByIdAsync(id);
				}
				throw new Exception("User removal error!");
			}
		}
	}
}
