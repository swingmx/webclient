<template>
  <div class="settingsnav">
    <button @click="resetClient">
      &nbsp;&nbsp; Reset client &nbsp;&nbsp;
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const resetClient = () => {
  localStorage.clear();
  router.go(0);
};
</script>
