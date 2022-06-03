<template>
  <div class="q-form-grid q-form-builder-element">
    <label v-if="label">{{ label }}</label>
    <draggable
      v-model="fields"
      :group="destinationOptions"
      :class="{
        'q-form-builder-elements-container': true,
        row: true,
      }"
      item-key="label"
    >
      <template #item="{ element, index }">
        <div
          :class="columnClass(index)"
          :style="{
            padding: `${options.padding}px`,
          }"
          @click.prevent.stop="() => onClick(index)"
        >
          <component-container :value="element" :ref="element.cid" />
          <div
            class="element-action-buttons"
            v-if="isSelectedForEdit && isSelectedForEdit(index)"
          >
            <q-btn
              class="element-button"
              @click="deleteField && deleteField(index)"
              color="red"
              icon="delete"
              round
              size="xs"
            >
              <q-tooltip>Delete this field</q-tooltip>
            </q-btn>
            <q-btn
              class="element-button"
              @click="duplicateField && duplicateField(index)"
              color="secondary"
              icon="file_copy"
              round
              size="xs"
            >
              <q-tooltip>Duplicate this field</q-tooltip>
            </q-btn>
          </div>
        </div>
      </template>
    </draggable>
    <p v-if="hint" class="text-caption" v-html="hint"></p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import useForm, { FormElement } from './useForm';
import Draggable from 'vuedraggable';
import ComponentContainer from '../ComponentContainer.vue';

export default defineComponent({
  name: 'PageBreakElement',
  components: {
    Draggable,
    ComponentContainer,
  },
  extends: FormElement,
  props: {
    value: {
      type: String,
      default: '',
    },
    options: {
      type: Object,
      default: () => ({
        fields: [],
        size: 2,
        padding: 4,
        description: '',
      }),
    },
    isSelectedForEdit: {
      type: Function,
    },
    deleteField: {
      type: Function,
    },
    duplicateField: {
      type: Function,
    },
  },
  emits: ['change', 'subclick'],
  setup(props, { emit }) {
    const { innerValue, hint } = useForm(props);
    const fields = ref(props.options.fields || []);

    const columnClass = (index: number) => {
      return `col-${12 / (props.options.size || 2)} element-container ${
        props.isSelectedForEdit && props.isSelectedForEdit(index)
          ? 'selected'
          : ''
      }`;
    };

    watch(
      () => fields.value,
      (value) => {
        emit('change', value);
      },
      { deep: true }
    );
    watch(
      () => props.options.fields,
      (value) => {
        fields.value = value;
      }
    );

    const onClick = (index: number) => {
      emit('subclick', index);
    };

    return {
      innerValue,
      fields,
      hint,
      columnClass,
      destinationOptions: {
        name: 'q-form-builder',
        pull: true,
        put: true,
      },
      onClick,
    };
  },
});
</script>

<style lang="scss">
.q-editable-element {
  position: relative;
  padding: 5px;
  z-index: 10;
}
.element-container.selected {
  background-color: $blue-grey-1;
}
</style>
