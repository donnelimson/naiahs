﻿using Codebiz.Domain.Common.Model;
using Codebiz.Domain.Common.Model.DTOs;
using Codebiz.Domain.ERP.Context.SeedData;
using ERP.Model.DTO;
using ERP.Model.Filter;
using Infrastructure;
using Infrastructure.Services;
using Infrastructure.Services.MD;
using Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Web.Controllers;
using Web.Filters;

namespace Web.Areas.MD.Controllers
{
    public class ItemMasterController : BaseController
    {
        private readonly IAppUserServices _appUserServices;
        private readonly IUnitOfWork _unitOfWork;
        private readonly IItemMasterService _itemMasterService;
        public ItemMasterController(IAppUserServices appUserService,
            IUnitOfWork unitOfWork,
            IItemMasterService itemMasterService) : base(appUserService)
        {
            _appUserServices = appUserService;
            _unitOfWork = unitOfWork;
            _itemMasterService = itemMasterService;
        }
        #region Views
        [ClaimsAuthorize(ClaimCustomTypes.UserPermissions, PermissionData.UserCanViewItemMaster)]
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Form(int? id)
        {
            return View();
        }
        #endregion
        #region Actions
        [HttpPost]
        public JsonResult Search(ItemMasterFilter filter)
        {
            return Json(new { result = _itemMasterService.Search(filter), totalRecordCount = filter.FilteredRecordCount }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult AddOrUpdate(ItemMasterViewModel model)
        {
            var dataDTO = model;
            var ajaxResult = new AjaxResult();
            ajaxResult.Action = model.Id == 0 ? "create" : "update";
            ajaxResult.Module = "Item Master";
            RunMethod(() =>
            {
                _itemMasterService.AddOrUpdate(model, CurrentUser.AppUserId);
                _unitOfWork.SaveChanges();
                ajaxResult.Success = true;
                ajaxResult.Message = "Item Master has been successfully " + ajaxResult.Action + "d";
                Logger.Info($"{ajaxResult.Message}. UserId : [{CurrentUser.AppUserId}]." + JsonConvert.SerializeObject(dataDTO), ajaxResult.LogEventTitle, "", "", JsonConvert.SerializeObject(model));
            },ajaxResult);
            return Json(new
            {
                success = ajaxResult.Success,
                message = ajaxResult.Message,
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetDetailsById(int id)
        {
            return Json(new { result = _itemMasterService.GetDetailsById(id) }, JsonRequestBehavior.AllowGet);
        }
        #endregion

    }
}