import React = require('react');
import IssueView = require('app/jira/views/issues/issue_view');

var template = function () {
	return (<table className={"table table-hover"}>
        <thead>
            <tr>
                <th>Priority</th>
                <th><div>Key: Summary</div><div>Status</div></th>
                <th>X</th>
                <th>Updated</th>
                <th>Assignee</th>
            </tr>
        </thead>
		<tbody className={"issues-list"}>
	        {this.state.issues && this.state.issues.map((entity: any) => <IssueView viewModel={entity} key={entity.getId()}/>)}
		</tbody>
    </table>);
};

export = template;