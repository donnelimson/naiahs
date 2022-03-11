﻿angular.module("MetronicApp").factory('ItemMasterService', ['CommonService', function (commonService) {
    return {
        Search: function (data) {
            return commonService.PostData(data, document.ItemMaster + 'Search');
        },
        GetDetailsById: function (data) {
            return commonService.GetData(data, document.ItemMaster + 'GetDetailsById');
        },
        AddOrUpdate: function (data) {
            return commonService.PostData(data, document.ItemMaster + 'AddOrUpdate');
        },
        ExportDataToExcelFile: function (data) {
            return commonService.PostData(data, document.ItemMaster + 'ExportDataToExcelFile');
        },
        GetAllItems: function (data) {
            return commonService.GetData(data, document.ItemMaster + 'GetAllItems');
        },
        GetItemMasterLookUpById: function (data) {
            return commonService.GetData(data, document.ItemMaster + 'GetItemMasterLookUpById');
        },
        GetMaxQtyByItemMasterAndBrandId: function (data) {
            return commonService.GetData(data, document.ItemMaster + 'GetMaxQtyByItemMasterAndBrandId');
        },
        

    };
}]);