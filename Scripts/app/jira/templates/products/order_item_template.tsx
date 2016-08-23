import _ = require('underscore');
import React = require('react');

var template = function (data: any) {
	return (<tr onClick={(e) => this.onClick(e)}>
		<td>
			{data.getId()}
		</td>
		<td>
			{data.getOrderDate()}
		</td>
	</tr>);
};

export = template;