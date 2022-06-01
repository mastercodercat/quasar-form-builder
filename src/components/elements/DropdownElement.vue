<template>
  <div class="row q-col-gutter-sm q-form-dropdown q-form-builder-element">
    <div class="col-12 col-md-6 col-lg-3">
      <q-select
        v-model="innerValue"
        :options="allOptions"
        :label="required ? `${label} *` : label"
        :rules="getRules('dropdown', required)"
      />
      <p v-if="hint" class="text-caption" v-html="hint"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import useForm, { FormElement } from './useForm';
import { Option } from '../models';

export default defineComponent({
  name: 'DropdownElement',
  extends: FormElement,
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      required: false,
      default: () => {
        return {
          options: [],
        };
      },
    },
  },
  setup(props) {
    const { innerValue, hint, getRules } = useForm(props);

    const allOptions = computed(() => {
      return (props.options?.options || []).map((option: Option) => ({
        label: option.label,
        value: option.label,
      }));
    });

    return {
      allOptions,
      innerValue,
      hint,
      getRules,
    };
  },
});
</script>
