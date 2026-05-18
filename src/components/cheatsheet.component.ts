import { Component, Input } from '@angular/core'
import { CheatSheet } from '../data/cheatsheet.model'

@Component({
  selector: 'terminal-buddy-cheatsheet',
  template: require('./cheatsheet.component.html'),
  styles: [require('./cheatsheet.component.scss')],
})
export class CheatsheetComponent {
  @Input() sheet!: CheatSheet
}
