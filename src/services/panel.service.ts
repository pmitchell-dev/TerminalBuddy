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
 * Bootstraps the BuddyPanelComponent into the live DOM on demand.
 * The panel is positioned as an overlay drawer that stays hidden until toggled,
 * preventing layout interference with Tabby's startup window or grid containers.
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

  /** Mount the panel into the DOM on demand. Safe to call multiple times. */
  mount (): void {
    if (this.panelRef) return

    try {
      const factory = this.resolver.resolveComponentFactory(BuddyPanelComponent)
      this.panelRef = factory.create(this.injector)

      // Attach to Angular's change detection tree
      this.appRef.attachView(this.panelRef.hostView)

      const domElem = (this.panelRef.hostView as any).rootNodes[0] as HTMLElement
      const savedWidth = localStorage.getItem('tb-panel-width') || '320'

      // Apply fixed overlay positioning styles directly.
      // Default to display: none and pointer-events: none when mounted
      // so it never interferes with Tabby's startup or tab layouts.
      domElem.style.cssText = [
        'position: fixed',
        'top: 38px',
        'right: 0',
        `width: ${savedWidth}px`,
        'height: calc(100vh - 38px)',
        'z-index: 99999',
        'display: none',
        'flex-direction: column',
        'background: var(--theme-bg-more-2, #181825)',
        'border-left: 1px solid rgba(255,255,255,0.1)',
        'box-shadow: -4px 0 20px rgba(0,0,0,0.5)',
        'color: var(--body-color, #cdd6f4)',
        'font-family: "JetBrains Mono", "Fira Code", monospace',
        'font-size: 12px',
        'pointer-events: none',
      ].join(';')

      document.body.appendChild(domElem)
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
      domElem.style.pointerEvents = instance.isVisible ? 'auto' : 'none'
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
      domElem.style.pointerEvents = 'auto'
    })
  }

  /** Hide the panel */
  hide (): void {
    if (this.panelRef) {
      this.zone.run(() => {
        this.panelRef!.instance.isVisible = false
        const domElem = (this.panelRef!.hostView as any).rootNodes[0] as HTMLElement
        domElem.style.display = 'none'
        domElem.style.pointerEvents = 'none'
      })
    }
  }
}
