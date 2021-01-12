<template>
  <Environment3 />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Environment3 from "@/environments/Environment3.vue";

@Options({
  components: {
    Environment3
  }
})
export default class Environment3View extends Vue {}
</script>
