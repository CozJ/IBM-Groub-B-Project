<template>
  <Environment2 />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Environment2 from "@/environments/Environment2.vue";

@Options({
  components: {
    Environment2
  }
})
export default class Environment2View extends Vue {}
</script>
