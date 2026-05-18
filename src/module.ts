import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'

import { ToolbarButtonProvider, ConfigProvider, TabContextMenuItemProvider } from 'tabby-core'
import { SettingsTabProvider } from 'tabby-settings'

import { BuddyPanelComponent } from './components/buddy-panel.component'
import { CheatsheetComponent } from './components/cheatsheet.component'
import { DashboardComponent } from './components/dashboard.component'
import { SettingsComponent } from './components/settings.component'

import { ContextService } from './services/context.service'
import { CheatsheetService } from './services/cheatsheet.service'
import { BuddyToolbarButtonProvider } from './providers/toolbar-button.provider'
import { BuddyConfigProvider } from './providers/config.provider'
import { BuddySettingsTabProvider } from './providers/settings-tab.provider'

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [
    BuddyPanelComponent,
    CheatsheetComponent,
    DashboardComponent,
    SettingsComponent,
  ],
  providers: [
    ContextService,
    CheatsheetService,
    { provide: ToolbarButtonProvider, useClass: BuddyToolbarButtonProvider, multi: true },
    { provide: ConfigProvider, useClass: BuddyConfigProvider, multi: true },
    { provide: SettingsTabProvider, useClass: BuddySettingsTabProvider, multi: true },
  ],
  entryComponents: [
    BuddyPanelComponent,
    SettingsComponent,
  ],
})
export class TerminalBuddyModule {}
