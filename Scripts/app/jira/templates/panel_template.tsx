import React = require('react');

var template = function () {
    return (
    <div className={"epics-panel panel panel-default"}>
        <div className={"panel-heading"}>
            <label>{this.props.title}</label>
        </div>
        <div className={"panel-body"}>
            <div className={"filter-items-epics"}>
                <div className={"form-group"}>
                    <div className={"filter-epics"}>
                    </div>
                    {this.props.children}
                </div>
            </div>
        </div>
    </div>
    );
};

export = template;