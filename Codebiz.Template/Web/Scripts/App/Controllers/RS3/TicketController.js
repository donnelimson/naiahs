﻿MetronicApp.controller('TicketIndexController', ['$scope', 'TicketService', 'CommonService', '$window', '$timeout','NgTableParams','$q',
    function ($scope, TicketService, CommonService, $window, $timeout, NgTableParams, $q) {
     
        $scope.priorities = PRIORITIES;
        $scope.ticketStatuses = TICKETSTATUSES;
        this.$onInit = function () {
            $scope.reset();
        }
        $scope.myTicketsOnly = function () {
            $scope.search();
        }
        $scope.reset = function () {
            $scope.f = {
                TicketNo: "",
                Technician: "",
                Client: "",
                Priority: null,
                CreatedBy: "",
                CreatedOnFrom: null,
                Status: null,
                SortDirection: 'desc',
                SortColumn: 'CreatedOn',
                MyTicketsOnly:false
            };
            $scope.createdDate = null;
            $scope.search();
        }
        $scope.search = function () {
            var initialSettings = {
                getData: function (params) {
                    for (var i in params.sorting()) {
                        $scope.sortColumn = i;
                        $scope.sortOrder = params.sorting()[i];
                    }
                    var d = $q.defer();
                    $scope.f.Page = params.page();
                    $scope.f.PageSize = params.count();
                    $scope.f.SortDirection = $scope.sortOrder == null ? 'desc' : $scope.sortOrder;
                    $scope.f.SortColumn = $scope.sortColumn == null ? 'CreatedOn' : $scope.sortColumn;
                    $scope.f.CreatedOnFrom = getDateRangePickerValue(1, $scope.createdDate);
                    $scope.f.CreatedOnTo = getDateRangePickerValue(2, $scope.createdDate);
                    TicketService.Search({
                        filter: $scope.f
                    }).then(function (data) {
                        $scope.resultsLength = data.totalRecordCount;
                        params.total(data.totalRecordCount);
                        d.resolve(data.result);
                    });
                    return d.promise;
                }
            };
            $scope.tableParams = new NgTableParams(10, initialSettings);
        }
        $scope.searchWhenEnter = function ($event) {
            var keyCode = $event.which || $event.keyCode;
            if (keyCode === 13) {
                $scope.search();
            }
        }
        $scope.viewTicket = function (id) {
            window.location.href = document.Ticket + 'ViewTicket?Id=' + id;
        }
    }]);
