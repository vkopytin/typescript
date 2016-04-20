/// <reference path="../../../vendor.d.ts" />
/// <reference path="../base/base_view.ts" />
import _ = require('underscore');
import $ = require('jquery');
import BaseView = require('app/jira/base/base_view');
import template = require('hgn!app/jira/templates/filter_item_template');
import FilterItemTemplate = require('app/jira/templates/filter_item_template');
import ReactDOM = require('react-dom');

class FilterItemView extends BaseView {
    
    button () {
        return $('button', this.$el);
    }
    commands () {
        return {
            'click.command .status-name': 'SelectCommand'
        };
    }
    
    init (opts) {
        this.$el = $('<span />');
        super.init(opts);
        
        $(this.viewModel).on('change:selected', _.bind(this.onChangeSelected, this));
    }
    
    onChangeSelected () {
        var $el = this.button(),
            isSelected = !!this.viewModel.getSelected();
        
        $el.toggleClass('btn-primary', isSelected);
        $el.toggleClass('btn-default', !isSelected);
    }
    draw () {
        var data = this.viewModel.toJSON(),
            html = template(data);
            
        //var fit = new FilterItemTemplate(data);
        //ReactDOM.render(fit.render(), this.$el.get(0));
        this.$el.html(html);
        
        return this;
    }
}
export = FilterItemView;