using System;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

using hellomvc;
using Vko.Entities;

using System.Security.Cryptography.X509Certificates;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Sheets.v4;
using Google.Apis.Sheets.v4.Data;
using Google.Apis.Services;
using Google.Apis.Util.Store;


namespace Vko.Repository {
    
    class ScheduleRepository : IRepository<Schedule> {

        static string[] Scopes = {
             SheetsService.Scope.SpreadsheetsReadonly
         };
        static string ApplicationName = "Google Sheets API .NET Quickstart";

        private readonly object googleClient = new {
            url = Convert.ToString(Config.JiraConfig["url"]),
            user = Convert.ToString(Config.JiraConfig["user"]),
            pass = Convert.ToString(Config.JiraConfig["password"])
        };
        
        public ScheduleRepository() {
        }

        public IEnumerable<Schedule> Find() {
            string path = AppDomain.CurrentDomain.GetData("DataDirectory").ToString();
                
            var service = new SheetsService(new BaseClientService.Initializer()
            {
                ApplicationName = "Server key 1",
                ApiKey="AIzaSyD3RZpywWfxTenPpRzZrHHjXsOiquvWCH4",
            });
     
            string spreadsheetId = "1qeeGdfM89g1ATzbFbdEznORGTXQKgNBlXjgL9bxVZFY";
            string range = "Feeding!A2:E";
            SpreadsheetsResource.ValuesResource.GetRequest request =
                    service.Spreadsheets.Values.Get(spreadsheetId, range);

            ValueRange response = request.Execute();
            IList<IList<Object>> values = response.Values;
            if (values != null && values.Count > 0)
            {
                foreach (var row in values)
                {
                    yield return new Schedule() {
                        id = Convert.ToString(row[0]),
                        user = Convert.ToString(row[1]),
                        Description = Convert.ToString(row[2])
                    };
                }
            }
	    }
        
	    public IEnumerable<Schedule> Find<T>(T args) {
            return new List<Schedule>();
	    }
	}
}