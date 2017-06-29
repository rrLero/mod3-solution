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
    },
    controller: MenuSearchDirectiveController,
    controllerAs: 'list',
    bindToController: true,
    link: NarrowItDownDirectiveLink
  }
  return ddo;

}

NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var syntax = this;
  syntax.searchTerm = "";
  syntax.getSortedList = function () {
    syntax.found = ''
    if (syntax.searchTerm) {
      var promise = MenuSearchService.getMatchedMenuItems(syntax.searchTerm.toLowerCase());
      promise.then(function (result) {
      syntax.found = result;
      if (!syntax.found.length) {
        syntax.found = '';
      }
    })
  } else {
    // syntax.searchTerm = "Nothing Found";
  }
  }
  syntax.removeItem = function (itemIndex) {
    syntax.found.splice(itemIndex, 1);
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
      foundItems = result.data.menu_items.filter(function (el) {
        return el.description.indexOf(searchTerm)!=-1
      })
           // return processed items
      return foundItems;
    });
    }
}

function NarrowItDownDirectiveLink(scope, element, attrs, controller) {


  scope.$watch('list.isEmptyList()', function (newValue, oldValue) {
    console.log("Old value: ", oldValue);
    console.log("New value: ", newValue);

    if (newValue === true) {
      displayCookieWarning();
    }
    else {
      removeCookieWarning();
    }

  });

  function displayCookieWarning() {
    // Using Angluar jqLite
    var warningElem = element.find("p");
    console.log(warningElem);
    warningElem.css('display', 'block');

  }


  function removeCookieWarning() {
    // Using Angluar jqLite
    var warningElem = element.find("p");
    warningElem.css('display', 'none');

  }
}

function MenuSearchDirectiveController() {
  var list = this;

  list.isEmptyList = function () {

      if (list.items) {
        return false;
      }
    return true;
  };
}


})()
