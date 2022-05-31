<template>
  <div class="q-form-checkbox q-form-builder-element">
    <div class="row">
      <label :class="hasError ? 'text-negative' : ''">{{
        required ? `${label} *` : label
      }}</label>
    </div>
    <div class="row">
      <q-list dense>
        <q-item>
          <q-option-group
            type="checkbox"
            v-model="selectedOptions"
            :options="allOptions"
            :color="hasError ? 'red' : ''"
            keep-color
          />
        </q-item>
        <q-item dense v-if="includeOther">
          <q-item-section avatar>
            <q-checkbox
              v-model="selectedOther.checked"
              label="Other:"
              :color="hasError ? 'red' : ''"
              keep-color
            />
          </q-item-section>
          <q-item-section left>
            <q-input
              v-model="selectedOther.label"
              dense
              :disable="!selectedOther"
            />
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
import { defineComponent, ref, computed, watch } from 'vue';
import useForm, { FormElement } from './useForm';
import { Option } from '../models';

export default defineComponent({
  name: 'CheckBoxesElement',
  extends: FormElement,
  props: {
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
    const { innerValue, getLabel, hint } = useForm(props);
    const hasError = ref(false);
    const errors = ref<Array<string>>([]);

    const getOptions = () => {
      return props.options && props.options.options;
    };
    const defaultSelectOptions = () => {
      let values = [];
      if (props.value && Array.isArray(props.value)) {
        values = props.value;
      } else {
        for (const option of getOptions() || []) {
          if (option.checked) {
            values.push(option.label);
          }
        }
      }
      return values;
    };
    const defaultSelectOther = () => {
      if (props.value && Array.isArray(props.value)) {
        const lastOption = props.value.slice(-1)[0];
        for (const option of getOptions() || []) {
          if (option.label === lastOption) {
            return {
              checked: false,
              label: '',
            };
          }
        }
        return {
          checked: true,
          label: lastOption,
        };
      }
      return {
        checked: false,
        label: '',
      };
    };
    const validate = () => {
      hasError.value = false;
      errors.value = [];

      if (props.required) {
        const values = selectedOptions.value.slice(0);
        if (selectedOther.value.checked) {
          values.push(selectedOther.value.label);
        }

        if (values.length === 0 && allOptions.value.length) {
          hasError.value = true;
          if (allOptions.value.length > 1) {
            errors.value.push('Please select at least one option.');
          } else {
            errors.value.push('Please select this required option.');
          }
        }
      }
    };

    const selectedOptions = ref(defaultSelectOptions());
    const selectedOther = ref(defaultSelectOther());
    const allOptions = computed(() => {
      return (props.options.options || []).map((option: Option) => ({
        label: option.label,
        value: option.label,
      }));
    });
    const includeOther = computed(() => {
      return props.options.include_other_option;
    });

    watch(
      () => props.options,
      () => {
        selectedOptions.value = defaultSelectOptions();
      },
      { deep: true }
    );
    watch(
      () => [selectedOptions.value, selectedOther.value],
      () => {
        validate();
      }
    );

    return {
      hasError,
      errors,
      selectedOptions,
      selectedOther,
      allOptions,
      includeOther,
      innerValue,
      getLabel,
      hint,
      validate,
    };
  },
});
</script>
