import React = require('react');
import JiraView = require('app/jira/views/issues/jira_view');
import FilterView = require('app/jira/views/issues/filter_view');
import PanelView = require('app/jira/ui_controls/panel_view');
import EpicsView = require('app/jira/views/issues/epics_view');
import JiraViewModel = require('app/jira/view_models/issues/jira_view_model');

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