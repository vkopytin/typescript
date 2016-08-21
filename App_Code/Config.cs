using System;
using System.Collections;
using System.Collections.Specialized;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.Configuration;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Optimization;

namespace hellomvc
{
	public class Config
	{
		public static string DefaultDB
		{
			get
			{
				return ConfigurationManager.ConnectionStrings["DefaultDB"].ToString();
			}
		}
		
		static public Dictionary<string, string> JiraConfig
		{
			get
			{
				return ReadJiraConfig();
			}
		}
		
		static public Dictionary<string, string> GoogleConfig
		{
			get
			{
				var applicationName = "" + WebConfigurationManager.AppSettings["applicationName"];
				var apiKey = "" + WebConfigurationManager.AppSettings["apiKey"];
				var spreadsheetId = "" + WebConfigurationManager.AppSettings["spreadsheetId"];
				return new Dictionary<string, string>()
				{
					{ "applicationName", applicationName },
					{ "apiKey", apiKey },
					{ "spreadsheetId", spreadsheetId }
				};
			}
		}
		
		private static Dictionary<string, string> ReadJiraConfig()
		{
			var args = "" + WebConfigurationManager.AppSettings["jiraConnection"];
			
			return HttpUtility.ParseQueryString(args).ToDictionary();
		}
	}
	
	public static class Exts
	{
		public static Dictionary<string, string> ToDictionary(this NameValueCollection collection)
		{
    		return collection.Cast<string>().ToDictionary(k => k, v => collection[v]);
		}
	}
}