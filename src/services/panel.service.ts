import {
  Injectable,
  ComponentFactoryResolver,
  ApplicationRef,
  Injector,
  ComponentRef,
  NgZone,
} from '@angular/core'
import { BuddyPanelComponent } from '../components/buddy-panel.component'

/**
 * PanelService
 *
 * Bootstraps the BuddyPanelComponent into the live DOM.
 * The panel is positioned as a fixed right-side drawer using CSS,
 * so it overlays on top of Tabby's content without needing to inject
 * into the exact DOM hierarchy.
 *
 * mount() is called from the toolbar button provider constructor —
 * that constructor runs early because ToolbarButtonProvider is a
 * registered multi-provider that Tabby iterates at startup.
 */
@Injectable({ providedIn: 'root' })
export class PanelService {
  private panelRef: ComponentRef<BuddyPanelComponent> | null = null

  constructor (
    private resolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    private zone: NgZone,
  ) {}

  /** Mount the panel into the DOM. Safe to call multiple times. */
  mount (): void {
    if (this.panelRef) return

    console.log('[TerminalBuddy] PanelService.mount() called')

    try {
      const factory = this.resolver.resolveComponentFactory(BuddyPanelComponent)
      this.panelRef = factory.create(this.injector)

      // Attach to Angular's change detection tree
      this.appRef.attachView(this.panelRef.hostView)

      const domElem = (this.panelRef.hostView as any).rootNodes[0] as HTMLElement

      // Apply positioning styles DIRECTLY to the host element.
      // Angular's :host { position: fixed } in component SCSS is not reliable
      // for dynamically-created components — the scoped style may not apply.
      // Inline styles guarantee the panel is visible regardless.
      const savedWidth = localStorage.getItem('tb-panel-width') || '320'

      domElem.style.cssText = [
        'position: fixed',
        'top: 38px',
        'right: 0',
        `width: ${savedWidth}px`,
        'height: calc(100vh - 38px)',
        'z-index: 9999',
        'display: flex',
        'flex-direction: column',
        'overflow: hidden',
        'background: var(--theme-bg-more-2, #181825)',
        'border-left: 1px solid rgba(255,255,255,0.1)',
        'box-shadow: -4px 0 20px rgba(0,0,0,0.5)',
        'color: var(--body-color, #cdd6f4)',
        'font-family: "JetBrains Mono", "Fira Code", monospace',
        'font-size: 12px',
      ].join(';')


      document.body.appendChild(domElem)

      console.log('[TerminalBuddy] Panel mounted into DOM', domElem)
    } catch (e) {
      console.error('[TerminalBuddy] Panel mount failed:', e)
    }
  }


  /** Toggle the panel's visible state */
  toggle (): void {
    if (!this.panelRef) this.mount()
    if (!this.panelRef) return

    this.zone.run(() => {
      const instance = this.panelRef!.instance
      instance.isVisible = !instance.isVisible
      const domElem = (this.panelRef!.hostView as any).rootNodes[0] as HTMLElement
      domElem.style.display = instance.isVisible ? 'flex' : 'none'
      console.log('[TerminalBuddy] Panel toggled, isVisible=', instance.isVisible)
    })
  }

  /** Show the panel */
  show (): void {
    if (!this.panelRef) this.mount()
    if (!this.panelRef) return
    this.zone.run(() => {
      this.panelRef!.instance.isVisible = true
      const domElem = (this.panelRef!.hostView as any).rootNodes[0] as HTMLElement
      domElem.style.display = 'flex'
    })
  }

  /** Hide the panel */
  hide (): void {
    if (this.panelRef) {
      this.zone.run(() => {
        this.panelRef!.instance.isVisible = false
        const domElem = (this.panelRef!.hostView as any).rootNodes[0] as HTMLElement
        domElem.style.display = 'none'
      })
    }
  }
}

