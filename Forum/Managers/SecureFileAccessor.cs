using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Runtime.InteropServices;
using System.ComponentModel;

namespace Forum.managers
{
    class SecureFileAccessor
    {
        private static Dictionary<string, SecureFileAccessor> fileAccessorDictionary = new Dictionary<string, SecureFileAccessor>();
        public static SecureFileAccessor fileAccessorForPath(string filePath)
        {
            lock (@"SecureFileAccessor")
            {
                if (SecureFileAccessor.fileAccessorDictionary.ContainsKey(filePath))
                {
                    return SecureFileAccessor.fileAccessorDictionary[filePath];
                }
                else
                {
                    var fileAccessor = new SecureFileAccessor(filePath);
                    fileAccessorDictionary[filePath] = fileAccessor;
                    return fileAccessor;
                }
            }
        }

        string rootFilePath;

        string pathA = "";
        string pathB = "";
        string pathC = "";

        bool aExist = false;
        bool bExist = false;
        bool cExist = false;

        private SecureFileAccessor(string filePath)
        {
            rootFilePath = filePath;
            pathA = rootFilePath + "_a";
            pathB = rootFilePath + "_b";
            pathC = rootFilePath + "_c";
        }

        public string getData()
        {
            lock (rootFilePath)
            {
                updateExistingFilesList();

                if (!aExist && !bExist && !cExist)
                {
                    return "";
                }

                using (StreamReader sr = new StreamReader(currentReadPath()))
                {
                    return sr.ReadToEnd();
                }
            }
        }

        // start of class:
        [DllImport("kernel32", SetLastError = true)]
        private static extern bool FlushFileBuffers(IntPtr handle);

        [System.Runtime.InteropServices.DllImport("Kernel32")]
        private extern static Boolean CloseHandle(IntPtr handle);

        public void setData(string text)
        {
            lock (rootFilePath)
            {
                updateExistingFilesList();

                string writePath = currentWritePath();

                using (FileStream fs = File.Create(writePath))
                {
                    byte[] info = new UTF8Encoding(true).GetBytes(text);
                    fs.Write(info, 0, info.Length);
                    fs.Flush();
                    if (!FlushFileBuffers(fs.Handle))
                    {
                        Int32 err = Marshal.GetLastWin32Error();
                        throw new Win32Exception(err, "Win32 FlushFileBuffers returned error for " + fs.Name);
                    }
                }
                deleteFilesExceptCurrent(writePath);
            }
        }

        private string currentWritePath()
        {
            if (!aExist && !bExist && !cExist)
            {
                return pathA;
            }

            string readPath = currentReadPath();
            if (readPath == pathA) return pathB;
            if (readPath == pathB) return pathC;
            if (readPath == pathC) return pathA;

            throw new Exception("Could not select actual write file");
        }
        private string currentReadPath()
        {
            // only one file exist
            if (aExist && !bExist && !cExist) { return pathA; }
            if (!aExist && bExist && !cExist) { return pathB; }
            if (!aExist && !bExist && cExist) { return pathC; }
            // two files exist, select younger file
            if (aExist && bExist && !cExist) { return pathA; }
            if (!aExist && bExist && cExist) { return pathB; }
            if (aExist && !bExist && cExist) { return pathC; }

            //if (aExist && bExist && cExist)
            {
                throw new Exception("Could not select actual read file");
                // actual file not found, should read content to find out wich is ok
            }
        }

        private void deleteFilesExceptCurrent(string file)
        {
            if (pathA != file) File.Delete(pathA);
            if (pathB != file) File.Delete(pathB);
            if (pathC != file) File.Delete(pathC);
        }

        private void updateExistingFilesList()
        {
            aExist = File.Exists(pathA);
            bExist = File.Exists(pathB);
            cExist = File.Exists(pathC);
        }

    }
}
