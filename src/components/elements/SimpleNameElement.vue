<template>
  <div class="q-form-simple-name q-form-builder-element">
    <div class="row" v-if="getLabel">
      <div class="col-12">
        <label>{{ getLabel }}</label>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-input
          v-model="innerValue.first"
          dense
          placeholder="First Name"
          :rules="getRules('first', required)"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="innerValue.last"
          dense
          placeholder="Last Name"
          :rules="getRules('last', required)"
        />
      </div>
    </div>
    <div class="row" v-if="hint">
      <div class="col-12 text-caption" v-html="hint"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'SimpleNameElement',
  extends: FormElement,
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          first: null,
          last: null,
        };
      },
    },
  },
  setup(props) {
    const { hint, getRules } = useForm(props);
    const innerValue = ref(props.value);

    watch(
      () => props.value,
      (value) => {
        innerValue.value = value;
      }
    );

    const getLabel = computed(() => {
      return props.required ? `${props.label} *` : props.label;
    });

    return {
      getLabel,
      innerValue,
      hint,
      getRules,
    };
  },
});
</script>
