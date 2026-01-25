/**
 * Behaviors Module
 * 
 * Exports behavior registry and utilities
 */

export {
  behaviorRegistry,
  setBehaviorContext,
  getBehaviorContext,
  registerBehavior,
  getAvailableBehaviors,
  hasBehavior,
  executeBehavior,
} from './behaviorRegistry';

export type { BehaviorFn } from './behaviorRegistry';
