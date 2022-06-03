<template>
  <div class="q-form-file-upload q-form-builder-element">
    <div class="row q-col-gutter-sm">
      <div class="col-12">
        <q-uploader
          accept=".jpg, .pdf, image/*"
          auto-upload
          :url="uploadPath"
          @uploading="onStartUpload"
          @uploaded="onUpload"
          class="full-width"
          :color="hasError ? 'negative' : 'teal'"
          :label="uploading ? 'Uploading...' : getLabel"
          flat
          square
        />
      </div>
    </div>
    <p
      class="col-12 col-md-6 text-negative text-caption"
      v-for="(error, idx) in errors"
      :key="idx"
    >
      {{ error }}
    </p>
    <div v-if="hint" class="row q-col-gutter-sm">
      <p class="col-12 col-md-6 text-caption" v-html="hint"></p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import useForm, { FormElement } from './useForm';

export default defineComponent({
  name: 'FileElement',
  extends: FormElement,
  props: {
    uploadPath: {
      type: String,
      default: '/api/upload',
    },
  },
  setup(props) {
    const { innerValue, hint } = useForm(props);
    const uploading = ref(false);
    const uploadFailed = ref(false);
    const hasError = ref(false);
    const errors = ref<Array<string>>([]);

    const getLabel = computed(() => {
      return props.required ? `${props.label} *` : props.label;
    });

    const onStartUpload = () => {
      uploading.value = true;
    };
    const onUpload = (response: { xhr: XMLHttpRequest }) => {
      uploading.value = false;
      innerValue.value = JSON.parse(response.xhr.response);
      validate();
    };
    const validate = () => {
      errors.value = [];
      if (props.required && !innerValue.value) {
        errors.value.push('This field is required.');
      }
      hasError.value = errors.value.length > 0;
    };

    return {
      hasError,
      errors,
      uploading,
      uploadFailed,
      getLabel,
      innerValue,
      hint,
      onStartUpload,
      onUpload,
      validate,
    };
  },
});
</script>
