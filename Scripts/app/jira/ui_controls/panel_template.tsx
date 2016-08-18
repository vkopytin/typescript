import React = require('react');

var template = function () {
    return (
    <div className={"panel panel-default highlight"}>
        <div className={"panel-heading"}>
            <label>{this.props.title}</label>
        </div>
        <div className={"panel-body"}>
            <div className={"form-group"}>
                {this.props.children}
            </div>
        </div>
    </div>
    );
};

export = template;