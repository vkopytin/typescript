/// <reference path="base.ts" />
import $ = require('jquery');
import Base = require('app/jira/base/base');

class ViewModelBase extends Base {
    opts: any
    navigation: ViewModelBase
    
    constructor (opts: any) {
        super();
        this.init(opts);
        //console.log('Created: ' + this.constructor.name)
    }

    init (opts: any): void {
        this.opts = opts;
    }
    
    finish (): void {
        this.triggerProperyChanged('viewModel.finish');
        $(this).off();
        super.finish();
        //console.log('Removed: ' + this.constructor.name);
    }
    
    triggerProperyChanged (propertyName: string): void {
        //console.log('ViewModel.trigger: ' + propertyName);
        $(this).trigger(propertyName);
    }
    navigateTo (): void {
        
    }
    navigateFrom (): void {
        this.finish();
    }
    toJSON (): any {
        return this.opts;
    }
}
export = ViewModelBase;