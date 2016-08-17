import React = require('react');

var template = function (data: any) {
	return (<tr>
		<td style={{width: "140px"}}>
			{data.id}
		</td>
		<td>
			{data.user}
		</td>
		<td>{data.Description}</td>
	</tr>);
};

export = template;