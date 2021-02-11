using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using StackExchange.Redis;
using System.Text.Json;
using System.Text.Json.Serialization;
using Forum.Managers;
using Forum.Models;


namespace Forum.Controllers.ServerDataModel
{
    public class TreeNoteUser
    {
        static IDatabase cache = RedisConnectorHelper.Connection.GetDatabase();
        static string saltedPassword(string login, string password)
        {
            // not implemented
            return password;
        }

        static string mailUserIdHashKey()
        {
            return "mailUserIdHash";
        }
        static string userHashKey(string userId)
        {
            return "user_" + long.Parse(userId);
        }

        public static bool parametrValid(string value)
        {
            return value.Length < 1000 && value.Length > 0;
        }
        public static bool passwordValid(string value)
        {
            return value.Length < 1000;
        }

        //public static bool updatmail(string userId, string password, string mail) // дырявое, перепроверить
        //{
        //    if (!userValid(userId, password)) return false;
        //    if (!parametrValid(mail)) return false;

        //    if (cache.HashExists(mailUserIdHashKey(), mail)) throw new ArgumentException("mail");

        //    var oldMail = cache.HashGet(userHashKey(userId), "mail");

        //    cache.HashSet(mailUserIdHashKey(), mail, userId);
        //    cache.HashDelete(mailUserIdHashKey(), oldMail);

        //    cache.HashSet(userHashKey(userId), "mail", mail);
        //    return true;
        //}

        public static bool updatePassword(string userId, string password, string updatedPassword)
        {
            if (!userValid(userId, password)) throw new ArgumentException("mail or password");
            if (!parametrValid(updatedPassword)) throw new ArgumentException("new password");

            cache.HashSet(userHashKey(userId), "password", saltedPassword(userId, updatedPassword));
            return true;
        }
        
        public static string createUser(string password, string mail)
        {
            // validation
            if (!parametrValid(password)) throw new ArgumentException("password");
            if (!parametrValid(mail)) throw new ArgumentException("mail");

            // new id, check exist // realy don't need 
            
            string userId = cache.StringIncrement("userIdCounter").ToString();
            if (cache.SetLength(userHashKey(userId)) > 0 ) throw new ArgumentException("userId");
            if (cache.HashExists(mailUserIdHashKey(), mail)) throw new ArgumentException("mail");

            // update
            cache.HashSet(userHashKey(userId), "password", saltedPassword(userId, password));
            cache.HashSet(userHashKey(userId), "mail", mail);
            cache.HashSet(mailUserIdHashKey(), mail,userId);
            
            return userId;
        }
        public static string getUserMail(string userId, string password)
        {
            if (!userValid(userId, password)) throw new ArgumentException("mail or password");
            return cache.HashGet(userHashKey(userId), "mail");
        }
        public static string getUserId(string mail, string password)
        {
            if (!parametrValid(mail)) throw new ArgumentException("mail");
            if (!parametrValid(password)) throw new ArgumentException("password");

            var userId = cache.HashGet(mailUserIdHashKey(), mail);
            if (!userValid(userId,password)) throw new ArgumentException("mail or password");
            return userId;
        }
        
        public static string getAccountDataVersion(string userId, string password)
        {
            if (!userValid(userId, password)) throw new ArgumentException("mail or password");
            return cache.HashGet(userHashKey(userId), "accountDataVersionKey");
        }

        public static string getAccountData(string userId, string password)
        {
            if (!userValid(userId, password)) throw new ArgumentException("mail or password");
            return cache.HashGet(userHashKey(userId), "accountDataKey");
        }
        
        public static void setAccountData(string userId, string password, string accountData)
        {
            if (!userValid(userId, password)) throw new ArgumentException("mail or password");
            if (accountData.Length > 100*1024) throw new ArgumentException("accountData length"); // 100kb

            cache.HashIncrement(userHashKey(userId), "accountDataVersionKey");
            cache.HashSet(userHashKey(userId), "accountDataKey", accountData);
        }

        public static bool userValid(string userId, string password)
        {
            if (!parametrValid(userId)) return false;
            if (!parametrValid(password)) return false;

            long a = 0;
            if (!long.TryParse(userId, out a)) throw new ArgumentException("userId error ");

            return saltedPassword(userId, password) == cache.HashGet(userHashKey(userId), "password");
        }
        public static void updateBranchesData(string login, EncryptedData encryptedData, string version)
        {
            cache.HashSet("BranchesData", login, JsonSerializer.Serialize(encryptedData));
            cache.HashSet("BranchesVersion", login, version);
        }
        //public static string branchesData(string login)
        //{
        //    return cache.HashGet("BranchesData", login);
        //}

        //string mail;
        //string masterPassword;
        //string userId;
        //int lastActionTime;
        //int dataSize;

        //User(string userId, string mail)
        //{
        //    this.userId = userId;
        //    this.mail = mail;
        //}


        //var nextId = cache.StringIncrement("idCounter");
    }
}
