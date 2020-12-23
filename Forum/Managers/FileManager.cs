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
        static int currentVersion = 0;
        static string dataFolderPath = @"D:\Forum\";
        static int changesPerFileVersion = 20;
        static string currentFileName()
        {
            return dataFolderPath + currentFileVersion();
        }
        static string nextFileName()
        {
            return dataFolderPath + (currentFileVersion()+1);
        }

        static int currentFileVersion()
        {
            // обратная совместимость со старым файлом
            if (System.IO.File.Exists(dataFolderPath + @"data.json"))
            {
                System.IO.File.Move(dataFolderPath + @"data.json", dataFolderPath + "0");
            }

            DirectoryInfo d = new DirectoryInfo(dataFolderPath);
            FileInfo[] Files = d.GetFiles();

            int maxValue = 0;
            foreach (FileInfo file in Files)
            {
                int value = 0;
                int.TryParse(file.Name, out value);
                maxValue = Math.Max(maxValue, value);
            }
            return maxValue;
        }

        public static string readJson()
        {
            string filePath = dataFolderPath + "0";
            string text = "";
            using (StreamReader streamreader = new StreamReader(filePath))
            {
                text = streamreader.ReadToEnd();
            }
            return text;
        }

        public static bool saveJson(string json, int version)
        {
            System.IO.Directory.CreateDirectory(dataFolderPath);
            string filePath = dataFolderPath + "0";
            using (StreamWriter sw = new StreamWriter(filePath))
            {
                sw.Write(json);
            }
            return true;
        }

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
