using System.Collections.Generic;
using Rebelmouse.jira.Repository;
using System.Linq;

namespace Rebelmouse.jira
{
	public class JiraManager : BaseManager
    {
	    private readonly IRepository<Issue> issuesRepo = Repository.General.Request<Issue>();
		
		public IEnumerable<Issue> Issues {
            get {
                return this.GetIssues();
            }
        }

        public IEnumerable<Issue> GetIssues() {
			return issuesRepo.Find();
        }
        
        public IEnumerable<Issue> GetIssues2() {
            //10002%2C10003&epicLink=BRAD-72
            var filter = Expr(
                And(
                    Expr(Name("status"), In("10002", "10003")),
                    In(Name("\"Epic Link\""), "BRAD-72")
                ),
                OrderBy("priority", Desc())
            );
			return issuesRepo.Find(filter);
        }
        
        public IEnumerable<Issue> GetIssuesByStatus(string[] status) {
			return issuesRepo.Find(new {status=status});
        }
        
        public IEnumerable<Issue> GetIssuesByEpic(string[] epicLink) {
			return issuesRepo.Find(new {epicLink=epicLink});
        }
        
        public IEnumerable<Issue> GetIssues(string[] status, string[] epicLink) {
			return issuesRepo.Find(new {
                status=status,
                epicLink=epicLink
            });
        }
	}
}