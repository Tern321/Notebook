using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum.Models
{
    public class EncriptionData
    {
        public string saltJson { get; set; }

        public string ivJsonString { get; set; }
        public string encriptedString { get; set; }
    }

    public class SerializedData
    {
        public int version { get; set; }

        public string json { get; set; }
        public EncriptionData encriptedData { get; set; }
    }

}
