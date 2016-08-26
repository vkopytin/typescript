import React = require('react');

var template = function () {
    return (
        <div className={"list-group"}>
            <a href={"#"} className={"list-group-item"}>
        		<i className={"fa fa-shopping-cart fa-fw"}></i>
                Name of product
        		<span className={"pull-right text-muted small"}>
        			<em>
        				Quontity: 20
        			</em>
        		</span>
            </a>
        </div>
    );
}

export = template;