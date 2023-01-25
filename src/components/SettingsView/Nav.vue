<template>
  <div class="settingsnav">
    <button @click="resetStorate">
      &nbsp;&nbsp; Reset client &nbsp;&nbsp;
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

const router = useRouter();

const resetStorate = () => {
  localStorage.clear();
  router.go(0);
};
</script>
