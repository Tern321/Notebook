using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;
using Forum.Managers;
using Forum.Models;
using System.IO;
using System.Text.Json;
using System.Text;
using Forum.Managers;
using Forum.managers;

namespace Forum.Controllers.ServerDataModel
{
    public partial class Branch
    {

        //public string[] adminUsers { get; set; }
        //public string[] writeUsers { get; set; }
        //public string readPassword { get; set; }



        static bool branchTypeValid(string branchType)
        {
            var branchTypesList = new string[] { "public", "private", "personal" };
            return branchTypesList.Contains(branchType);
        }
        static string branchesDataKey(string branchId) { return "branchesData"; }

        static IDatabase cache = RedisConnectorHelper.Connection.GetDatabase();
        public static string createBranch(CreateBranchJson createBranchJson)
        {
            if (!TreeNoteUser.userValid(createBranchJson.userId, createBranchJson.password)) throw new ArgumentException("mail or password");
            if (Branch.getBranchesList(createBranchJson.userId, createBranchJson.password).Length > 10) throw new ArgumentException("too many branches");
            //if (createBranchJson.readPasswords.Length > 10) throw new ArgumentException("too many readPasswords");
            //if (createBranchJson.writePasswords.Length > 10) throw new ArgumentException("too many writePasswords");

            if (!branchTypeValid(createBranchJson.branchType)) throw new ArgumentException("branch type");

            string branchId = cache.StringIncrement("branchIdCounter").ToString();

            Branch.setUserId(branchId, createBranchJson.userId);
            Branch.setBranchName(branchId, createBranchJson.branchName);
            Branch.setBranchType(branchId, createBranchJson.branchType);

            cache.ListLeftPush(Branch.userBranchesListKey(createBranchJson.userId), branchId);

            //foreach (string pass in createBranchJson.writePasswords)
            //{
            //    cache.SetAdd(branchWritePasswordsKey(branchId), pass);
            //}
            //foreach (string pass in createBranchJson.readPasswords)
            //{
            //    cache.SetAdd(branchReadPasswordsKey(branchId), pass);
            //}
            // create folder?
            
            return branchId;
        }
        public static string[] getBranchesList(string userId, string password)
        {
            if (!TreeNoteUser.userValid(userId, password)) throw new ArgumentException("mail or password");

            return RedisExtensionMethods.ToStringArray( cache.ListRange(userBranchesListKey(userId),0, -1));
        }

        public static void updateBranch(string userId, string branchId, EncryptedData[] commands, string version)
        {
            
            string commandsPath = FileManager.commandsFilePath(branchId);
            string historyPath = FileManager.historyFilePath(branchId);
            string text = "";

            foreach (var command in commands)
            {
                command.login = userId;
                text += JsonSerializer.Serialize(command) + "\n";
            }

            using (StreamWriter streamWriter = new StreamWriter(new FileStream(commandsPath, FileMode.Append, FileAccess.Write), Encoding.ASCII))
            {
                streamWriter.Write(text);
            }
            using (StreamWriter streamWriter = new StreamWriter(new FileStream(historyPath, FileMode.Append, FileAccess.Write), Encoding.ASCII))
            {
                streamWriter.Write(text);
            }
        }


        public static bool userCanReadBranch(string userId, string userPassword, string branchId, string branchPassword)
        {
            return true;
        }
        public static bool userCanWriteBranch(string userId, string userPassword, string branchId)
        {
            // user valid
            // branch password valid
            
            return true;
        }
        public string branchData(string branchId, string branchReadPassword)
        {
            //if (!TreeNoteUser.userValid(userId, userPassword))
            //{
            //    return "Login error";
            //}
            // save salted password
            if (cache.SetContains(branchId + "_writePasswords", branchReadPassword) || cache.SetContains(branchId + "_readPasswords", branchReadPassword))
            {
                return cache.HashGet("branchesData", branchId);
            }
            return "password error";
        }
        public string updateBranchData(string branchId, string branchWritePassword, string data)
        {
            if (cache.SetContains(branchId + "_writePasswords", branchWritePassword))
            {
                //cache.HashSet("branchData", login, saltedPassword(login, password));
                cache.HashSet("branchesData", branchId, data);
            }
            return "";
        }
    }
}
