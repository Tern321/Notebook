using Forum.Controllers.ServerDataModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum.Models
{
    public class UpdateBranchDataResponse
    {
        public string branchId { get; set; }
        public string dump { get; set; }
        public string commands { get; set; }
        public string dumpVersion { get; set; }
        public string commandsVersion { get; set; }
        public string error { get; set; }
    }
    public class EncryptedData
    {
        public string login { get; set; }
        public string salt { get; set; }
        public string iv { get; set; }
        public string encStr { get; set; }
    }
    public class UpdateBranchData
    {
        public string login { get; set; }
        public string userPassword { get; set; }
        public string branchId { get; set; }
        public string branchPassword { get; set; }
        public string dumpVersion { get; set; }
        public string commandsVersion { get; set; }

        public EncryptedData[] encryptedCommands { get; set; }
    }
    public class BranchData
    {
        public int version { get; set; }
        public string dump { get; set; }
        public string changes { get; set; }
    }
    //public class BranchInfo
    //{
    //    public int version { get; set; }

    //    public string branchId { get; set; }
    //    public string password { get; set; }
    //    public string encryptionKey { get; set; }
    //}

    public class LoginRequestJson
    {
        public string mail { get; set; }
        public string password { get; set; }
    }

    public class LoginResponseJson // add version
    {
        public void initDataForUser(string userId, string password)
        {

        }

        public string mail { get; set; }
        public string userId { get; set; }
        public string password { get; set; }
        public string version { get; set; }
        public string encryptedAccountData { get; set; }
        public List<BranchInfo> branchInfo { get; set; }
        public string error { get; set; }

    }

    public class SerializedData
    {
        public int version { get; set; }
        public EncryptedData encryptedData { get; set; }
    }


    public class BranchInfo
    {
        public string branchId { get; set; }
        public string name { get; set; }

        public string branchType { get; set; }
        public string dumpVersion { get; set; }
        public string commandsVersion { get; set; }

        public string[] adminUsers { get; set; }
        public string[] writeUsers { get; set; }
        public string readPassword { get; set; }

        // active invite links

    }
    public class CreateBranchJson
    {
        public string userId { get; set; }
        public string password { get; set; }
        public string branchName { get; set; }

        public string branchType { get; set; }
        // public  // personal // private
        // personal read/write only user
        // private read - readUsers,   read/write adminUsers or writeUsers
        // public read anyone (and no account), write adminUsers and writeUsers


        //string[] adminUsers { get; set; } // who can create link for new users
        //string[] readUsers { get; set; }
        //string[] writeUsers { get; set; } 
        public void validateParametrs()
        {
            if (!TreeNoteUser.userValid(this.userId, this.password)) throw new ArgumentException("id or password");
            if (!TreeNoteUser.parametrValid(this.branchName)) throw new ArgumentException("branch name error");
            if (!(branchType == "public" || branchType == "private" || branchType == "personal"))
            {
                throw new ArgumentException("branch type error");
            }
        }
    }
    class CreateBranchResponseJson
    {
        public string branchId { get; set; }
        public string branchName { get; set; }
        public string branchType { get; set; }
        public string error { get; set; }
    }




}
