﻿
angular.module("MetronicApp").
    factory('TicketService', ['CommonService', function (commonService) {
        return {
            Search: function (args) {
                return commonService.PostData(args, document.Ticket + 'Search', null);
            },
        }
    }]);