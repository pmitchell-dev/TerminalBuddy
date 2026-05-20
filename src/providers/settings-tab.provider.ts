import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'
import { SettingsComponent } from '../components/settings.component'

/**
 * Registers TerminalBuddy as a settings tab in Tabby's Settings window.
 * Users access it via Settings → TerminalBuddy.
 *
 * NOTE: The Tabby runtime calls getComponentType() and filters out providers
 * that return null (the base class default). A `component` property alone
 * is NOT enough — we MUST override getComponentType().
 */
@Injectable()
export class BuddySettingsTabProvider extends SettingsTabProvider {
  id = 'terminal-buddy'
  icon = '⚡'
  title = 'TerminalBuddy'

  getComponentType (): any {
    return SettingsComponent
  }
}
