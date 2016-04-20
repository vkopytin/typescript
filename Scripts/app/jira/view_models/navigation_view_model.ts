/// <reference path="../navigation.ts" />
/// <reference path="../base/base_view_model.ts" />
import BaseViewModel = require('app/jira/base/base_view_model');
import Navigation = require('app/jira/navigation');
        
class NavigationViewModel extends BaseViewModel {
    
    navigateTo (name?) {
        var navigation = Navigation.getInstance();
        
        navigation.loadComponent(name);
    }
}
export = NavigationViewModel;