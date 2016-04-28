import React = require('react');
import FilterEntryViewModel = require('app/jira/view_models/filter_entry_view_model');
import FilterItemView = require('app/jira/views/filter_item_view');

interface IFilterItemView<TViewModel extends FilterEntryViewModel> {
    new(opts: any): FilterItemView<TViewModel>;
}

let StatusFilterItemView: IFilterItemView<FilterEntryViewModel> = FilterItemView;

var template = function () {
	return (<div>
        {this.state.items.map((entry: FilterEntryViewModel) => 
            <StatusFilterItemView viewModel={entry} key={entry.getId()}/>
        )}
        </div>);
};
export = template;