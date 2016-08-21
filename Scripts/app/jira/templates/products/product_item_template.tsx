import React = require('react');

var template = function (data: any) {
	return (<tr onClick={(e) => this.onClick(e)}>
		<td>
			{data.getProductName()}
		</td>
		<td style={{width: "140px"}}>
			{data.getUnitPrice()}
		</td>
		<td style={{width: "140px"}}>{data.getQuantityPerUnit()}</td>
	</tr>);
};

export = template;