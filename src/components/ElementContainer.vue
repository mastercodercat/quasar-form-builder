<template>
  <div class="q-editable-element">
    <div class="overlay" v-show="value.type !== 'grid'"></div>
    <component-container :value="value" v-if="value.type !== 'grid'" />
    <grid-element
      :label="value.label"
      :required="value.required"
      :options="value.options"
      :id="value?.id || value.cid"
      :cid="value.cid"
      :duplicateField="duplicateField"
      :deleteField="deleteField"
      :isSelectedForEdit="isSelectedForEdit"
      @change="onGridChange"
      @subclick="onGridSubClick"
      v-else
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import GridElement from './elements/GridElement.vue';
import ComponentContainer from './ComponentContainer.vue';
import { Element } from './models';

export default defineComponent({
  name: 'ElementContainer',
  components: {
    ComponentContainer,
    GridElement,
  },
  props: {
    value: {
      type: Object as PropType<Element>,
      required: true,
    },
    duplicateField: {
      type: Function,
    },
    deleteField: {
      type: Function,
    },
    isSelectedForEdit: {
      type: Function,
    },
  },
  emits: ['change', 'subclick'],
  setup(props, { emit }) {
    const onGridChange = (value: Array<Element>) => {
      emit('change', value);
    };

    const onGridSubClick = (index: number) => {
      emit('subclick', index);
    };

    return {
      onGridChange,
      onGridSubClick,
    };
  },
});
</script>

<style lang="scss">
.q-editable-element {
  position: relative;
  padding: 5px;
}
.overlay {
  position: absolute;
  z-index: 2;
  cursor: pointer;
  width: 100%;
  height: 100%;
}
</style>