MetronicApp.controller('TicketAddOrUpdateController', ['$scope', 'TicketService', 'CommonService', '$window', '$timeout', 'NgTableParams', '$q', '$uibModal', '$controller', '$location',
    function ($scope, TicketService, CommonService, $window, $timeout, NgTableParams, $q, $uibModal, $controller, $location,) {
        $controller('SupportingDocumentController', { $scope: $scope });

        
        $scope.withdocumentType = false;
  
        $scope.options = {
            url: document.FileUpload + "UploadTicketAttachments"
        };
      
        this.$onInit = function () {
            //console.log($location.search().Id )
            $scope.priorities = PRIORITIES;
            $scope.isUpdate = $location.search().Id != null;
            if ($scope.isUpdate) {
                $scope.GetTicketUpdates();
            }
            else {
                TicketService.CheckIfClient().then(function (d) {
                    $scope.m.IsClient = d.result;
                });
            }
           // console.log($scope.isUpdate)
      
        }
        $scope.m = {
            ClientId: null,
            TechnicianId:null
        }
        $scope.resolveOrReopen = function () {
            var action = $scope.m.IsResolved ? 're-open' : 'resolve';
            swal({
                title: "Comfirm Action",
                text: "Are you sure to "+action+" this comment?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "OK",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    TicketService.ResolveOrReopenTicket({ id: $scope.m.Id}).then(function (d) {
                        if (d.Success) {
                            CommonService.successMessage(d.Message);
                            GetTicketUpdates();
                        }
                        else {
                            CommonService.warningMessage(d.Message);
                        }
                    })
                }

            });
        }
        $scope.takeTicket = function () {
            swal({
                title: "Take Ticket",
                text: "Are you sure to take this ticket?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "OK",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    TicketService.TakeTicket({ id: $scope.m.Id }).then(function (d) {
                        if (d.Success) {
                            CommonService.successMessage(d.Message);
                            $scope.GetTicketUpdates();
                        }
                        else {
                            CommonService.warningMessage(d.Message);
                        }
                    })
                }

            });
        
        }
        $scope.viewMyTickets = function () {
            var modalData = {
                LookupType: 'TCK',
                Module: 'MY TICKETS',
            }
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: `${document.baseUrlNoArea}ChooseFromList/GetLookup?objType=${modalData.LookupType}`,
                controller: 'ChooseFromListController',
                size: 'md',
                keyboard: false,
                backdrop: "static",
                windowClass: 'modal_style',
                modalOverflow: true,
                resolve: {
                    Data: function () {
                        return modalData;
                    },
                }
            }).result.then(function (data) {
                console.log(data)
                window.location.href = document.Ticket + 'ViewTicket/?Id='+data.Id;
            });
        }
        $scope.comment = function () {
            if ($scope.m.Comment.length != 0) {
                swal({
                    title: "Comfirm Comment",
                    text: "Are you sure to submit this comment?",
                    type: "info",
                    showCancelButton: true,
                    confirmButtonColor: "#1ab394",
                    confirmButtonText: "OK",
                    closeOnConfirm: true
                }, function (isConfirm) {
                        if (isConfirm) {
                            TicketService.SubmitComment({ Id: $scope.m.Id, Comment: $scope.m.Comment, IsResolved: $scope.isResolved }).then(function (d) {
                                if (d.Success) {
                                    CommonService.successMessage(d.Message);
                                    $scope.GetTicketUpdates();
                                }
                                else {
                                    CommonService.warningMessage(d.Message);
                                }
                            })
                        }
                      
                });
            }
     
        }
        $scope.searchUser = function (isClient) {
            var modalData = {
                LookupType: 'APU',
                RoleId: isClient ? 4 : 3, //client //tech
                Module: isClient ? 'CLIENTS' : 'TECHNICIAN'
            }
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: `${document.baseUrlNoArea}ChooseFromList/GetLookup?objType=${modalData.LookupType}`,
                controller: 'ChooseFromListController',
                size: 'md',
                keyboard: false,
                backdrop: "static",
                windowClass: 'modal_style',
                modalOverflow: true,
                resolve: {
                    Data: function () {
                        return modalData;
                    },
                }
            }).result.then(function (data) {
                if (isClient) {
                    $scope.m.ClientId = data.Id;
                    $scope.m.ClientEmail = data.Email;
                    $scope.m.Client = data.Name;
                }
                else {
                    $scope.m.TechnicianId = data.Id;
                    $scope.m.TechnicianEmail = data.Email;
                    $scope.m.Technician = data.Name;
                }
            });

        }
        $scope.save = function () {
            $scope.formSubmitted = true;
            if ($scope.f.$valid) {
                CommonService.saveOrUpdateChanges(function () {
                    $scope.m.Attachments = $scope.queue;
                    TicketService.AddOrUpdate({ viewModel: $scope.m }).then(function (d) {
                        if (d.Success) {
                            CommonService.successMessage(d.Message);
                            $timeout(function () {
                                window.location.href = document.Ticket;
                            }, 1000);
                        }
                        else {
                            CommonService.warningMessage(d.Message);
                        }
                    })
                }, $scope.m.Id == null ? 0 : $scope.m.Id);
            }
        }
        $scope.cancelChanges = function () {
            if (!$scope.f.$pristine) {
                CommonService.cancelChanges(function () {
                    window.location.href = document.Ticket;
                })
            }
            else {
                window.location.href = document.Ticket;
            }
        }
        $scope.guessChange = function () {
            $scope.m.ClientAddress = "";
            $scope.m.Client = "";
            $scope.m.ClientEmail = "";
        }
        $scope.openSupportingDocumentPreview = function (thumbnailUrl, name, url, isPdf, isWord) {
            //console.log(url)
            if (isPdf || isWord) {
                $window.open(url, '_blank');
            }
            else {
                $uibModal.open({
                    animation: true,
                    ariaLabelledBy: 'modal-title',
                    ariaDescribedBy: 'modal-body',
                    templateUrl: 'SupportingDocumentsPreviewModal.html',
                    controller: 'SupportingDocumentsPreviewController',
                    size: 'md',
                    keyboard: false,
                    backdrop: "static",
                    windowClass: 'modal_style',
                    modalOverflow: true,
                    resolve: {
                        thumbnailUrl: function () {
                            return thumbnailUrl;
                        },
                        name: function () {
                            return name;
                        }
                    }
                }).result.then(function (data) {
                }, function () {

                });
            }
        }
        $scope.viewInternalLogs = function () {
            $uibModal.open({
                animation: true,
                ariaLabelledBy: 'modal-title',
                ariaDescribedBy: 'modal-body',
                templateUrl: '_InternalLogs.html',
                controller: 'InternalLogsController',
                size: 'xlg',
                keyboard: false,
                backdrop: "static",
                windowClass: 'modal_style',
                modalOverflow: true,
                resolve: {
                    InternalLogs: function () {
                        return $scope.internalLogs;
                    },
                    Id: function () {
                        return $scope.m.Id
                    }
                }
            }).result.then(function (data) {
                $scope.GetTicketUpdates();
            });
        }

        $scope.GetTicketUpdates=function() {
            TicketService.GetTicketDetailsById({ id: $location.search().Id }).then(function (d) {
                $scope.m = d.result;
                $scope.queue = d.result.Attachments;
                $scope.internalLogs = $scope.m.Comments.filter(r => r.IsInternal)
                $scope.m.Comments = angular.copy($scope.m.Comments.filter(r => !r.IsInternal));
                $scope.m.Comment = "";
                //   console.log(d.result.Attachments)
                if ($scope.m.ClientId == null) {
                    $scope.IsGuess = true;
                }
            });
        }
    }]);
