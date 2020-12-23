using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Forum.Models;

using System.IO;
using Forum.managers;

using System.Text.Json;
using System.Text.Json.Serialization;

namespace Forum.Controllers
{
    public class HomeController : Controller
    {
        //private readonly ILogger<HomeController> _logger;

        //public HomeController(ILogger<HomeController> logger)
        //{
        //    _logger = logger;
        //}

        public IActionResult Index()
        {
            return View();
        }

        public ActionResult json()
        {
            return Content(FileManager.readJson());
        }
        
        public ActionResult deleteBranch(string login, string password, string branchId )
        {
            return Content("not implemented");
        }

        [HttpPost]
        public ActionResult createBranch([FromBody] SerializedData createBranchData)
        {
            return Content("not implemented");
        }
        [HttpPost]
        public ActionResult saveUdatedData([FromBody] SerializedData data)
        {
            string jsonString;
            jsonString = JsonSerializer.Serialize(data);
            if (FileManager.saveJson(jsonString, data.version))
            {
                return Content("ok");
            }
            return Content("error");
        }


        //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        //public IActionResult Error()
        //{
        //    return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        //}


        //static long lastChangeTimeValue = 0;
        //public ActionResult lastChangeTime()
        //{
            
        //    return Content(HomeController.lastChangeTimeValue.ToString());
        //}

        //[Route("Home/setLastChangeTime/{time:long}")]
        //public ActionResult setLastChangeTime(long time)
        //{
        //    HomeController.lastChangeTimeValue = time;
        //    return Content("ok");
        //}

    }
}
