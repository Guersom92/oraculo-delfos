import type { AppState } from "../types/stateType";

export const STATE_IDS: Record<AppState, string> = {
  initial: 'state-initial',
  trance:  'oracle-trance',
  busy:    'oracle-busy',
  prophecy: 'state-prophecy',
};