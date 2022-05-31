<template>
  <div class="q-pa-md">
    <q-list>
      <q-item-label header>Options</q-item-label>
      <q-item
        v-for="(option, index) in innerValue.options || []"
        :key="index"
        dense
      >
        <q-item-section side>
          <q-radio v-model="selected" :val="option.label" />
        </q-item-section>
        <q-item-section>
          <q-input dense v-model="option.label" />
        </q-item-section>
        <q-item-section side>
          <q-btn round flat size="xs" icon="delete" @click="removeItem(index)"
            ><q-tooltip>Delete this option</q-tooltip></q-btn
          >
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-item-section side>
          <q-radio v-model="selected" :val="newItem.label" />
        </q-item-section>
        <q-item-section>
          <q-input dense filled v-model="newItem.label" />
        </q-item-section>
        <q-item-section side>
          <q-btn round size="xs" icon="add" @click="addItem">
            <q-tooltip>Add this option</q-tooltip>
          </q-btn>
        </q-item-section>
      </q-item>
      <q-item dense>
        <q-checkbox
          v-model="innerValue.include_other_option"
          label='Include "Other" option'
        />
      </q-item>
    </q-list>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, PropType } from 'vue';

interface CheckBoxValue {
  options: Array<{
    checked: boolean;
    label: string;
  }>;
  include_other_option: boolean;
}

export default defineComponent({
  name: 'CheckboxOptions',
  props: {
    value: {
      type: Object as PropType<CheckBoxValue>,
      default: () => {
        return {
          options: [],
          include_other_option: false,
        };
      },
    },
  },
  setup(props) {
    const innerValue = ref(props.value);
    innerValue.value.include_other_option =
      !!innerValue.value.include_other_option;
    const selected = ref(null);

    const newItem = ref({
      checked: false,
      label: '',
    });

    watch(
      () => selected.value,
      (value) => {
        newItem.value.checked = newItem.value.label === value;
        for (const option of innerValue.value.options) {
          option.checked = option.label === value;
        }
      }
    );

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
      selected,
      newItem,
      addItem,
      removeItem,
    };
  },
});
</script>
