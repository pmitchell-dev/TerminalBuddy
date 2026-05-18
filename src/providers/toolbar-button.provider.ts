import { Injectable } from '@angular/core'
import { ToolbarButtonProvider, ToolbarButton, AppService } from 'tabby-core'
import { BuddyPanelComponent } from '../components/buddy-panel.component'

/**
 * Adds a ⚡ button to the Tabby toolbar that toggles the TerminalBuddy panel.
 */
@Injectable()
export class BuddyToolbarButtonProvider extends ToolbarButtonProvider {
  constructor (private app: AppService) {
    super()
  }

  provide (): ToolbarButton[] {
    return [{
      icon: require('../assets/icon.svg'),
      title: 'TerminalBuddy',
      weight: 10,
      click: () => {
        this.app.openNewTabWith({ type: 'app:terminal-buddy-panel' } as any)
      },
    }]
  }
}