MetronicApp.controller('TicketViewController', ['$scope', 'TicketService', 'CommonService', '$window', '$timeout', 'NgTableParams', '$q', '$uibModal', '$controller','$location',
    function ($scope, TicketService, CommonService, $window, $timeout, NgTableParams, $q, $uibModal, $controller, $location) {
        $controller('SupportingDocumentController', { $scope: $scope });

        $scope.priorities = PRIORITIES;
        $scope.options = {
            url: document.FileUpload + "UploadTicketAttachments"
        };
    
    }]);
MetronicApp.controller('InternalLogsController', ['$scope', 'TicketService', 'CommonService', '$window', '$timeout', 'NgTableParams', '$q','$uibModalInstance','InternalLogs','Id',
    function ($scope, TicketService, CommonService, $window, $timeout, NgTableParams, $q, $uibModalInstance, InternalLogs, Id) {
     
        $scope.InternalLogs = InternalLogs;
        $scope.submitComment = function () {
            swal({
                title: "Comfirm Comment",
                text: "Are you sure to submit this comment?",
                type: "info",
                showCancelButton: true,
                confirmButtonColor: "#1ab394",
                confirmButtonText: "OK",
                closeOnConfirm: true
            }, function (isConfirm) {
                if (isConfirm) {
                    TicketService.SubmitComment({ Id: Id, Comment: $scope.i.Comment, IsInternal: true }).then(function (d) {
                        if (d.Success) {
                            CommonService.successMessage(d.Message);
                            TicketService.GetTicketDetailsById({ id: Id }).then(function (d) {
                                $scope.InternalLogs = d.result.Comments.filter(r => r.IsInternal);
                                $scope.i.Comment = '';
                                $scope.iForm.$pristine = true;
                            });

                        }
                        else {
                            CommonService.warningMessage(d.Message);
                        }
                    })
                }

            });
     
        }
        $scope.closeModal = function () {
            if (!$scope.iForm.$pristine) {
                CommonService.cancelChanges(function () {
                    $uibModalInstance.close();
                })
            }
            else {
                $uibModalInstance.close();

            }
        }
    }]);