<template>
  <a-entity
    gltf-model="#asset-remote-user"
    position="0 0 0"
    scale="1 1 1"
  ></a-entity>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String
  }
})
export default class RemoteUser extends Vue {
  msg!: string;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

</style>
