<template>
  <form v-if="value" v-on:submit.prevent>
    <div class="text-right">
      <q-chip square dense :icon="typeIcon" class="text-uppercase">
        {{ typeName }}
      </q-chip>
    </div>
    <q-input dense v-model="innerValue.label" label="Label to display" />
    <q-input
      dense
      v-model="innerValue.options.description"
      type="textarea"
      label="A longer description to display"
      filled
    />
    <q-toggle
      v-model="innerValue.required"
      label="Required"
      v-if="ifNotTypes(['section_break', 'page_break'])"
    />
    <checkbox-options :value="innerValue.options" v-if="ifType('checkboxes')" />
    <radio-options :value="innerValue.options" v-if="ifType('radio')" />
    <dropdown-options :value="innerValue.options" v-if="ifType('dropdown')" />
    <grid-options :value="innerValue.options" v-if="ifType('grid')" />
  </form>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed, PropType } from 'vue';
import CheckboxOptions from './CheckboxOptions.vue';
import RadioOptions from './RadioOptions.vue';
import DropdownOptions from './DropdownOptions.vue';
import GridOptions from './GridOptions.vue';

export default defineComponent({
  name: 'ElementOptions',
  components: {
    CheckboxOptions,
    RadioOptions,
    DropdownOptions,
    GridOptions,
  },
  props: {
    value: {
      type: Object,
      default: () => {
        return {
          label: '',
          options: {},
          required: false,
        };
      },
    },
    types: {
      type: Array as PropType<
        Array<{ type: string; label: string; icon: string }>
      >,
      default: () => {
        return [];
      },
    },
  },
  setup(props) {
    const innerValue = ref(props.value);

    watch(
      () => props.value,
      (value) => {
        innerValue.value = value;
      },
      { deep: true }
    );

    const typeName = computed(() => {
      const info = getTypeInfo();
      return info ? info.label : '';
    });

    const typeIcon = computed(() => {
      const info = getTypeInfo();
      return info ? info.icon : '';
    });

    const ifType = (type: string) => {
      return innerValue.value.type === type;
    };
    const ifNotTypes = (types: Array<string>) => {
      return types.indexOf(innerValue.value.type) === -1;
    };
    const getTypeInfo = () => {
      for (const info of props.types) {
        if (info.type === innerValue.value.type) {
          return info;
        }
      }
      return false;
    };

    return {
      innerValue,
      typeName,
      typeIcon,
      ifType,
      ifNotTypes,
      getTypeInfo,
    };
  },
});
</script>
