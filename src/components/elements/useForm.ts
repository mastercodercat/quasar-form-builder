import { defineComponent, computed, ref, watch } from 'vue';

export const FormElement = defineComponent({
  props: {
    value: {
      type: Object,
      default: () => {
        return {};
      },
    },
    label: {
      type: String,
      required: true,
    },
    required: {
      type: Boolean,
      default: true,
    },
    options: {
      type: Object,
      required: false,
      default: () => ({
        description: '',
      }),
    },
    cid: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      required: false,
    },
  },
});

interface FormElementProps {
  value: object | string | boolean;
  label: string;
  required: boolean;
  options: {
    description?: string;
  };
  cid: string;
  id?: string;
}

const useForm = ({ options, value, required, label }: FormElementProps) => {
  const innerValue = ref(value);

  watch(
    () => value,
    (v) => {
      innerValue.value = v;
    }
  );

  const getLabel = computed(() => {
    return required ? `${label} *` : label;
  });
  const hint = computed(() => {
    return options && options?.description ? options.description : '';
  });
  const rules = computed(() => {
    return [];
  });

  const getRules = (subField: string, requiredCheck: boolean) => {
    const requiredValidation = (val: string) =>
      !!val || 'This field is required.';

    if (subField) {
      const rule = rules.value.find((rl) => rl === subField);
      if (rule) {
        return requiredCheck ? [rule, requiredValidation] : [rule];
      } else {
        return requiredCheck ? [requiredValidation] : [];
      }
    }
  };

  return {
    innerValue,

    getLabel,
    hint,
    rules,

    getRules,
  };
};

export default useForm;
