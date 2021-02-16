<template>
  <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons|Material+Icons+Outlined"
    rel="stylesheet"
  />
  <a-scene core-bootstrapper>
    <!--<a-entity progressive-controls></a-entity>-->
    <AFrameCoreComponents @network-event="sendNetworkMessage" @network-subscribe="subscribeNetworkMessage" @network-unsubscribe="unsubscribeNetworkMessage" />
    <router-view />
  </a-scene>
  <div id="nav">
    <router-link to="/environment-1">Environment 1</router-link> |
    <router-link to="/environment-2">Environment 2</router-link> |
    <router-link to="/environment-3">Environment 3</router-link>
  </div>

  <!-- Deepstream debug -->
  <div id="deepstream-debug" ref="deepstreamDebug">
    Not connected to Deepstream
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import { DeepstreamClient } from "@deepstream/client";
import { CONNECTION_STATE, JSONValue } from "@deepstream/client/src/constants";
import SimplePeer from "simple-peer";
import { v4 as uuidv4 } from "uuid";

import AFrameCoreComponents from "@/components/AFrameCoreComponents.vue"; // @ is an alias to /src

@Options({
  data: function () {
    return {
      deepstreamClient: new DeepstreamClient('wss://docker-9e7eb339-6bd7-4119-9357-d895ea23b7f9.azurewebsites.net'),
      userID: null
    }
  },
  components: {
    AFrameCoreComponents
  },
  methods: {
    attemptLogin: function () {
      const deepstreamDebug: HTMLDivElement = this.$refs.deepstreamDebug;
      const client: DeepstreamClient = this.$data.deepstreamClient;
      const userID: string = uuidv4();

      deepstreamDebug.innerText = "Attempting to log into Deepstream...";

      client.login({ userID: userID }, (success, data) => {
        if (success) {
          this.$data.userID = userID;
          deepstreamDebug.innerText = `Logged into Deepstream successfully.`;
        } else {
          deepstreamDebug.innerText = `Failed to log into Deepstream, digest ${data}. Retrying in 10 seconds...`;
          setTimeout(this.attemptLogin, 10000);
        }
      });
    },
    sendNetworkMessage: function(eventName: string, data: object) {
      const client: DeepstreamClient = this.$data.deepstreamClient;

      if (this.$data.userID === null)
        return false;

      client.event.emit(eventName, {...data, userID: this.$data.userID});
    },
    subscribeNetworkMessage: function(eventName: string, callback: (data: JSONValue) => void) {
      const client: DeepstreamClient = this.$data.deepstreamClient;

      client.event.subscribe(eventName, callback);
    },
    unsubscribeNetworkMessage: function(eventName: string, callback: (data: JSONValue) => void) {
      const client: DeepstreamClient = this.$data.deepstreamClient;

      client.event.unsubscribe(eventName, callback);
    }
  },
  mounted: function () {
    const deepstreamDebug: HTMLDivElement = this.$refs.deepstreamDebug;
    const client: DeepstreamClient = this.$data.deepstreamClient;

    client.on('connectionStateChanged', (connectionState: CONNECTION_STATE) => {
      deepstreamDebug.innerText = `Connection state: ${connectionState}`;
    });

    client.event.subscribe('debug', (data) => {
      alert(data);
    });

    this.attemptLogin();
  }
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  position: absolute;
  z-index: 10;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#deepstream-debug {
  position: absolute;
  bottom: 1em;
  font-size: 2em;
  font-weight: bolder;
  text-align: center;
  color: white;
  text-shadow:
    -1.5px -1.5px 0 #000,  
     1.5px -1.5px 0 #000,
    -1.5px  1.5px 0 #000,
     1.5px  1.5px 0 #000;
  width: 100%;
  z-index: 10;
}

a-scene {
  width: 100%;
  height: 100%;
  position: absolute !important;
}
</style>
