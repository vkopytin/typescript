/// <reference path="base.ts" />

import $ = require('jquery');
import Base = require('app/jira/base/base');

  
class ModelBase extends Base {
    constructor (opts: any) {
        super();
        
        this.init(opts);
    }
    
    init (opts: any): void {
    }
    
    triggerProperyChanged (propertyName: string) {
        //console.log('Model.trigger: ' + propertyName);
        $(this).trigger(propertyName);
    }
}
export = ModelBase;