using Forum.Controllers.ServerDataModel;
using Forum.managers;
using Forum.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Forum.Controllers
{
    public class AccountController : Controller
    {
        //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        //public IActionResult Error()
        //{
        //    return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        //}
        //[Route("AccountController/Account")]

        public IActionResult AccountPage()
        {
            return View();
        }

        [Route("Account/CreateAccount/{password}/{mail}")]
        public JsonResult CreateAccount(string password, string mail)
        {
            LoginResponseJson data = new LoginResponseJson();
            try
            {
                string userId = TreeNoteUser.createUser(password, mail);
                data.initDataForUser(userId, password);
            }
            catch (Exception e)
            {
                data.error = e.Message;
            }

            return Json(data);
        }


        [HttpPost]
        [Route("Account/createBranch")]
        public JsonResult createBranch([FromBody] CreateBranchJson createBranchJson)
        {
            CreateBranchResponseJson data = new CreateBranchResponseJson();
            try
            {
                createBranchJson.validateParametrs();
                data.branchName = createBranchJson.branchName;
                data.branchId = Branch.createBranch(createBranchJson);
                data.branchType = createBranchJson.branchType;
            } 
            catch(Exception e)
            {
                data.error = e.Message;
            }
            return Json(data);
        }

        //public JsonResult deleteBranch([FromBody] CreateBranchJson createBranchJson)
        //{

        //}

        [HttpPost]
        [Route("Account/login")]
        public JsonResult Login([FromBody] LoginRequestJson requesetData)
        {
            LoginResponseJson data = new LoginResponseJson();
            try
            {
                data.userId = TreeNoteUser.getUserId(requesetData.mail, requesetData.password);
                data.password = requesetData.password;
                data.mail = TreeNoteUser.getUserMail(data.userId, requesetData.password);
                data.encryptedAccountData = TreeNoteUser.getAccountData(data.userId, requesetData.password);
                data.version = TreeNoteUser.getAccountDataVersion(data.userId, requesetData.password);
                data.branchInfo = new List<BranchInfo>();
                foreach (string branchId in Branch.getBranchesList(data.userId, requesetData.password))
                {
                    BranchInfo br = new BranchInfo();
                    br.branchId = branchId;
                    br.name = Branch.getBranchName(branchId);
                    br.branchType = Branch.getBranchType(branchId);
                    br.dumpVersion = FileManager.dumpVersion(branchId);
                    br.commandsVersion = FileManager.commandsVersion(branchId);
                    data.branchInfo.Add(br);
                }

                data.initDataForUser(TreeNoteUser.getUserId(requesetData.mail, requesetData.password), requesetData.password);
            }
            catch (Exception e)
            {
                data.error = e.Message;
            }
            return Json(data);
        }

        [HttpPost]
        [Route("Account/updateAccountData/")]
        public JsonResult updateAccountData([FromBody] LoginResponseJson updateAccountDataJson)
        {
            if (TreeNoteUser.userValid(updateAccountDataJson.userId, updateAccountDataJson.password))
            {
                TreeNoteUser.setAccountData(updateAccountDataJson.userId, updateAccountDataJson.password, updateAccountDataJson.encryptedAccountData);
                return Json("ok");
            }
            return Json("error");
        }


        //public JsonResult AccountData(string password, string mail)
        //{
        //    LoginData data = new LoginData();
        //    data.password = password;
        //    data.mail = mail;
        //    data.userId = TreeNoteUser.getUserId(mail, password);
        //    data.encryptedAccountData = "";
        //    return Json(data);
        //}

        //public ActionResult branches(string userId, string userPassword)
        //{
        //    if (!TreeNoteUser.userValid(userId, userPassword))
        //        return Content("Login error");

        //    return Content(TreeNoteUser.branchesData(userId));
        //}

        //[Route("Home/createAccount/{mail}")]
        //public ActionResult createAccount(string mail)
        //{
        //    string frommail = "tree.note.service@gmail.com";
        //    string toMail = mail;// "eugeniyloshchenko@gmail.com";
        //    MailMessage mailMessage = new MailMessage(frommail, toMail, "Subject1", "Body1");
        //    SmtpClient smtpClient = new SmtpClient("smtp.gmail.com", 587);
        //    smtpClient.EnableSsl = true;
        //    smtpClient.UseDefaultCredentials = false;
        //    smtpClient.Credentials = new NetworkCredential(frommail, "cvonsdlpfknoqchiurou75nf428yh2f");
        //    try
        //    {
        //        smtpClient.Send(mailMessage);
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.Message);
        //    }

        //    return Content("На вашу почту было отправлено письмо для продолжения регистрации");
        //}
    }
}
