/// <reference path="jira/base/base_view_model.ts" />
/// <reference path="jira/view_models/navigation_view_model.ts" />
/// <reference path="jira/utils.ts" />
import $ = require('jquery');
import BaseViewModel = require('app/jira/base/base_view_model');
import PageViewModel = require('app/jira/view_models/navigation_view_model');
import utils = require('app/jira/utils');

module jira {
    var navigation =

    // Inject debendencies
    BaseViewModel.prototype.navigation = new PageViewModel({});
    
    export function init () {
        var location = window.location.hash.substr(1) || 'jira-report';
        navigation.navigateTo(location);
        
        return true;
    }
}
export = jira;