import React = require('react');

var template = {
    body: function () {return (
    <div className={"panel panel-default highlight"}>
        {this.getHeader()}
        <div className={"panel-body"}>
            <div className={"form-group"}>
                {this.getChildren()}
            </div>
        </div>
    </div>
    );},

    header: function (def: any) {return (
    <div className={"panel-heading"}>
        {!def && this.props.children}
        {def && <label>{this.props.title}</label>}
    </div>
    );}
}

export = template;