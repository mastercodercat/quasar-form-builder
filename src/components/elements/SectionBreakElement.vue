<template>
  <div class="q-form-section-break q-form-builder-element">
    <label v-if="label">{{ label }}</label>
    <q-separator spaced color="secondary" />
    <p v-if="hint" class="text-caption" v-html="hint"></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'SectionBreakElement',
  extends: FormElement,
  setup(props) {
    const { hint } = useForm(props);

    return {
      hint,
    };
  },
});
</script>
