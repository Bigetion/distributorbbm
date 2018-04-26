let store = {}

function setAppStore(id, value) {
  store = Object.assign(store, {
    [id]: value
  });
  window.eventBus.$emit("appStore", store);
}

export default setAppStore