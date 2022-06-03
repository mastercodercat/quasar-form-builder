<template>
  <div class="row q-col-gutter-sm q-form-phone q-form-builder-element">
    <div class="col-12">
      <q-input
        v-model="innerValue"
        type="tel"
        :label="required ? `${label} *` : label"
        mask="(###) ### - ####"
        :rules="getRules('phone', required)"
      >
        <template v-slot:append>
          <q-icon name="phone" />
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
  name: 'PhoneElement',
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
