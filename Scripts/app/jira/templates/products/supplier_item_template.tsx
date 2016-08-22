import React = require('react');

var template = function (data: any) {
	return (<tr onClick={(e) => this.onClick(e)}>
		<td>
			{data.getCompanyName()}
		</td>
		<td>
			{data.getAddress()}
		</td>
	</tr>);
};

export = template;