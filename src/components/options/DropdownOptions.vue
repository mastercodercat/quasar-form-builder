<template>
  <div class="q-pa-md">
    <q-select
      v-model="list"
      label="Collections"
      :options="loading ? [] : result.allDropdownLists"
      option-label="name"
      option-value="id"
      :rules="[(val) => !!val || 'This field is required']"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';

interface DropdownBoxValue {
  options: Array<{
    checked: boolean;
    label: string;
  }>;
}

interface DropdownList {
  id: string;
  name: string;
  items: Array<{
    name: string;
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
    const list = ref<DropdownList | null>(null);
    const innerValue = ref(props.value);

    watch(
      () => list.value,
      (value) => {
        if (value !== null) {
          innerValue.value.options = value.items.map((item) => ({
            checked: false,
            label: item.name,
          }));
          console.log(innerValue.value.options);
        }
      }
    );

    const { result, loading } = useQuery(gql`
      query allDropdownLists {
        allDropdownLists {
          id
          name
          createdAt
          updatedAt
          items {
            name
          }
        }
      }
    `);

    watch(
      () => result.value,
      (value) => {
        console.log(value);
      }
    );

    return {
      innerValue,
      result,
      loading,
      list,
    };
  },
});
</script>
