// Plugin entry point — Tabby imports this first.
// zone.js and reflect-metadata are already provided by Tabby's Electron runtime.
// Do NOT import them here — doing so creates two Angular instances and breaks module loading.
// Tabby plugin loader does: packageModule.default.forRoot?.() ?? packageModule.default
// so we MUST have a default export.
export { TerminalBuddyModule } from './module'
export { TerminalBuddyModule as default } from './module'

