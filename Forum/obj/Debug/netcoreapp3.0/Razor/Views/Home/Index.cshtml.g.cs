#pragma checksum "D:\Dropbox\program\typescript\Forum\Forum\Views\Home\Index.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "5c57860c10c82b8101e1cf3d0bcd8a9bbdde2f63"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_Index), @"mvc.1.0.view", @"/Views/Home/Index.cshtml")]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#nullable restore
#line 1 "D:\Dropbox\program\typescript\Forum\Forum\Views\_ViewImports.cshtml"
using Forum;

#line default
#line hidden
#nullable disable
#nullable restore
#line 2 "D:\Dropbox\program\typescript\Forum\Forum\Views\_ViewImports.cshtml"
using Forum.Models;

#line default
#line hidden
#nullable disable
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"5c57860c10c82b8101e1cf3d0bcd8a9bbdde2f63", @"/Views/Home/Index.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"2ac609fd15eba99a48942b04c8579a10a24406fb", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_Index : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#nullable restore
#line 1 "D:\Dropbox\program\typescript\Forum\Forum\Views\Home\Index.cshtml"
  
    ViewData["Title"] = "Home Page";

#line default
#line hidden
#nullable disable
            WriteLiteral(@"
<div id=""contentions""></div>
<button style=""text-align: left; position: fixed; left: 0px; top: 0px; width: 200px; height: 20px; "" onclick=""Controller.viewAll()"">all</button>
<div id=""topics""></div>
<div class=""menuStyle"" style=""margin: 0px;"">

    <div class=""uiButtons"">
        <textarea id=""argumentTextArea"" style=""width:320px; height:73px;""></textarea>
        <div>
            <div>
                <div>
                    <textarea id=""loginTextArea"" style=""width:180px; height:20px;"" placeholder=""логин""></textarea>
                    <button style=""background-color:#7bfc03;"" onclick=""Controller.changeContentionColor('#7bfc03')""> Text</button>
                    <button style=""background-color:#f8fc03;"" onclick=""Controller.changeContentionColor('#f8fc03')""> Text</button>
                    <button style=""background-color:#03fcbe;"" onclick=""Controller.changeContentionColor('#03fcbe')""> Text</button>
                    <button class=""UIBbutton"" onclick=""Controller.addContention()"">Добав");
            WriteLiteral(@"ить</button>
                    <button class=""UIBbutton"" onclick=""Controller.changeContention()"">Изменить</button>
                    <button class=""UIBbutton"" onclick=""Controller.createTopicFromContention()"" style=""background-color: #e6e6e6;"">сделать топиком</button>
                    <button class=""UIBbutton""");
            BeginWriteAttribute("onclick", " onclick=\"", 1389, "\"", 1399, 0);
            EndWriteAttribute();
            WriteLiteral(@">перенести(shift+click)</button>
                    <button class=""UIBbutton"" onclick=""Controller.import()"">import</button>
                </div>
                <div>
                    <textarea id=""encriptionKeyTextArea"" style=""width:180px; height:20px;"" placeholder=""ключ для шифрования""></textarea>
                    <button style=""background-color:#FFF;"" onclick=""Controller.changeContentionColor('#FFF')""> Text</button>
                    <button style=""background-color:#fc03f0;"" onclick=""Controller.changeContentionColor('#fc03f0')""> Text</button>
                    <button style=""background-color:#fc3503;"" onclick=""Controller.changeContentionColor('#fc3503')""> Text</button>
                    <button class=""UIBbutton"" onclick=""Controller.addLink()"">добавить ссылку</button>
                    <button class=""UIBbutton"" onclick=""Controller.deleteContention()"">удалить(del)</button>
                    <button class=""UIBbutton"" onclick=""Controller.addSelectedToArchive()"">(archive)</button>
");
            WriteLiteral(@"                    <button class=""UIBbutton"" onclick=""Controller.collapceSelectedContention()"" style=""background-color: #9b9bff;"">свернуть(right+click)</button>
                    <button class=""UIBbutton"" onclick=""Controller.export()"">export</button>
                </div>
            </div>
            <div>
                <button class=""UIBbutton"" onclick=""Controller.reload()"">Reload</button>
            </div>
        </div>
    </div>
</div>");
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591
