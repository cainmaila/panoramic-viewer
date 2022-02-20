class EventEmitter {
  private events: {};
  constructor() {
    this.events = {};
  }
  on(eventName: string, func: object) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(func);
  }
  emit(eventName: string, ...params: any[]) {
    const events = this.events[eventName];
    if (events) {
      events.forEach((event) => {
        event.apply(this, params);
      });
    }
  }
  off(eventName: string, func?: object) {
    if (this.events[eventName]) {
      if (!func) {
        this.events[eventName] = [];
      } else {
        this.events[eventName].splice(this.events[eventName].indexOf(func), 1);
      }
    }
  }
  removeAllListners(eventName?: string) {
    if (eventName) {
      this.events[eventName] = [];
    } else {
      this.events = {};
    }
  }
}

export default EventEmitter;
