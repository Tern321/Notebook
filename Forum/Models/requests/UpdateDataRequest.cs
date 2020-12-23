using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum.Models
{
    public class UpdateDataRequest
    {
        public string login;
        public string password;
        public string branchKey;
        public string branchPassword;

        public long lastUpdateTime { get; set; }
        public EncriptionData encriptedData { get; set; }

    }
}
