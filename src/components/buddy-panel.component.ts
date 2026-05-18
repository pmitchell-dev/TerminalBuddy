import { Component, OnInit, OnDestroy } from '@angular/core'
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

  private sub?: Subscription

  constructor (
    private contextService: ContextService,
    private cheatsheetService: CheatsheetService,
  ) {}

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
