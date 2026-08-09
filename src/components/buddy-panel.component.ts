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
  copiedInstallCmd = false

  private sub?: Subscription

  constructor (
    private el: ElementRef,
    private contextService: ContextService,
    private cheatsheetService: CheatsheetService,
    private zone: NgZone,
  ) {}

  copyInstallCommand (): void {
    const cmd = 'curl -sSL https://raw.githubusercontent.com/pmitchell-dev/TerminalBuddy/main/shell-integration/install.sh | bash'
    if (navigator.clipboard) {
      navigator.clipboard.writeText(cmd).then(() => {
        this.zone.run(() => {
          this.copiedInstallCmd = true
          setTimeout(() => {
            this.copiedInstallCmd = false
          }, 2000)
        })
      }).catch(() => {})
    }
  }

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
        const savedWidth = parseInt(localStorage.getItem('tb-panel-width') || '320')
        this.updateSizeClass(savedWidth)
      } catch (err) {
        // Keep silent on minor init errors
      }
    }, 1000)
  }

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

      this.zone.run(() => {
        this.updateSizeClass(newWidth)
      })
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

  close (): void {
    this.isVisible = false
    const hostEl = this.el.nativeElement as HTMLElement
    hostEl.style.display = 'none'
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
