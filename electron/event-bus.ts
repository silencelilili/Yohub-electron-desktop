/*
 * @Date: 2024-10-15 23:09:52
 * @LastEditors: lixuedan
 * @FilePath: /electron/event-bus.ts
 * @Description: 事件总线
 */
type EventHandler = (...args: any[]) => void;

/**
 * Yohub 事件总线
 */
export class YohubEventBus {
  private static instance: YohubEventBus;

  static get shared(): YohubEventBus {
    if (!YohubEventBus.instance) {
      YohubEventBus.instance = new YohubEventBus();
    }
    return YohubEventBus.instance;
  }

  handlers: EventHandler[] = [];

  subscribe(handler: EventHandler) {
    this.handlers.push(handler);
  }

  unsubscribe(handler: EventHandler) {
    const index = this.handlers.indexOf(handler);
    if (index !== -1) {
      this.handlers.splice(index, 1);
    }
  }

  emit(...args: any[]) {
    this.handlers.forEach((handler) => {
      handler.apply(null, args);
    });
  }
}
