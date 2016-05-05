import React = require('react');
import Utils = require('app/jira/utils');

var template = function () {
return (
<div id={"page-inner"}>
    <div className={"row pad-top-botm "}>
        <div className={"col-lg-12 col-md-12 col-sm-12"}>
            <h1 className={"page-head-line"}>Tomorrow Deploy</h1>
            <h1 className={"page-subhead-line"}>Tomorrow deploy</h1>
        </div>
    </div>
    <div className={"row"}>
        <div
         style={{fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif"}}
         className={"email-contents col-lg-12 col-md-12 col-sm-12"}
         dangerouslySetInnerHTML={this.getEmailHTML()}
        />
    </div>

    {/* /. ROW  */}
    <div className={"row pad-top-botm"}>
        <div className={"auto-email col-lg-12 col-md-12 col-sm-12"}>
            <hr/>
            <a className={"btn btn-primary btn-lg"}
             href={"mailto:qa@rebelmouse.com?subject=" + this.state.subject + "&body=" + this.getEmailText()}
             >Create mail</a>
        </div>
    </div>
    {/* /. ROW  */}
</div>
);
};

export = template;