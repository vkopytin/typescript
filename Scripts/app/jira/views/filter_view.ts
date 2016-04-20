/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
/// <reference path="filter_item_view.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import FilterItemView = require('app/jira/views/filter_item_view');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import FilterEntryViewMode = require('app/jira/view_models/filter_entry_view_model');

class FilterView extends BaseView<JiraViewModel> {
    views: FilterItemView<FilterEntryViewMode>[] = []
    
    setItems (items) {
        this.views = [];
        _.each(items, (item) => {
            var view = new FilterItemView<FilterEntryViewMode>({
                viewModel: item
            });
            this.views.push(view);
        }, this);
        
        this.drawItems();
    }
    filterStatuses () {
        return $('.filter-statuses', this.$el);
    }
    
    init (opts) {
        this.$el = opts.el ? $(opts.el) : $('<div/>');
        super.init(opts);
        this.views = [];
        this.setItems(this.viewModel.getFilterItems());
    }
    
    drawItem (itemView: FilterItemView<FilterEntryViewMode>) {
        itemView.appendTo(this.filterStatuses()).draw();
    }
    drawItems () {
        _.each(this.views, this.drawItem, this);
    }
    draw () {
        this.drawItems();
        
        return this;
    }
}
export = FilterView;