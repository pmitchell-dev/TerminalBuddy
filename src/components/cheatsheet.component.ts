import { Component, Input, ViewEncapsulation } from '@angular/core'
import { CheatSheet } from '../data/cheatsheet.model'

@Component({
  selector: 'terminal-buddy-cheatsheet',
  template: require('./cheatsheet.component.html'),
  styles: [require('./cheatsheet.component.scss')],
  encapsulation: ViewEncapsulation.None,
})
export class CheatsheetComponent {
  @Input() sheet!: CheatSheet
}

