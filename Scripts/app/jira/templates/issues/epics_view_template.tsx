import React = require('react');
import EpicsEntryViewModel = require('app/jira/view_models/issues/filter_epic_view_model');
import FilterItemView = require('app/jira/views/issues/filter_item_view');

interface IFilterItemView<TViewModel extends EpicsEntryViewModel> {
    new(opts: any): FilterItemView<TViewModel>;
}

let EpicFilterItemView: IFilterItemView<EpicsEntryViewModel> = FilterItemView;

var template = function () {
	return (<div className={"filter-epics highlight"}>
        {this.state.items.map((entry: EpicsEntryViewModel) => 
            <EpicFilterItemView viewModel={entry} key={entry.getId()}/>
        )}
        </div>);
};
export = template;