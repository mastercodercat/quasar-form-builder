<template>
  <div class="row q-col-gutter-sm q-form-date q-form-builder-element">
    <div class="col-12 col-md-6">
      <q-input
        v-model="innerValue"
        mask="date"
        :label="required ? `${label} *` : label"
        :rules="getRules('date', required)"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy>
              <q-date v-model="innerValue" />
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
  name: 'DateElement',
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
