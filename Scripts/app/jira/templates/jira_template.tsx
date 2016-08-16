import React = require('react');

var template = function (IssueView: any) {
    return (
<div id={"page-inner"}>
    <div className={"row"}>
        <div className={"col-md-12"}>
            <h1 className={"page-head-line"}>JIRA Report</h1>
        </div>
    </div>
 
    <div className={"row"}>
        <div className={"jira-issues-list col-md-12"}>
                    JIRA Issues
            <div className={"panel panel-default"}>
                <div className={"panel-heading"}>
                    <a href={"javascript:(function(){HOST = '{{domain}}';var jsCode = document.createElement('script');jsCode.setAttribute('src', HOST + '/mvc/jira/bookmarklet?' + Math.random());jsCode.setAttribute('id','jira-worktool-bookmarklet');document.getElementsByTagName('head')[0].appendChild(jsCode);}());"}><button className={"btn btn-lg btn-info"}>Jira bookmarklet</button></a>
                    <button
                      type={"button"}
                      className={"filter-reset btn btn-lg btn-primary"}
                      onClick={() => this.runCommand('ResetFiltersCommand')}
                     >Reset</button>
                    <label>Filter By Status</label>
                </div>
                <div className={"panel-body"}>
                    <div className={"filter-items-statuses"}>
                        <div className={"form-group"}>
                            {this.props.children.find((item: any) => item.ref === "filterStatuses")}
                        </div>
                    </div>
                </div>
            </div>
            {this.props.children.find((item: any) => item.ref === "epicsPanel")}
        </div>
    </div>
    <div className={"row"}>
        <div className={"table-responsive"}>
            <table className={"table table-hover"}>
                <thead>
                    <tr>
                        <th>Priority</th>
                        <th><div>Key: Summary</div><div>Status</div></th>
                        <th>X</th>
                        <th>Updated</th>
                        <th>Assignee</th>
                    </tr>
                </thead>
                <tbody className={"issues-list"}>
                {this.state.issues && this.state.issues.map((entity: any) => <IssueView viewModel={entity} key={entity.getId()}/>)}
                </tbody>
            </table>
        </div>
    </div>
</div>
    );
}
export = template;