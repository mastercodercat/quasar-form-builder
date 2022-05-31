<template>
  <div class="row q-col-gutter-sm q-form-paragraph q-form-builder-element">
    <q-input
      class="full-width"
      v-model="innerValue"
      :label="required ? `${label} *` : label"
      filled
      type="textarea"
      :rules="getRules()"
    />
    <p v-if="hint" class="text-caption" v-html="hint"></p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'ParagraphElement',
  extends: FormElement,
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { innerValue, hint, getRules } = useForm(props);
    console.log(innerValue.value);

    return {
      innerValue,
      hint,
      getRules,
    };
  },
});
</script>
