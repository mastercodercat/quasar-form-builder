<template>
  <div class="q-pa-md">
    <q-list>
      <q-item-label header>Options</q-item-label>
      <q-item v-for="(option, index) in innerValue.options" :key="index" dense>
        <q-item-section>
          <q-input dense v-model="option.label" />
        </q-item-section>
        <q-item-section side>
          <q-btn round flat size="xs" icon="delete" @click="removeItem(index)">
            <q-tooltip>Delete this option</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-item-section>
          <q-input dense filled v-model="newItem.label" />
        </q-item-section>
        <q-item-section side>
          <q-btn round size="xs" icon="add" @click="addItem">
            <q-tooltip>Add this option</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue';

interface DropdownBoxValue {
  options: Array<{
    checked: boolean;
    label: string;
  }>;
}

export default defineComponent({
  name: 'DropdownOptions',
  props: {
    value: {
      type: Object as PropType<DropdownBoxValue>,
      default: () => {
        return {
          options: [],
        };
      },
    },
  },
  setup(props) {
    const innerValue = ref(props.value);

    const newItem = ref({
      checked: false,
      label: '',
    });

    const addItem = () => {
      if (!innerValue.value.options) {
        innerValue.value.options = [];
      }
      innerValue.value.options.push({
        label: newItem.value.label,
        checked: newItem.value.checked,
      });
      newItem.value = {
        checked: false,
        label: '',
      };
    };
    const removeItem = (index: number) => {
      innerValue.value.options.splice(index, 1);
    };

    return {
      innerValue,
      newItem,
      addItem,
      removeItem,
    };
  },
});
</script>
