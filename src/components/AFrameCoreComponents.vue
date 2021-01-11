<template>
  <a-box color="blue" position="0 4 -5" rotation="0 45 45" scale="1 1 1"></a-box>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    msg: String
  }
})
export default class AFrameCoreComponents extends Vue {
  msg!: string;
}
</script>
