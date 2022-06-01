<template>
  <div class="row q-col-gutter-sm q-form-terms q-form-builder-element">
    <div class="col">
      <label>{{ getLabel }}</label>
      <q-scroll-area
        class="terms-scroll-area"
        :content-style="termsContentStyle"
        :content-active-style="termsContentStyle"
      >
        <div class="text-body2" v-html="hint"></div>
      </q-scroll-area>
      <q-checkbox
        v-model="innerValue"
        true-value="I Agree"
        :false-value="false"
        keep-color
        :color="hasError ? 'red' : ''"
      >
        <span :class="hasError ? 'text-negative' : ''">I Agree</span>
      </q-checkbox>
      <p
        class="text-negative text-caption"
        v-for="(error, idx) in errors"
        :key="idx"
      >
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'TermsElement',
  extends: FormElement,
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { innerValue, hint } = useForm(props);
    innerValue.value = !!innerValue.value;
    const hasError = ref(false);
    const errors = ref<Array<string>>([]);

    const getLabel = computed(() => {
      return props.required ? `${props.label} *` : props.label;
    });
    const termsContentStyle = computed(() => {
      return {
        background: 'rgba(0,0,0,0.02)',
        color: 'rgb(117, 117, 117)',
        padding: '10px',
      };
    });

    watch(
      () => innerValue.value,
      () => {
        hasError.value = false;
        errors.value = [];

        if (props.required && !innerValue.value) {
          hasError.value = true;
          errors.value.push('Please click "I Agree" to accept.');
        }
      }
    );

    return {
      getLabel,
      hasError,
      errors,
      termsContentStyle,
      innerValue,
      hint,
    };
  },
});
</script>
