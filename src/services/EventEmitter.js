const EventEmitter = {
    events: {},
    on: function(eventName, callback) {
      this.events[eventName] = this.events[eventName] || [];
      this.events[eventName].push(callback);
    },
    off: function(eventName, callback) {
      if (this.events[eventName]) {
        this.events[eventName] = this.events[eventName].filter(
          cb => cb !== callback
        );
      }
    },
    emit: function(eventName, ...args) {
      if (this.events[eventName]) {
        this.events[eventName].forEach(callback => callback(...args));
      }
    }
  };
  
  export default EventEmitter;
  