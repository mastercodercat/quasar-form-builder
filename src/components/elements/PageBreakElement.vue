<template>
  <div class="q-form-page-break q-form-builder-element">
    <label v-if="label"><strong>Page Break: </strong>{{ label }}</label>
    <q-separator spaced color="primary" />
    <p v-if="hint" class="text-caption" v-html="hint"></p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'PageBreakElement',
  extends: FormElement,
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { hint } = useForm(props);

    return {
      hint,
    };
  },
});
</script>
