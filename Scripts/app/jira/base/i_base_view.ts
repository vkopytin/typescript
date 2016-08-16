import React = require('react');
import BaseViewModel = require('app/jira/base/base_view_model');


interface IBaseView extends React.Props<any> {
    viewModel: BaseViewModel
}

export = IBaseView;