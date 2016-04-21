import Base = require('app/jira/base/base');

class Command extends Base {
    handler: any
    scope: any
    
    constructor (opts: any) {
        super();
        this.init(opts);
    }

    init (opts: any): void {
        this.handler = opts.execute;
        this.scope = opts.scope || this;
    }
    execute () {
        this.handler.apply(this.scope, arguments);
    }
}

export = Command;