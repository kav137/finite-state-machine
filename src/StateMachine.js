import State from './State';

class StateMachine {
	constructor() {
		this.activeStateId = null;
		this.states = new Map();
	}

	createState(stateId) {
		const state = new State();
		this.states.set(stateId, state);

		return state;
	}

	onTransition(oldStateId, newStateId, callback) {
		const oldState = this.states.get(oldStateId);
		const newState = this.states.get(newStateId);

		callback(oldStateId, newStateId, oldState.data, newState.data);
	}

	addTransition(initialStateId, targetStateId, trigger, action, reaction) {
		const thisStateMachine = this;
		const initialState = this.states.get(initialStateId);

		const transitionFunction = async () => {
			const outboundData = await trigger(initialState.data);
			const inboundData = await action(outboundData);

			// error state

			const newActiveState = thisStateMachine.activate(
				targetStateId,
				inboundData
			);

			reaction(
				initialStateId,
				targetStateId,
				initialState.data,
				newActiveState.data
			);
			return newActiveState; // do we need to return?
		};
		initialState.addTransition(transitionFunction);
	}

	activateState(targetStateId, inboundData = null) {
		const targetState = this.states.get(targetStateId);
		this.activeStateId = targetStateId;
		targetState.setData(inboundData);

		return targetState;
	}
}

export default StateMachine;
