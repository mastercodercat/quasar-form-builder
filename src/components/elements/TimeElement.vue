<template>
  <div class="row q-col-gutter-sm q-form-time q-form-builder-element">
    <div class="col-12 col-md-6">
      <q-input
        v-model="innerValue"
        mask="time"
        :label="required ? `${label} *` : label"
        :rules="getRules('time', required)"
      >
        <template v-slot:append>
          <q-icon name="access_time" class="cursor-pointer">
            <q-popup-proxy>
              <q-time v-model="innerValue" />
            </q-popup-proxy>
          </q-icon>
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
  name: 'TimeElement',
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
