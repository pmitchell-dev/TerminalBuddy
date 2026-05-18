import { Injectable } from '@angular/core'
import { SettingsTabProvider } from 'tabby-settings'
import { SettingsComponent } from '../components/settings.component'

/**
 * Registers TerminalBuddy as a settings tab in Tabby's Settings window.
 * Users access it via Settings → TerminalBuddy.
 */
@Injectable()
export class BuddySettingsTabProvider extends SettingsTabProvider {
  id = 'terminal-buddy'
  icon = '⚡'
  title = 'TerminalBuddy'
  component = SettingsComponent
}
