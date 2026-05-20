import { Component, OnInit, OnDestroy, ElementRef } from '@angular/core'
import { Subscription } from 'rxjs'
import { ContextService, BuddyContext } from '../services/context.service'
import { CheatsheetService } from '../services/cheatsheet.service'
import { CheatSheet } from '../data/cheatsheet.model'

@Component({
  selector: 'terminal-buddy-panel',
  template: require('./buddy-panel.component.html'),
  styles: [require('./buddy-panel.component.scss')],
})
export class BuddyPanelComponent implements OnInit, OnDestroy {
  context: BuddyContext = { type: 'idle' }
  activeSheet: CheatSheet | null = null
  isVisible = true
  isResizing = false

  private sub?: Subscription

  constructor (
    private el: ElementRef,
    private contextService: ContextService,
    private cheatsheetService: CheatsheetService,
  ) {}

  onResizeStart (event: MouseEvent): void {
    event.preventDefault()
    this.isResizing = true

    // The host element (terminal-buddy-panel) is the one that has fixed layout styles
    const hostEl = this.el.nativeElement as HTMLElement
    const startWidth = hostEl.getBoundingClientRect().width
    const startX = event.clientX

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const newWidth = Math.max(200, Math.min(1000, startWidth - deltaX))
      hostEl.style.width = `${newWidth}px`
      localStorage.setItem('tb-panel-width', `${newWidth}`)
    }

    const onMouseUp = () => {
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
