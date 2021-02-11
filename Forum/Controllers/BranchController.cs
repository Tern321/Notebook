using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Forum.Models;


using System.Text.Json;
using System.Text.Json.Serialization;
using Forum.Managers;
using StackExchange;
using Forum.Controllers.ServerDataModel;
using Forum.managers;
using StackExchange.Redis;
using Forum.Controllers.ServerDataModel;

namespace Forum.Controllers
{
    public class BranchController : Controller
    {
        static string branchesData = "";
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult BranchPage()
        {
            return View();
        }

        [HttpPost]
        [Route("Branch/updateBranchData/")]
        public JsonResult updateBranchData([FromBody] UpdateBranchData updateBranchData)
        {
            UpdateBranchDataResponse response = new UpdateBranchDataResponse();
            response.branchId = updateBranchData.branchId;

            if (!Branch.userCanWriteBranch(updateBranchData.login, updateBranchData.userPassword, updateBranchData.branchId))
            {
                response.error = "login error";
                return Json(response);
                //jsonString = JsonSerializer.Serialize(data);
                //return Content("login error");
            }
            Branch.updateBranch(updateBranchData.login, updateBranchData.branchId, updateBranchData.encryptedCommands, updateBranchData.commandsVersion);


            response.dumpVersion = FileManager.dumpVersion(updateBranchData.branchId);
            response.commandsVersion = FileManager.commandsVersion(updateBranchData.branchId);
            if (updateBranchData.dumpVersion != response.dumpVersion)
            {
                response.dump = FileManager.readBranchDump(updateBranchData.branchId);
            }

            if (updateBranchData.commandsVersion != response.commandsVersion)
            {
                response.commands = FileManager.readBranchChanges(updateBranchData.branchId);
            }
            return Json(response);
        }

        [Route("Branch/branchData/{login}/{userPassword}/{branchId}/{branchPassword}/{dumpVersion}/{commandsVersion}")]
        public JsonResult branchData(string login, string userPassword, string branchId, string branchPassword, string dumpVersion, string commandsVersion)
        {
            UpdateBranchDataResponse response = new UpdateBranchDataResponse();
            response.branchId = branchId;

            if (!Branch.userCanReadBranch(login, userPassword, branchId, branchPassword))
            {
                response.error = "login error";
                return Json(response);
            }
            response.dumpVersion = FileManager.dumpVersion(branchId);
            response.commandsVersion = FileManager.commandsVersion(branchId);
            if (dumpVersion != response.dumpVersion)
            {
                response.dump = FileManager.readBranchDump(branchId);
            }

            if (commandsVersion != response.commandsVersion)
            {
                response.commands = FileManager.readBranchChanges(branchId);
            }


            return Json(response);
        }

        [Route("Branch/branches/{login}/{password}")]
        public ActionResult branches(string userId, string userPassword)
        {
            if (!TreeNoteUser.userValid(userId, userPassword))
                return Content("Login error");

            //return Content(TreeNoteUser.branchesData(userId));
            return Content("");
        }

        
        //[HttpPost]
        //public ActionResult changeBranchData([FromBody] UpdateBranchesJson updateBranchesJson)
        //{
        //    return Content("##" + FileManager.readBranchChanges(0, 0));
        //}
        public ActionResult json()
        {
            return Content("");
        }
        
        public ActionResult deleteBranch(string userId, string userPassword, string branchId) 
        {
            return Content("not implemented");
        }

        //[HttpPost]
        //public ActionResult createBranch(string userId, string userPassword, string branchWritePassword)
        //{
        //    return Content("error");
        //}

        //[HttpPost]
        //public ActionResult saveUdatedData([FromBody] SerializedData data)
        //{
        //    string jsonString;
        //    //jsonString = JsonSerializer.Serialize(data);
        //    //if (FileManager.saveJson(jsonString, data.version))
        //    //{
        //    //    return Content("ok");
        //    //}
        //    return Content("error");
        //}


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

    }
}
