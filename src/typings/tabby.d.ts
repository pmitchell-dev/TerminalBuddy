// Type stubs for tabby-core and tabby-settings.
// These are the minimal type declarations needed for TypeScript compilation.
// The actual implementations are provided at runtime by Tabby itself.
//
// IMPORTANT: These must match the REAL runtime, not just what makes TS happy.
// Verified against C:\Program Files\Tabby\resources\builtin-plugins\tabby-*/dist/index.js

declare module 'tabby-core' {
  import { InjectionToken, Type } from '@angular/core'
  import { Observable, Subject } from 'rxjs'

  export abstract class ToolbarButtonProvider {
    abstract provide(): ToolbarButton[]
  }

  export interface ToolbarButton {
    icon?: string
    title: string
    weight?: number
    click: () => void
  }

  export abstract class ConfigProvider {
    abstract defaults: Record<string, any>
    abstract platformDefaults: Record<string, any>
  }

  export abstract class TabContextMenuItemProvider {
    abstract provide(tab: BaseTabComponent, event: MouseEvent): Promise<any[]>
  }

  export class AppService {
    activeTab: any
    activeTabChange$: Observable<any>
    /** Opens a tab of a specific type (e.g. SettingsTabComponent) */
    openNewTabRaw(params: { type: any; inputs?: Record<string, any> }): Promise<any>
    openNewTabWith(options: any): void
  }

  export class ConfigService {
    store: any
    save(): void
  }
}

declare module 'tabby-settings' {
  import { Type } from '@angular/core'

  export abstract class SettingsTabProvider {
    id: string
    icon: string
    title: string
    weight: number
    prioritized: boolean
    /** Must be overridden to return your settings component class */
    getComponentType(): Type<any> | null
  }

  /** The component type for Tabby's Settings tab window */
  export class SettingsTabComponent {}
}
