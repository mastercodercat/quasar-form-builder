<template>
  <div class="q-form-payment q-form-builder-element">
    <div class="row" v-if="getLabel">
      <div class="col-12">
        <label>{{ getLabel }}</label>
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <q-input
          v-model="innerValue.ccname"
          label="Name on card"
          :rules="getRules('ccname', required)"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <q-input
          v-model="innerValue.ccnum"
          label="Card number"
          fill-mask="#"
          :rules="getRules('ccnum', required)"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12 col-sm-6">
        <q-select
          v-model="innerValue.expmonth"
          :options="expMonths"
          label="Exp. Month"
          :rules="getRules('expmonth', required)"
        />
      </div>
      <div class="col-12 col-sm-6">
        <q-select
          v-model="innerValue.expyear"
          :options="expYears"
          label="Exp. Year"
          :rules="getRules('expyear', required)"
        />
      </div>
    </div>
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <q-input
          v-model="innerValue.cvv"
          label="CVV"
          fill-mask="#"
          hint="3 or 4 digit code on back of card"
          maxlength="4"
          :rules="getRules('cvv', required)"
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
  name: 'PageBreakElement',
  extends: FormElement,
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          ccname: null,
          ccnum: null,
          expmonth: null,
          expyear: null,
          cvv: null,
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

    const range = (start: number, end: number) => {
      return [...Array(end - start + 1)].map((_, i) => start + i);
    };
    const expMonths = () => {
      return range(1, 12);
    };
    const expYears = () => {
      return range(new Date().getFullYear(), new Date().getFullYear() + 10);
    };

    return {
      getLabel,
      innerValue,
      hint,
      getRules,
      expMonths,
      expYears,
    };
  },
});
</script>
