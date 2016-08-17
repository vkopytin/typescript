import React = require('react');

var template = function (data: any) {
	return (<tr>
		<td style={{width: "140px"}}>
			<img src={data.fields.priority.iconUrl} title={data.fields.priority.name} style={{width: "16px", height: "16px"}}/>
			{data.fields.priority.name}
		</td>
		<td>
			<div>{data.Key}: {data.fields.summary}</div>
			<div>{data.fields.status.name}</div>
		</td>
		<td></td>
		<td style={{width: "140px", textAlign: "center"}}>{data.updated()}</td>
		<td style={{minWidth: "140px"}}>{data.fields.assignee && data.fields.assignee.displayName}</td>
	</tr>);
};

export = template;