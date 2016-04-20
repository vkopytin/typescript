/// <reference path="../base/base_view.ts" />
/// <reference path="filter_item_view.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import FilterItemView = require('app/jira/views/filter_item_view');
import JiraViewModel = require('app/jira/view_models/jira_view_model');
import EpicsEntryViewModel = require('app/jira/view_models/filter_epic_view_model');

class EpicsView extends BaseView<JiraViewModel> {
    views: FilterItemView<EpicsEntryViewModel>[] = []
    
    setItems (items: EpicsEntryViewModel[]) {
        this.views = [];
        _.each(items, (item) => {
            var view = new FilterItemView<EpicsEntryViewModel>({
                viewModel: item
            });
            this.views.push(view);
        }, this);
        
        this.drawItems();
    }
    filterEpics () {
        return $('.filter-epics', this.$el);
    }
    init (opts) {
        this.$el = opts.el ? $(opts.el) : $('<div/>');
        super.init(opts);
        this.views = [];
        this.setItems(this.viewModel.getEpics());
    }
    drawItem (itemView : FilterItemView<EpicsEntryViewModel>) {
        itemView.appendTo(this.filterEpics()).draw();
    }
    drawItems () {
        _.each(this.views, this.drawItem, this);
    }
    draw () {
        this.drawItems();
        
        return this;
    }
}
export = EpicsView;