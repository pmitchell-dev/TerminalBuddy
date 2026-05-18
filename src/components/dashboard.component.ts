import { Component } from '@angular/core'

// Stub for dashboard component — content is rendered in buddy-panel via *ngIf
// This file exists as a placeholder for future standalone dashboard features.
@Component({
  selector: 'terminal-buddy-dashboard',
  template: `<pre class="tb-dashboard-content">{{ content }}</pre>`,
  styles: ['.tb-dashboard-content { white-space: pre-wrap; font-family: monospace; font-size: 11px; padding: 8px; margin: 0; }'],
})
export class DashboardComponent {
  content = ''
}
