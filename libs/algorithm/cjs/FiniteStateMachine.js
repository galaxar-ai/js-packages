"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
const _utils = require("@galaxar/utils");
const _types = require("@galaxar/types");
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
/**
 *
 * Action rule:
 *  desc: description of this transition
 *  when: pre transition condition check
 *  target: target state
 *  before: transforming before applying to the state
 *  after: trigger another action after transition
 */ class FiniteStateMachine {
    /**
     * Get a list of allowed actions based on the current state.
     * @param {*} context
     * @param {boolean} withDisallowedReason
     */ async getAllowedActions_(context, withDisallowedReason) {
        const currentState = await this.stateFetcher_(this.app, context);
        // from state
        const transitions = this.transitions[currentState];
        if (!transitions) {
            throw new _types.InvalidArgument(`State "${currentState}" rules not found in the transition table.`);
        }
        const allowed = [];
        const disallowed = [];
        await (0, _utils.eachAsync_)(transitions, async (rule, action)=>{
            const [actionAllowed, disallowedReason] = rule.when && await rule.when(this.app, context) || FiniteStateMachine.OK;
            if (actionAllowed) {
                allowed.push({
                    action,
                    desc: rule.desc,
                    targetState: rule.target
                });
            } else if (withDisallowedReason) {
                disallowed.push({
                    action,
                    desc: rule.desc,
                    targetState: rule.target,
                    reason: disallowedReason
                });
            }
        });
        const ret = {
            allowed
        };
        if (withDisallowedReason) {
            ret.disallowed = disallowed;
        }
        return ret;
    }
    /**
     * Perform the specified action.
     * @param {*} action
     * @param {*} context
     * @param {*} payload
     * @param {*} updateOpts
     * @param {*} connOpts
     */ async performAction_(action, context, payload, updateOpts, connOpts) {
        const currentState = await this.stateFetcher_(this.app, context, connOpts);
        const transitions = this.transitions[currentState];
        if (!transitions) {
            throw new _types.InvalidArgument(`State "${currentState}" rules not found in the transition table.`);
        }
        const rule = transitions && transitions[action];
        if (!rule) {
            throw new _types.Forbidden(`Action "${action}" is not allowed in "${currentState}" state.`);
        }
        if (rule.when) {
            const [allowed, disallowedReason] = await rule.when(this.app, context);
            if (!allowed) {
                throw new _types.Forbidden(disallowedReason || `The current state does not meet the requirements of "${action}" action.`);
            }
        }
        const entityUpdate = rule.before && await rule.before(this.app, context, payload) || {
            ...payload
        };
        const [actuallyUpdated, updateResult] = await this.stateUpdater_(this.app, context, entityUpdate, rule.target, updateOpts, connOpts);
        if (actuallyUpdated && rule.after) {
            await rule.after(this.app, context, connOpts);
        }
        return updateResult;
    }
    constructor(app, transitionTable, stateFetcher, stateUpdater){
        this.app = app;
        this.transitions = transitionTable;
        this.stateFetcher_ = stateFetcher;
        this.stateUpdater_ = stateUpdater;
    }
}
_define_property(FiniteStateMachine, "OK", [
    true
]);
_define_property(FiniteStateMachine, "fail", (reason)=>[
        false,
        reason
    ]);
_define_property(FiniteStateMachine, "triggerAll_", (array)=>(...args)=>(0, _utils.eachAsync_)(array, (action_)=>action_(...args)));
_define_property(FiniteStateMachine, "ifAny", (array)=>async (...args)=>{
        const l = array.length;
        const reason = [];
        for(let i = 0; i < l; i++){
            const checker_ = array[i];
            const [allowed, disallowedReason] = await checker_(...args);
            if (allowed) {
                return FiniteStateMachine.OK;
            }
            reason.push(disallowedReason);
        }
        return FiniteStateMachine.fail('None of the required conditions met.\n' + reason.join('\n'));
    });
_define_property(FiniteStateMachine, "ifAll", (array)=>async (...args)=>{
        const l = array.length;
        for(let i = 0; i < l; i++){
            const checker_ = array[i];
            const [allowed, disallowedReason] = await checker_(...args);
            if (!allowed) {
                return FiniteStateMachine.fail(disallowedReason);
            }
        }
        return FiniteStateMachine.OK;
    });
const _default = FiniteStateMachine;

//# sourceMappingURL=FiniteStateMachine.js.map