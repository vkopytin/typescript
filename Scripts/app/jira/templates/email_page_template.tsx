import React = require('react');
import EmailView = require('app/jira/views/email_view');
import EmailViewModel = require('app/jira/view_models/email_view_model');

var template = function (viewModel: any) {
	return (
		<EmailView viewModel={viewModel}>
		</EmailView>
	);
};

export = template;