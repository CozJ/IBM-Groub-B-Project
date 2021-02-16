<template>
  <Environment4 />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Environment4 from "@/environments/Environment4.vue";

@Options({
  components: {
    Environment4
  }
})
export default class Environment4View extends Vue {}
</script>
