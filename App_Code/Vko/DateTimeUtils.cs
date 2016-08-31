using System;


namespace Vko
{
	public static class DateTimeUtils
	{
		/// <summary>
		/// Converts a DateTime to a javascript timestamp.
		/// http://stackoverflow.com/a/5117291/13932
		/// </summary>
		/// <param name="input">The input.</param>
		/// <returns>The javascript timestamp.</returns>
		public static long ToJSLong(this DateTime input)
		{
		    var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
		    var time = input.Subtract(new TimeSpan(epoch.Ticks));
		    return (long)(time.Ticks / 10000);
		}
	}
}