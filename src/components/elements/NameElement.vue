<template>
  <div class="q-form-name q-form-builder-element">
    <div class="row" v-if="getLabel">
      <div class="col-12">
        <label>{{ getLabel }}</label>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-2">
        <q-select
          v-model="innerValue.title"
          :options="titleOptions"
          label="Title"
          dense
        />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="innerValue.first"
          label="First Name"
          dense
          :rules="getRules('first', required)"
        />
      </div>
      <div class="col-12 col-md-2">
        <q-input v-model="innerValue.middle" label="Middle Name" dense />
      </div>
      <div class="col-12 col-md-4">
        <q-input
          v-model="innerValue.last"
          label="Last Name"
          dense
          :rules="getRules('last', required)"
        />
      </div>
    </div>
    <div class="row" v-if="hint">
      <p class="col-12 text-caption" v-html="hint"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'NameElement',
  extends: FormElement,
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          title: null,
          first: null,
          middle: null,
          last: null,
        };
      },
    },
  },
  setup(props) {
    const { hint, getRules } = useForm(props);
    const innerValue = ref(props.options);

    watch(
      () => props.value,
      (value) => {
        innerValue.value = value;
      }
    );

    const getLabel = computed(() => {
      return props.required ? `${props.label} *` : props.label;
    });
    const titleOptions = computed(() => {
      return ['Mr.', 'Mrs.', 'Ms.', 'Dr.'];
    });

    return {
      getLabel,
      titleOptions,
      innerValue,
      hint,
      getRules,
    };
  },
});
</script>
