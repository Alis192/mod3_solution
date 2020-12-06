(function() {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .directive('foundItems', FoundItems)
        .service('MenuSearchService', MenuSearchService)
        .constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

    function FoundItems() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'loader/foundItems.html',
            scope: {
                foundItems: '<',
                onEmpty: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'ctrl',
            bindToController: true
        };

        return ddo;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var ctrl = this;
        ctrl.sValue = '';

        ctrl.matchedMenuItems = function(searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems(searchTerm);

            promise.then(function(items) {
                if (items.length > 0) {
                    ctrl.message = '';
                    ctrl.found = items;
                } else {
                    ctrl.message = 'Nothing found!';
                    ctrl.found = [];
                }
            });
        };
        ctrl.removeMenuItem = function(itemIndex) {
            ctrl.found.splice(itemIndex, 1);
        }
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];

    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function(searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json")
            }).then(function(result) {
                var foundItems = [];

                for (var i = 0; i < result.data['menu_items'].length; i++) {
                    if (searchTerm.length > 0 && result.data['menu_items'][i]['description'].toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push(result.data['menu_items'][i]);
                    }
                }
                return foundItems;
            });
        };
    }
})();
