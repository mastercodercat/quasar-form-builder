<template>
  <div class="q-form-radio q-form-builder-element">
    <div class="row">
      <label :class="hasError ? 'text-negative' : ''">{{
        required ? `${label} *` : label
      }}</label>
    </div>
    <div class="row">
      <q-list dense>
        <q-item>
          <q-option-group
            type="radio"
            v-model="innerValue"
            :options="allOptions"
            :color="hasError ? 'red' : ''"
            keep-color
          />
        </q-item>
        <q-item dense v-if="includeOther">
          <q-item-section avatar>
            <q-radio
              v-model="innerValue"
              label="Other:"
              :val="otherOptionVal"
              :color="hasError ? 'red' : ''"
              keep-color
            />
          </q-item-section>
          <q-item-section left>
            <q-input dense v-model="otherOptionVal" :disable="!otherSelected" />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="row">
      <p
        class="text-negative text-caption"
        v-for="(error, idx) in errors"
        :key="idx"
      >
        {{ error }}
      </p>
      <p v-if="hint" class="text-caption" v-html="hint"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch } from 'vue';
import useForm, { FormElement } from './useForm';
import { Option } from '../models';

export default defineComponent({
  name: 'RadioElement',
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
          description: '',
          options: [],
        };
      },
    },
  },
  setup(props) {
    const { hint, getRules } = useForm(props);
    const otherOptionVal = ref('');
    const hasError = ref(false);
    const errors = ref<Array<string>>([]);
    const innerValue = ref<string>(props.value);

    watch(
      () => props.value,
      () => {
        innerValue.value = props.value;
      }
    );

    const allOptions = computed(() => {
      if (props.options && props.options.options) {
        return props.options.options.map((option: Option) => {
          return {
            label: option.label,
            value: option.label,
          };
        });
      }
      return [];
    });
    const includeOther = computed(() => {
      return !!props.options.include_other_option;
    });
    const otherSelected = computed(() => {
      const optionValues = props.options.options.map(
        (option: Option) => option.label
      );
      return optionValues.indexOf(innerValue.value) < 0;
    });

    const validate = () => {
      hasError.value = false;
      errors.value = [];

      if (props.required && !innerValue.value && allOptions.value.length) {
        hasError.value = true;
        errors.value.push('Please select an option.');
      }
    };

    watch(
      () => innerValue.value,
      () => {
        validate();
      }
    );
    watch(
      () => otherOptionVal.value,
      (value) => {
        innerValue.value = value;
      }
    );

    return {
      hasError,
      errors,
      allOptions,
      includeOther,
      otherOptionVal,
      otherSelected,
      innerValue,
      hint,
      getRules,
    };
  },
});
</script>
