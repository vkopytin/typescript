import React = require('react');


var template = function (data: any) {
	return (<tr onClick={(e) => this.onClick(e)}>
		<td>
			<input className="form-control" type="text"
			 onChange={(e) => this.updateCategoryName(e)}
			 value={data.getCategoryName()}/>
		</td>
		<td>
			<input className="form-control" type="text"
			 onChange={(e) => this.updateDescription(e)}
			 value={data.getDescription()}/>
		</td>
		<td>
			<button className="btn btn-xs btn-info"
			 onClick={(e) => this.saveCategory(e)}
			 >Apply</button>
		</td>
	</tr>);
};

export = template;