import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

import AFrame from "aframe";
require("aframe-extras");
import "aframe-physics-system/dist/aframe-physics-system";
require("super-hands");


console.log(AFrame.version);

AFrame.registerComponent('capture-mouse', {
  init: function () {
    this.eventRepeater = this.eventRepeater.bind(this)

    this.el.sceneEl?.addEventListener('loaded', () => {
      this.el.sceneEl?.canvas.addEventListener('mousedown', this.eventRepeater)
      this.el.sceneEl?.canvas.addEventListener('mouseup', this.eventRepeater)
      this.el.sceneEl?.canvas.addEventListener('touchstart', this.eventRepeater)
      this.el.sceneEl?.canvas.addEventListener('touchmove', this.eventRepeater)
      this.el.sceneEl?.canvas.addEventListener('touchend', this.eventRepeater)
    });

  },
  //Fix actual signature later [FIXME]
  eventRepeater: function (evt: { type: string; preventDefault: () => void; detail: any; }) {
    if (evt.type.startsWith('touch')) {
      evt.preventDefault()
      if (evt.type === 'touchmove') { return }
    }

    this.el.emit(evt.type, evt.detail)
  }
});

createApp(App)
  .use(store)
  .use(router)
  .mount("#app");
