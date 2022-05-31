<template>
  <div class="row q-col-gutter-sm q-form-text q-form-builder-element">
    <div class="col">
      <q-input
        v-model="innerValue"
        :label="required ? `${label} *` : label"
        :rules="getRules('text', required)"
      />
      <p v-if="hint" class="text-caption" v-html="hint"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'TextElement',
  extends: FormElement,
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { hint, getRules } = useForm(props);

    const innerValue = ref<string>(props.value);
    watch(
      () => props.value,
      (value) => {
        innerValue.value = value;
      }
    );

    return {
      innerValue,
      hint,
      getRules,
    };
  },
});
</script>
