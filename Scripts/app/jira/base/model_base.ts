/// <reference path="base.ts" />

import $ = require('jquery');
import Base = require('app/jira/base/base');
        
class ModelBase extends Base {
    constructor (opts) {
        super();
        
        this.init(opts);
    }
    
    init (opts) {
        super.init(opts);
    }
    
    triggerProperyChanged (propertyName) {
        //console.log('Model.trigger: ' + propertyName);
        $(this).trigger(propertyName);
    }
}
export = ModelBase;