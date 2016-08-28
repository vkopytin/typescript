import React = require('react');

var template = function (data: any) {
	return (<tr onClick={(e) => this.onClick(e)}>
		<td>
			<div contentEditable="true"
			 onInput={(e) => this.updateCategoryName(e)}
			 >{data.getCategoryName()}</div>
		</td>
		<td>
			<div contentEditable="true"
			 onInput={(e) => this.updateDescription(e)}
			 >{data.getDescription()}</div>
		</td>
		<td>
			<button className="btn btn-xs btn-info"
			 onClick={(e) => this.saveCategory(e)}
			 >Apply</button>
		</td>
	</tr>);
};

export = template;