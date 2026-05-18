// Type stubs for tabby-core
// These are the minimal type declarations needed for TypeScript compilation.
// The actual implementations are provided at runtime by Tabby itself.

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
    activeTab: BaseTabComponent | null
    activeTabChange$: Observable<BaseTabComponent | null>
    openNewTabWith(options: any): void
  }

  export abstract class BaseTabComponent {
    title: string
    titleChange: Subject<string>
  }

  export abstract class BaseTerminalTabComponent extends BaseTabComponent {
    terminal: any
    output$: Observable<string>
  }

  export class ConfigService {
    store: any
    save(): void
  }
}

declare module 'tabby-settings' {
  import { Type } from '@angular/core'

  export abstract class SettingsTabProvider {
    abstract id: string
    abstract icon: string
    abstract title: string
    abstract component: Type<any>
  }
}
