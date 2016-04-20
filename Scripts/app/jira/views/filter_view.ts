/// <reference path="../base/base_view.ts" />
/// <reference path="filter_item_view.ts" />

import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import FilterItemView = require('app/jira/views/filter_item_view');

class FilterView extends BaseView {
    views = []
    
    setItems (items) {
        this.views = [];
        _.each(items, (item) => {
            var view = new FilterItemView({
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
    
    drawItem (itemView) {
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