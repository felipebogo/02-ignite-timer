import { Cycle } from './reducer'

export enum ActionTypes {
  ADD_NEW_CYCLE = 'ADD_NEW_CYCLE',
  INTERRUPT_CURRENT_CYCLE = 'INTERRUPT_CURRENT_CYCLE',
  CLEAR_ACTIVE_CYCLE = 'CLEAR_ACTIVE_CYCLE',
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}

export interface ActionType {
  type: ActionTypes
  payload?: { newCycle: Cycle }
}

export function addNewCycleAction(newCycle: Cycle): ActionType {
  return {
    type: ActionTypes.ADD_NEW_CYCLE,
    payload: {
      newCycle,
    },
  }
}

export function markCurrentCycleAsFinishedAction(): ActionType {
  return {
    type: ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED,
  }
}

export function interruptCurrentCycleAction(): ActionType {
  return {
    type: ActionTypes.INTERRUPT_CURRENT_CYCLE,
  }
}

export function clearActiveCycleAction(): ActionType {
  return {
    type: ActionTypes.CLEAR_ACTIVE_CYCLE,
  }
}
