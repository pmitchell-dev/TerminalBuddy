import { Injectable } from '@angular/core'
import { ToolbarButtonProvider, ToolbarButton } from 'tabby-core'
import { PanelService } from '../services/panel.service'

/**
 * Adds a ⚡ button to the Tabby toolbar that toggles the TerminalBuddy panel.
 *
 * Panel mounting is deferred lazily on user toggle or session context event
 * to keep Tabby startup fast and clean.
 */
@Injectable()
export class BuddyToolbarButtonProvider extends ToolbarButtonProvider {
  constructor (private panel: PanelService) {
    super()
  }

  provide (): ToolbarButton[] {
    return [{
      icon: '⚡',
      title: 'TerminalBuddy',
      weight: 10,
      click: () => {
        this.panel.toggle()
      },
    }]
  }
}
