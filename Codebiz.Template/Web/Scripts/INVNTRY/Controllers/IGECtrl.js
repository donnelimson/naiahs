﻿(function () {
    var app = angular.module(
        'IGE.DOCUMENT', [
        'cb.components.linktextbox',
        'cb.components.SelectList',
        'cb.invntry.doctemplate',
        'cb.doc.FormGrid',
        'CFL.DATASERVICE',
        'BP.SETUP.SERVICE',
        'TRN.INVNTRY.SERVICE'])
    app
        .controller('IGEListCtrl', [
            '$scope',
            '$rootScope',
            '$uibModal',
            '$window',
            '$timeout',
            '$q',
            'CommonService',
            'NgTableParams',
            'InvntryTrn.common.service',
            'ige.service',
            function ($scope, $rootScope, $uibModal, $window, $timeout, $q, $cs, $ngTable, $invntryCommon, $ige) {
                $scope.m = { 'ObjType': 'IGE' }

                $q.all([
                    $invntryCommon.GetListBySearchCriteria($scope.m).then((res) => res.DataResult)
                ]).then(function (res) {

                    

                    $scope.tableParams = new $ngTable(10, { dataset: res[0] });

                    $scope.onViewClick = function (item) {
                        $window.location.href = `#!/IGEDetail/${item.DocID}`
                    }

                    $scope.onEditClick = function (item) {
                        $window.location.href = `#!/IGEDetail/${item.DocID}`
                    }

                    $scope.searchWhenEnter = function (e) {
                        if (e.keyCode === 13) {
                            $invntryCommon.GetListBySearchCriteria($scope.m).then(res => {
                                let d = res.DataResult
                                if (res.StatusCode === '0') {
                                    $scope.tableParams = new $ngTable(10, { dataset: d });
                                }
                            })
                        }
                    }
                })
            }])
        .controller('IGEDetailCtrl', [
            '$scope',
            '$rootScope',
            '$routeParams',
            '$location',
            '$filter',
            '$window',
            '$q',
            'CommonService',
            'BusinessPartnerService',
            'ige.service',
            function ($scope, $rootScope, $routeParams, $location, $filter, $window, $q, $cs, $bp, $ige) {

                $scope.docId = $routeParams.DocID

                $scope.docData = {}

                let d = $q.defer()


                if ($location.path().contains('/BaseDoc')) {
                    /**/
                    $scope.sourceDocID = $routeParams.sourceDocID

                    $scope.sourceObjType = $routeParams.sourceObjType

                    if ($scope.sourceObjType === 'IGE') {
                        let model = $pqu.GetIGEByID($scope.sourceDocID).then(res => {
                            if (res.StatusCode === '0') {
                                return res.DataResult
                            }
                        })

                        $scope.docData.model = model

                        d.resolve({
                            "Action": "COPY",
                            "SrcID": $scope.sourceDocID,
                            "SrcType": $scope.sourceObjType,
                        })

                        $scope.docData.DocAction = d.promise
                    }
                }
                else {

                    if ($scope.docId > 0) {

                        $scope.docId = $routeParams.DocID

                        /*edit*/
                        if ($scope.docId > 0) {

                            let model = $ige.GetIGEByID($scope.docId).then(res => {
                                if (res.StatusCode === '0') {
                                    return res.DataResult
                                }
                            })

                            //d.resolve([model, { 'DocNumData': docnumData }])

                            $scope.docData.model = model

                            d.resolve({ "Action": "EDIT" })

                            $scope.docData.DocAction = d.promise
                        }

                    } else {
                        /*new*/
                        let currDate = $filter('date')(new Date(), 'MM/dd/yyyy')
                        let model = {
                            "DocID": -1,
                            "DocType": "I",
                            "DocDate": currDate,
                            "TaxDate": currDate,
                            "Document_Lines": []
                        }


                        d.resolve({ "Action": "ADD" })

                        $scope.docData.model = model

                        $scope.docData.DocAction = d.promise
                    }
                }

                $scope.$on('onDocumentSaveAction', function (e, args) {

                    let m = args.docHeader;

                    docID = m.DocID
                    if (args.docDetail.length > 0) {
                        m.Document_Lines = args.docDetail.filter(x => !(x.Dscription === '' && x.AcctCode === ''))
                    }

                    if (docID > 0) {
                        if ($cs.saveChanges(() => {
                            $ige.SaveOrUpdate(m).then(res => {
                                $scope.$broadcast('onDocumentSavePostAction', {
                                    'objType': 'IGE', // change this per doctype
                                    'data': d.DataResult
                                })
                                $window.location.href = '#!/IGEList'
                            })
                        }));
                    }
                    else {
                        if ($cs.saveChanges(() => {
                            $ige.Add(m).then(function (d) {
                                $scope.$broadcast('onDocumentSavePostAction', {
                                    'objType': 'IGE', // change this per doctype
                                    'data': d.DataResult
                                })
                                $window.location.href = '#!/IGEList'
                            })
                        }));
                    }
                })
            }])
}());


(function () {
    let app = angular.module('MetronicApp')

    app.requires.push.apply(app.requires, ['ngRoute', 'IGE.DOCUMENT'])

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/IGEList', {
                templateUrl: 'DocumentListTemplate.html',
                controller: 'IGEListCtrl'
            })

            .when('/IGEDetail/:DocID', {
                templateUrl: 'DocumentDetailTemplate.html',
                controller: 'IGEDetailCtrl'
            })

            .when('/BaseDoc/:sourceObjType/:sourceDocID', {
                templateUrl: 'DocumentDetailTemplate.html',
                controller: 'IGEDetailCtrl'
            })

            .otherwise({
                templateUrl: 'DocumentListTemplate.html',
                controller: 'IGEListCtrl'
            })

        $locationProvider.html5Mode(false).hashPrefix('!');

    }])
}());