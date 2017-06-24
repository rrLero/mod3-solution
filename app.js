(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItems)
.constant('ApiBasePath', "https://davids-restaurant.herokuapp.com");

function FoundItems() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      onRemove: '&'
    }
  }
  return ddo;

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var controller = this;
  controller.searchTerm = "";
  controller.getSortedList = function () {
    controller.found = ''
    if (controller.searchTerm) {
      var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm.toLowerCase());
      promise.then(function (result) {
      controller.found = result;
      console.log(controller.found);
      if (!controller.found.length) {
        controller.searchTerm = "Nothing Found";
        controller.found = '';
      }
    })
  } else {
    controller.searchTerm = "Nothing Found";
  }
  }
  controller.removeItem = function (itemIndex) {
    controller.found.splice(itemIndex, 1);
  }
}

MenuSearchService.$inject = ['$http', 'ApiBasePath'];
function MenuSearchService($http, ApiBasePath) {
    var search=this;
    search.getMatchedMenuItems = function (searchTerm) {
      return $http({
        method: "GET",
        url: (ApiBasePath + "/menu_items.json")
      })
      .then(function (result) {
      // process result and only keep items that match
      var foundItems = [];
      for (var i=0; i<result.data.menu_items.length; i++) {
        if(result.data.menu_items[i].description.indexOf(searchTerm) != -1) {
          foundItems.push(result.data.menu_items[i])
        }
      }      // return processed items
      return foundItems;
    });
    }
}

})()
