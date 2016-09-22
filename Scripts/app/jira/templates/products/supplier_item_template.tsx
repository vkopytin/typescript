import React = require('react');


var template = function (data: any) {
	return (<tr onClick={(e) => this.onClick(e)}>
		<td>
			<input className="form-control" type="text"
			 onChange={(e) => this.updateCompanyName(e)}
			 value={data.getCompanyName()}
			/>
		</td>
		<td>
			<input className="form-control" type="text"
			 onChange={(e) => this.updateAddress(e)}
			 value={data.getAddress()}
			/>
		</td>
		<td>
			<button className="btn btn-xs btn-info"
			 onClick={(e) => this.saveSupplier(e)}
			 >Apply</button>
		</td>
	</tr>);
};

export = template;