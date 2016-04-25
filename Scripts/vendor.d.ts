/// <reference path="react.d.ts" />
/// <reference path="react-dom.d.ts" />
/// <reference path="underscore.d.ts" />
/// <reference path="jquery.d.ts" />

declare var object: any;

interface Function {
  name: string;
}

interface Window {
    __extends: Function;
    report: any;
}
declare var window: Window;

interface JQuery {
    metisMenu(): JQuery;
}

declare var require: any;

declare var utils:any;
declare module "app/jira/utils" {
  export = utils;
}

declare var template: (data: any) => string;
declare module "hgn!app/jira/templates/email_template" {
  export = template;
}
declare var emailTemplate: (data: any) => string;
declare module "hgn!app/main/templates/deploy_email.email_template" {
  export = emailTemplate;
}

declare module "hgn!app/jira/templates/filter_item_template" {
  export = template;
}

declare var itemTemplate: (data: any) => string;
declare module "hgn!app/jira/templates/jira_issue_item_template" {
  export = itemTemplate;
}

declare module "hgn!app/jira/templates/jira_template" {
  export = template;
}

declare module "hgn!app/jira/templates/panel_template" {
  export = template;
}

declare var pageTemplate: (data: any) => string;
declare module "hgn!app/jira/templates/page_template" {
  export = pageTemplate;
}

declare var FilterItemTemplate: any;
declare module "app/jira/templates/filter_item_template" {
  export = FilterItemTemplate;
}