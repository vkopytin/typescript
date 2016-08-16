/// <reference path="../navigation.ts" />
/// <reference path="../command.ts" />
/// <reference path="../base/base_view_model.ts" />
import BaseViewModel = require('app/jira/base/base_view_model');
import Command = require('app/jira/command');
import Navigation = require('app/jira/navigation');
    
class PageViewModel extends BaseViewModel {
    DeployEmailNavigateCommand: Command
    JiraReportNavigateCommand: Command
    FeedingPageNavigateCommand: Command
    
    navigation: any

    init (opts: any) {
        super.init(opts);
        
        this.DeployEmailNavigateCommand = new Command({ execute: this.onDeployEmailNavigateCommand, scope: this });
        this.JiraReportNavigateCommand = new Command({ execute: this.onJiraReportNavigateCommand, scope: this });
        this.FeedingPageNavigateCommand = new Command({ execute: this.onFeedingPageNavigateCommand, scope: this });
    }
    getCommand (name: string): Command {
        switch (name) {
            case 'DeployEmailNavigateCommand':
                return this.DeployEmailNavigateCommand;
            case 'JiraReportNavigateCommand':
                return this.JiraReportNavigateCommand;
            case 'FeedingPageNavigateCommand':
                return this.FeedingPageNavigateCommand;
            default:
                return super.getCommand(name);
        }
    }
    onDeployEmailNavigateCommand () {
        this.navigation.navigateTo('deploy-email');
    }
    onJiraReportNavigateCommand () {
        this.navigation.navigateTo('jira-report');
    }
    onFeedingPageNavigateCommand () {
        this.navigation.navigateTo('feeding');
    }
}
export = PageViewModel;