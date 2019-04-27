var notificationService = {
  observers: {},
  removeObserver: function(observer, notifName) {
    var obs = this.observers[notifName];

    if (obs) {
      for (var x = 0; x < obs.length; x++) {
        if (observer === obs[x].observer) {
          obs.splice(x, 1);
          observers[notifName] = obs;
          break;
        }
      }
    }
  },
  addObserver: function(notifName, observer, callBack) {
    let obs = this.observers[notifName];

    if (!obs) {
      this.observers[notifName] = [];
    }

    let obj = {observer: observer, callBack: callBack};
    this.observers[notifName].push(obj);
  },
  postNotification: function(notifName, data) {
    console.log('posting: ' + notifName);
    let obs = this.observers[notifName];
    if (obs) {
      if (obs.length) {
        for (var x = 0; x < obs.length; x++) {
          var obj = obs[x];
          obj.callBack(data);
        }
      }
    }
  }
};