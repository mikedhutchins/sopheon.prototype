using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Sopheon.system.Helpers
{
    public static class GameHelper
    {
        public static string GetEmail(this string username)
        {
            var split = username.Split(new char[] { ':' });

            if (split.Length < 2)
            {
                throw new Exception("Invalid Username in Game Scoring");
            }

            return split[0];
        }

        public static string GetGameName(this string username)
        {
            var split = username.Split(new char[] { ':' });

            if (split.Length < 2)
            {
                throw new Exception("Invalid Username in Game Scoring");
            }

            return split[1];
        }

    }
}
