import React = require('react');

var template = function (data: any) {
	return (<tr onClick={(e) => this.onClick(e)}>
		<td>
			<div contentEditable="true"
			 onInput={(e) => this.updateCompanyName(e)}
			 >
			 {data.getCompanyName()}
			</div>
		</td>
		<td>
			<div contentEditable="true"
			 onInput={(e) => this.updateAddress(e)}
			 >
			{data.getAddress()}
			</div>
		</td>
		<td>
			<button className="btn btn-xs btn-info"
			 onClick={(e) => this.saveSupplier(e)}
			 >Apply</button>
		</td>
	</tr>);
};

export = template;