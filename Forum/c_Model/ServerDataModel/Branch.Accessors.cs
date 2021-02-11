using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Forum.Controllers.ServerDataModel
{
    public partial class Branch
    {
        public static string branchMetadataKey(string branchId) { return "branchMetadata_" + branchId; }
        public static string branchReadPasswordsKey(string branchId) { return "branchReadPasswords" + branchId; }
        public static string userBranchesListKey(string userId) { return "userMetadata_" + userId + "_branches"; }


        //cache.HashSet(Branch.branchMetadataKey(branchId), "userId", createBranchJson.userId);
        //cache.HashSet(Branch.branchMetadataKey(branchId), "branchName", createBranchJson.branchName);
        //cache.HashSet(Branch.branchMetadataKey(branchId), "branchType", createBranchJson.branchType);
        public static void setUserId(string branchId, string userId) { cache.HashSet(Branch.branchMetadataKey(branchId), "userId", userId); }
        public static void setBranchName(string branchId, string branchName) { cache.HashSet(Branch.branchMetadataKey(branchId), "branchName", branchName); }
        public static void setBranchType(string branchId, string branchType) { cache.HashSet(Branch.branchMetadataKey(branchId), "branchType", branchType); }


        public static string getUserId(string branchId) { return cache.HashGet(Branch.branchMetadataKey(branchId), "userId"); }
        public static string getBranchName(string branchId) { return cache.HashGet(Branch.branchMetadataKey(branchId), "branchName"); }
        public static string getBranchType(string branchId) { return cache.HashGet(Branch.branchMetadataKey(branchId), "branchType"); }

    }
}
