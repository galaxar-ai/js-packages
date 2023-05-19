import { eachAsync_ } from '@galaxar/utils';
import { InvalidArgument, Forbidden } from '@galaxar/types';

/**
 *
 * Action rule:
 *  desc: description of this transition
 *  when: pre transition condition check
 *  target: target state
 *  before: transforming before applying to the state
 *  after: trigger another action after transition
 */

class FiniteStateMachine {
    static OK = [true];
    static fail = (reason) => [false, reason];
    static triggerAll_ =
        (array) =>
        (...args) =>
            eachAsync_(array, (action_) => action_(...args));

    static ifAny =
        (array) =>
        async (...args) => {
            const l = array.length;
            const reason = [];

            for (let i = 0; i < l; i++) {
                const checker_ = array[i];

                const [allowed, disallowedReason] = await checker_(...args);
                if (allowed) {
                    return FiniteStateMachine.OK;
                }

                reason.push(disallowedReason);
            }

            return FiniteStateMachine.fail('None of the required conditions met.\n' + reason.join('\n'));
        };

    static ifAll =
        (array) =>
        async (...args) => {
            const l = array.length;

            for (let i = 0; i < l; i++) {
                const checker_ = array[i];

                const [allowed, disallowedReason] = await checker_(...args);
                if (!allowed) {
                    return FiniteStateMachine.fail(disallowedReason);
                }
            }

            return FiniteStateMachine.OK;
        };

    constructor(app, transitionTable, stateFetcher, stateUpdater) {
        this.app = app;

        this.transitions = transitionTable;
        this.stateFetcher_ = stateFetcher;
        this.stateUpdater_ = stateUpdater;
    }

    /**
     * Get a list of allowed actions based on the current state.
     * @param {*} context
     * @param {boolean} withDisallowedReason
     */
    async getAllowedActions_(context, withDisallowedReason) {
        const currentState = await this.stateFetcher_(this.app, context);

        // from state
        const transitions = this.transitions[currentState];
        if (!transitions) {
            throw new InvalidArgument(`State "${currentState}" rules not found in the transition table.`);
        }

        const allowed = [];
        const disallowed = [];

        await eachAsync_(transitions, async (rule, action) => {
            const [actionAllowed, disallowedReason] =
                (rule.when && (await rule.when(this.app, context))) || FiniteStateMachine.OK;

            if (actionAllowed) {
                allowed.push({
                    action,
                    desc: rule.desc,
                    targetState: rule.target,
                });
            } else if (withDisallowedReason) {
                disallowed.push({
                    action,
                    desc: rule.desc,
                    targetState: rule.target,
                    reason: disallowedReason,
                });
            }
        });

        const ret = {
            allowed,
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
     */
    async performAction_(action, context, payload, updateOpts, connOpts) {
        const currentState = await this.stateFetcher_(this.app, context, connOpts);

        const transitions = this.transitions[currentState];
        if (!transitions) {
            throw new InvalidArgument(`State "${currentState}" rules not found in the transition table.`);
        }

        const rule = transitions && transitions[action];
        if (!rule) {
            throw new Forbidden(`Action "${action}" is not allowed in "${currentState}" state.`);
        }

        if (rule.when) {
            const [allowed, disallowedReason] = await rule.when(this.app, context);
            if (!allowed) {
                throw new Forbidden(
                    disallowedReason || `The current state does not meet the requirements of "${action}" action.`
                );
            }
        }

        const entityUpdate = (rule.before && (await rule.before(this.app, context, payload))) || { ...payload };
        const [actuallyUpdated, updateResult] = await this.stateUpdater_(
            this.app,
            context,
            entityUpdate,
            rule.target,
            updateOpts,
            connOpts
        );

        if (actuallyUpdated && rule.after) {
            await rule.after(this.app, context, connOpts);
        }

        return updateResult;
    }
}

export default FiniteStateMachine;
