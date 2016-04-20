/// <reference path="base.ts" />
import $ = require('jquery');
import Base = require('app/jira/base/base');

class ViewModelBase extends Base {
    opts: any
    navigation: ViewModelBase
    
    constructor (opts) {
        super();
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    }

    init (opts) {
        super.init(opts);
        
        this.opts = opts;
    }
    
    finish () {
        this.triggerProperyChanged('viewModel.finish');
        $(this).off();
        super.finish();
        //console.log('Removed: ' + this.constructor.name);
    }
    
    triggerProperyChanged (propertyName) {
        //console.log('ViewModel.trigger: ' + propertyName);
        $(this).trigger(propertyName);
    }
    navigateTo () {
        
    }
    navigateFrom () {
        this.finish();
    }
    toJSON () {
        return this.opts;
    }
}
export = ViewModelBase;