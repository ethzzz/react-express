import * as msModule from '../framework/ms'

(global as any).ms = msModule

export const ms = (msModule as typeof msModule)