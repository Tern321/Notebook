using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Forum.Models;

namespace Forum.managers
{
    public class FileManager
    {
        public static string historyFilePath(string branchId)
        {
            return @"D:\Forum\branches\" + Int32.Parse(branchId) + @"\history.txt";
        }
        public static string dumpFilePath(string branchId)
        {
            return @"D:\Forum\branches\" + Int32.Parse(branchId) + @"\dump.json";
        }
        public static string commandsFilePath(string branchId)
        {
            return @"D:\Forum\branches\" + Int32.Parse(branchId) + @"\commands.txt";
        }

        public static string dumpVersion(string branchId)
        {
            if (!File.Exists(dumpFilePath(branchId))) return "-1";
            return ((DateTimeOffset)File.GetLastWriteTimeUtc(dumpFilePath(branchId))).ToUnixTimeSeconds().ToString();
        }
        public static string commandsVersion(string branchId)
        {
            if (!File.Exists(commandsFilePath(branchId))) return "-1";
            return ((DateTimeOffset)File.GetLastWriteTimeUtc(commandsFilePath(branchId))).ToUnixTimeSeconds().ToString();
        }
        public static string readBranchDump(string branchId)
        {
            if (!File.Exists(dumpFilePath(branchId))) return "";
            string text = "";
            using (StreamReader streamreader = new StreamReader(dumpFilePath(branchId)))
            {
                text = streamreader.ReadToEnd();
            }
            return text;
        }

        public static string readBranchChanges(string branchId)
        {
            if (!File.Exists(commandsFilePath(branchId))) return "";
            string text = "";
            using (StreamReader streamreader = new StreamReader(commandsFilePath(branchId)))
            {
                text = streamreader.ReadToEnd();
            }
            return text;
        }

        //public static string readJson()
        //{
        //    string filePath = dataFolderPath + "0";
        //string text = "";
        //using (StreamReader streamreader = new StreamReader(filePath))
        //{
        //    text = streamreader.ReadToEnd();
        //}
        //return text;
        //}

        //public static bool saveJson(string json, int version)
        //{
        //    System.IO.Directory.CreateDirectory(dataFolderPath);
        //    string filePath = dataFolderPath + "0";
        //    using (StreamWriter sw = new StreamWriter(filePath))
        //    {
        //        sw.Write(json);
        //    }
        //    return true;
        //}


        //public static string readJson()
        //{
        //    if ( !File.Exists(currentFileName()))
        //    {
        //        return "";
        //    }

        //    string text = "";
        //    using (StreamReader streamreader = new StreamReader(currentFileName()))
        //    {
        //        text = streamreader.ReadToEnd();
        //    }
        //    return text;
        //}

        //public static bool saveJson(string json, int version)
        //{
        //    System.IO.Directory.CreateDirectory(dataFolderPath);
        //    if ( version <= currentVersion)
        //    {
        //        return false;
        //    }
        //    currentVersion = version;

        //    string filePath;
        //    if ( version % changesPerFileVersion == 0)
        //    {
        //        filePath = nextFileName();
        //    }
        //    else
        //    {
        //        filePath = currentFileName();
        //    }

        //    using (StreamWriter sw = new StreamWriter(filePath))
        //    {
        //        sw.Write(json);
        //    }
        //    return true;
        //}
    }
}
