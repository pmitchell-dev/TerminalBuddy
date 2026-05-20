import { Injectable } from '@angular/core'
import { ToolbarButtonProvider, ToolbarButton } from 'tabby-core'
import { PanelService } from '../services/panel.service'

/**
 * Adds a ⚡ button to the Tabby toolbar that toggles the TerminalBuddy panel.
 *
 * The constructor is called early by Tabby's DI system (ToolbarButtonProvider
 * is a registered multi-provider that gets instantiated at startup). We use
 * this as a reliable hook to mount the panel into the DOM — more reliable
 * than APP_INITIALIZER which may not fire for dynamically-loaded plugin modules.
 */
@Injectable()
export class BuddyToolbarButtonProvider extends ToolbarButtonProvider {
  constructor (private panel: PanelService) {
    super()
    // Mount the panel now — the toolbar provider is instantiated early and
    // reliably by Tabby, making this the best place to trigger panel init.
    // PanelService.mount() has a guard so multiple calls are safe.
    setTimeout(() => {
      console.log('[TerminalBuddy] Toolbar provider init — mounting panel')
      this.panel.mount()
    }, 500)
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
