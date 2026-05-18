import { Injectable } from '@angular/core'
import { ConfigProvider } from 'tabby-core'

/**
 * Registers TerminalBuddy's default config schema with Tabby's ConfigService.
 * This ensures the config key always exists with safe defaults.
 */
@Injectable()
export class BuddyConfigProvider extends ConfigProvider {
  defaults = {
    terminalBuddy: {
      customSheets: [],
    },
  }

  platformDefaults = {}
}
