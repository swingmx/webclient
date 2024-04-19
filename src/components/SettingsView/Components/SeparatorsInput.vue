<template>
  <div class="artist-separators-input">
    <form @submit.prevent="submitInput">
      <input ref="separatorinput" type="search" class="rounded-sm" @input="updateInput" />
      <div class="preview">
        <span v-for="p in preview_items" :key="p" class="circular" :class="!default_input_list.includes(p) ? 'new' : ''"
          ><b>
            {{ p }}
          </b></span
        >
      </div>
      <button>Save</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from "vue";

const separatorinput: Ref<HTMLInputElement | null> = ref(null);
const input = ref("");

const props = defineProps<{
  default: string[];
  submit: (input: string) => void;
}>();

const splitInput = (input: string) => {
  const i = input
    .trim()
    .split(",")
    .filter((x) => x.trim() != "");

  // trim and remove duplicates
  const trimmed = i.map((x) => x.trim());
  const unique = [...new Set(trimmed)];

  return [",", ...unique];
};

const updateInput = (e: Event) => {
  input.value = (e.target as HTMLInputElement).value;
};

const default_input_list = computed(() => splitInput(default_input.value));

function submitInput() {
  // check if input has changed
  function joinAndSort(arr: string[]) {
    return arr.slice(1).sort().join(",");
  }

  const default_ = joinAndSort(default_input_list.value);
  const preview_ = joinAndSort(preview_items.value);

  if (preview_ == default_) return;

  props.submit(preview_);
}

const preview_items = computed(() => splitInput(input.value));
const default_input = computed(() => (props.default ? props.default.join(", ") : ""));

onMounted(() => {
  const text = props.default.join(", ");
  input.value = text;

  if (separatorinput.value) {
    separatorinput.value.value = text;
  }
});
</script>

<style lang="scss">
.artist-separators-input {
  margin-top: $small;

  input {
    width: 100%;
    border: none;
    outline: none;

    padding: $small;
    background-color: $gray5;
    color: white;
    font-size: 1rem;
    appearance: none;
  }

  .preview {
    display: flex;
    gap: $small;
    margin: $medium 0;

    span {
      background-color: $gray3;
      color: white;
      font-size: 1rem;
      padding: $smaller 1rem;
      font-size: 14px;
    }

    span.new {
      background-color: $darkblue;
    }
  }

  button {
    padding: 0 1rem;
  }
}
</style>
