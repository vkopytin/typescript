/// <reference path="../navigation.ts" />
/// <reference path="../command.ts" />
/// <reference path="../base/base_view_model.ts" />
import BaseViewModel = require('app/jira/base/base_view_model');
import Command = require('app/jira/command');
import Navigation = require('app/jira/navigation');
    
class PageViewModel extends BaseViewModel {
    DeployEmailNavigateCommand: Command
    JiraReportNavigateCommand: Command
    
    navigation: any

    init (opts) {
        super.init(opts);
        
        this.DeployEmailNavigateCommand = new Command({ execute: this.onDeployEmailNavigateCommand, scope: this });
        this.JiraReportNavigateCommand = new Command({ execute: this.onJiraReportNavigateCommand, scope: this });
    }
    
    onDeployEmailNavigateCommand () {
        this.navigation.navigateTo('deploy-email');
    }
    onJiraReportNavigateCommand () {
        this.navigation.navigateTo('jira-report');
    }
}
export = PageViewModel;