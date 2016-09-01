using System;
using System.Collections.Specialized;
using System.Collections.Generic;


namespace Rebelmouse.jira.Repository
{
    class IssuesRepository : IRepository<Issue>
    {
        private readonly JiraClient jiraClient = new JiraClient(
            Vko.Config.JiraConfig["url"],
            Vko.Config.JiraConfig["user"],
            Vko.Config.JiraConfig["password"]
            );

        public IssuesRepository()
        {
        }

        public IEnumerable<Issue> Find()
        {
            return jiraClient.Issues;
	    }
        
        public IEnumerable<Issue> Find(Statement filter)
        {
            string[] fieldDef = null;
            string jql = filter.ToString();
            return jiraClient.EnumerateIssuesByQuery(jql, fieldDef, 0);
	    }

	    public IEnumerable<Issue> Find<T>(T args)
        {
            var propStatus = typeof(T).GetProperty("status");
            string[] status = propStatus == null ? null : propStatus.GetValue(args, null) as string[];
            var propEpicLink = typeof(T).GetProperty("epicLink");
            string[] epicLink = propEpicLink == null ? null : propEpicLink.GetValue(args, null) as string[];
            var items = default(IEnumerable<Issue>);
            
            if (status == null && epicLink == null) {
                items = jiraClient.Issues;
            } else if (status == null) {
                items = jiraClient.GetIssuesByEpic(epicLink);
            } else if (epicLink == null) {
                items = jiraClient.GetIssuesByStatus(status);
            } else {
                items = jiraClient.GetIssues(status, epicLink);
            }
            
            return items;
	    }
	}
}