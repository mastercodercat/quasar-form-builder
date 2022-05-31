<template>
  <div class="q-form-address q-form-builder-element">
    <div class="row" v-if="getLabel">
      <div class="col-12">
        <label>{{ getLabel }}</label>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <q-input
          v-model="innerValue.address"
          label="Street"
          :rules="getRules('street', required)"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-input
          v-model="innerValue.city"
          label="City"
          :rules="getRules('city', required)"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-input
          v-model="innerValue.state"
          label="State/Province/Region"
          :rules="getRules('state', required)"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-md-6">
        <q-input
          v-model="innerValue.zip"
          label="Zip/Postal Code"
          :rules="getRules('zip', required)"
        />
      </div>
      <div class="col-12 col-md-6">
        <q-select
          v-model="innerValue.country"
          :options="countries"
          label="Country"
          :rules="getRules('country', required)"
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
import countries from 'components/data/countries.json';

export default defineComponent({
  name: 'AddressElement',
  extends: FormElement,
  props: {
    value: {
      type: Object,
      default: () => ({
        address: null,
        city: null,
        state: null,
        zip: null,
        country: null,
      }),
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
      innerValue,
      countries,
      getLabel,
      hint,
      getRules,
    };
  },
});
</script>
