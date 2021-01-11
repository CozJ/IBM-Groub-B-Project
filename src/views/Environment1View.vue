<template>
  <Environment1 />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Environment1 from "@/environments/Environment1.vue";

@Options({
  components: {
    Environment1
  }
})
export default class Environment1View extends Vue {}
</script>
