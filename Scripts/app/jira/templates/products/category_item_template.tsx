import React = require('react');

var template = function (data: any) {
	return (<tr onClick={(e) => this.onClick(e)}>
		<td>
			{data.getCategoryName()}
		</td>
		<td>
			{data.getDescription()}
		</td>
	</tr>);
};

export = template;