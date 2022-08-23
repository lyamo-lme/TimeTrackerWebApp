﻿using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using TimeTrackerApp.BackgroundTasks;
using TimeTrackerApp.Business.Repositories;
using TimeTrackerApp.Helpers;

namespace TimeTrackerApp.Services
{
	public class BackgroundTaskService : IHostedService
	{
		private readonly IServiceProvider serviceProvider;

		public BackgroundTaskService(IServiceProvider serviceProvider)
		{
			this.serviceProvider = serviceProvider;
		}

		public async Task StartAsync(CancellationToken cancellationToken)
		{
			using var serviceScope = serviceProvider.CreateScope();
			var backgroundTasks = serviceScope.ServiceProvider.GetRequiredService<IEnumerable<IBackgroundTask>>();
			var userRepository = serviceScope.ServiceProvider.GetRequiredService<IUserRepository>();
			var recordRepository = serviceScope.ServiceProvider.GetRequiredService<IRecordRepository>();
			var backgroundTasksRepository = serviceScope.ServiceProvider.GetRequiredService<IBackgroundTaskRepository>();

			foreach (var type in Constants.BackgroundTaskTypes)
			{
				var latestBackgroundTask = await backgroundTasksRepository.GetLatestByTypeAsync(type);
				var timeHasPassedSinceLastExecution = latestBackgroundTask != null ? (DateTime.UtcNow - latestBackgroundTask.DateTime).TotalSeconds : -1;
				switch (type)
				{
					case nameof(AutoCreateRecordsTask):
						if (timeHasPassedSinceLastExecution > 60 * 60 * 24 || timeHasPassedSinceLastExecution == -1)
						{
							var numberOfTasksToExecute = timeHasPassedSinceLastExecution == -1 ? 1 : timeHasPassedSinceLastExecution / 60 / 60 / 24;
							foreach (var task in backgroundTasks)
							{
								if (task.TaskType == type)
								{
									await task.Execute(null);
								}
							}
						}
						break;
				}
			}
		}

		public Task StopAsync(CancellationToken cancellationToken)
		{
			throw new System.NotImplementedException();
		}
	}
}
