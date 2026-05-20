import { Component, OnInit, OnDestroy, ElementRef, AfterViewInit, ViewEncapsulation, NgZone } from '@angular/core'
import { Subscription } from 'rxjs'
import { ContextService, BuddyContext } from '../services/context.service'
import { CheatsheetService } from '../services/cheatsheet.service'
import { CheatSheet } from '../data/cheatsheet.model'

@Component({
  selector: 'terminal-buddy-panel',
  template: require('./buddy-panel.component.html'),
  styles: [require('./buddy-panel.component.scss')],
  encapsulation: ViewEncapsulation.None,
})
export class BuddyPanelComponent implements OnInit, OnDestroy, AfterViewInit {
  context: BuddyContext = { type: 'idle' }
  activeSheet: CheatSheet | null = null
  isVisible = true
  isResizing = false
  currentSizeClass = 'tb-size-medium'

  private sub?: Subscription

  constructor (
    private el: ElementRef,
    private contextService: ContextService,
    private cheatsheetService: CheatsheetService,
    private zone: NgZone,
  ) {}

  updateSizeClass (width: number): void {
    if (width < 300) {
      this.currentSizeClass = 'tb-size-narrow'
    } else if (width < 500) {
      this.currentSizeClass = 'tb-size-medium'
    } else {
      this.currentSizeClass = 'tb-size-wide'
    }
  }

  ngAfterViewInit (): void {
    setTimeout(() => {
      try {
        const hostEl = this.el.nativeElement as HTMLElement
        const savedWidth = parseInt(localStorage.getItem('tb-panel-width') || '320')
        this.updateSizeClass(savedWidth)

        const resEl = hostEl.querySelector('.tb-resizer') as HTMLElement
        if (resEl) {
          console.log('[TerminalBuddy] Resizer bounding box:', resEl.getBoundingClientRect())
          console.log('[TerminalBuddy] Host bounding box:', hostEl.getBoundingClientRect())
          const computedStyle = window.getComputedStyle(resEl)
          console.log('[TerminalBuddy] Resizer computed styles - position:', computedStyle.position, 'z-index:', computedStyle.zIndex, 'left:', computedStyle.left, 'width:', computedStyle.width, 'height:', computedStyle.height)
        } else {
          console.error('[TerminalBuddy] Resizer element not found in DOM!')
        }
      } catch (err) {
        console.error('[TerminalBuddy] Error in ngAfterViewInit:', err)
      }
    }, 1000)
  }

  onResizeStart (event: MouseEvent): void {
    console.log('[TerminalBuddy] onResizeStart triggered', event)
    event.preventDefault()
    this.isResizing = true

    // The host element (terminal-buddy-panel) is the one that has fixed layout styles
    const hostEl = this.el.nativeElement as HTMLElement
    const startWidth = hostEl.getBoundingClientRect().width
    const startX = event.clientX
    console.log('[TerminalBuddy] startWidth:', startWidth, 'startX:', startX)

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const newWidth = Math.max(200, Math.min(1000, startWidth - deltaX))
      console.log('[TerminalBuddy] Dragging. deltaX:', deltaX, 'newWidth:', newWidth)
      hostEl.style.width = `${newWidth}px`
      localStorage.setItem('tb-panel-width', `${newWidth}`)

      this.zone.run(() => {
        this.updateSizeClass(newWidth)
      })
    }

    const onMouseUp = () => {
      console.log('[TerminalBuddy] Dragging complete. Final width:', hostEl.style.width)
      this.isResizing = false
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', onMouseUp)
  }




  ngOnInit (): void {
    this.sub = this.contextService.context$.subscribe(ctx => {
      this.context = ctx
      if (ctx.type === 'cheatsheet') {
        this.activeSheet = this.cheatsheetService.getSheet(ctx.cmd)
      } else {
        this.activeSheet = null
      }
    })
  }

  ngOnDestroy (): void {
    this.sub?.unsubscribe()
  }

  toggleVisibility (): void {
    this.isVisible = !this.isVisible
  }

  get currentCwd (): string {
    return this.context.type === 'dashboard' ? this.context.cwd : ''
  }

  get dashboardContent (): string {
    return this.context.type === 'dashboard' ? this.context.content : ''
  }

  get unknownCmd (): string {
    if (this.context.type === 'cheatsheet' && !this.activeSheet) {
      return this.context.cmd
    }
    return ''
  }
}
