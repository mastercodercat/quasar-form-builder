<template>
  <div class="q-pa-md">
    <q-select
      v-model="innerValue.size"
      label="Columns per row"
      :options="options"
      :rules="[(val) => !!val || 'This field is required']"
    />
    <q-input
      label="Padding between columns"
      v-model="innerValue.padding"
      type="number"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';

interface GridBoxValue {
  size: number;
  padding: number;
}

export default defineComponent({
  name: 'GridOptions',
  props: {
    value: {
      type: Object as PropType<GridBoxValue>,
      default: () => {
        return {
          size: 2,
          padding: 4,
        };
      },
    },
  },
  setup(props) {
    const innerValue = ref(props.value);

    watch(
      () => innerValue.value,
      (value) => {
        console.log(value);
      },
      { deep: true }
    );

    return {
      innerValue,
      options: [2, 3, 4, 6],
    };
  },
});
</script>
