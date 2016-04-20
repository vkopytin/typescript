interface Window {
    __extends: Function;
    report: any;
}
declare var window: Window;

declare var require: any;

declare var _:any;
declare module "underscore" {
  export = _;
}

declare var utils:any;
declare module "app/jira/utils" {
  export = utils;
}
declare var $:any;
declare module "jquery" {
  export = $;
}

declare var template: any;
declare module "hgn!app/jira/templates/email_template" {
  export = template;
}
declare var emailTemplate: any;
declare module "hgn!app/main/templates/deploy_email.email_template" {
  export = emailTemplate;
}

declare module "hgn!app/jira/templates/filter_item_template" {
  export = template;
}

declare var itemTemplate: any;
declare module "hgn!app/jira/templates/jira_issue_item_template" {
  export = itemTemplate;
}

declare module "hgn!app/jira/templates/jira_template" {
  export = template;
}

declare module "hgn!app/jira/templates/panel_template" {
  export = template;
}

declare var pageTemplate: any;
declare module "hgn!app/jira/templates/page_template" {
  export = pageTemplate;
}