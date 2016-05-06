import React = require('react');
import JiraView = require('app/jira/views/jira_view');
import FilterView = require('app/jira/views/filter_view');
import PanelView = require('app/jira/views/panel_view');
import EpicsView = require('app/jira/views/epics_view');
import JiraViewModel = require('app/jira/view_models/jira_view_model');

var template = function (viewModel: any) {
	return (
		<JiraView viewModel={viewModel} issues={(vm: JiraViewModel) => vm.getIssues()}>
			<FilterView ref="filterStatuses" viewModel={viewModel} statuses={(vm: JiraViewModel) => vm.getStatuses()}
			 />
			<PanelView ref="epicsPanel" viewModel={viewModel} title={"Filter by Epic"}>
				<EpicsView ref="filterEpics" viewModel={viewModel} epics={(vm: JiraViewModel) => vm.getEpics()}
				 />
			</PanelView>
		</JiraView>
	);
};

export = template;