<template>
  <div class="row q-col-gutter-sm q-form-email q-form-builder-element">
    <div class="col-12 col-md-6">
      <q-input
        v-model="innerValue"
        type="email"
        :label="required ? `${label} *` : label"
        :rules="['email']"
      >
        <template v-slot:append>
          <q-icon name="email" />
        </template>
      </q-input>
      <p v-if="hint" class="text-caption" v-html="hint"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'EmailElement',
  extends: FormElement,
  props: {
    value: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const { hint } = useForm(props);
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
    };
  },
});
</script>
