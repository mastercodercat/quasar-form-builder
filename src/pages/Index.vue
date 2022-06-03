<template>
  <q-page class="row items-center justify-evenly">
    <div class="col-6 q-px-md">
      <q-btn label="Create Form" color="primary" to="/create" class="q-my-md" />
      <q-list bordered separator>
        <q-item
          v-for="form in result?.allForms || []"
          :key="form.id"
          v-ripple
          clickable
          @click="() => onClick(form.form)"
        >
          <q-item-section>
            <q-item-label>{{ form.name }}</q-item-label>
            <q-item-label caption>{{ form.createdAt }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
      <q-inner-loading :showing="loading">
        <q-spinner-gears size="50px" color="primary" />
      </q-inner-loading>
    </div>
    <div class="col-6 q-px-md">
      <div v-for="(field, index) in current || []" :key="index">
        <component
          v-model="fieldData[field.cid]"
          v-bind:is="getElement(field)"
          :label="field.label"
          :required="field.required"
          :options="field.options"
          :id="field.cid"
          :cid="field.cid"
          :ref="field.cid"
          v-if="field.type !== 'grid'"
        />
        <div class="row" v-else>
          <div
            v-for="(fld, idx) in field.options.fields"
            :key="`grid-${idx}`"
            :class="columnClass(fld.options?.size)"
          >
            <component
              v-model="fieldData[fld.cid]"
              v-bind:is="getElement(fld)"
              :label="fld.label"
              :required="fld.required"
              :options="fld.options"
              :id="fld.cid"
              :cid="fld.cid"
              :ref="fld.cid"
            />
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import gql from 'graphql-tag';
import { Element } from 'components/models';

import AddressElement from 'components/elements/AddressElement.vue';
import CheckboxesElement from 'components/elements/CheckboxesElement.vue';
import DateElement from 'components/elements/DateElement.vue';
import DropdownElement from 'components/elements/DropdownElement.vue';
import EmailElement from 'components/elements/EmailElement.vue';
import FileElement from 'components/elements/FileElement.vue';
import NameElement from 'components/elements/NameElement.vue';
import PageBreakElement from 'components/elements/PageBreakElement.vue';
import ParagraphElement from 'components/elements/ParagraphElement.vue';
import PaymentElement from 'components/elements/PaymentElement.vue';
import PhoneElement from 'components/elements/PhoneElement.vue';
import RadioElement from 'components/elements/RadioElement.vue';
import SectionBreakElement from 'components/elements/SectionBreakElement.vue';
import SimpleNameElement from 'components/elements/SimpleNameElement.vue';
import TermsElement from 'components/elements/TermsElement.vue';
import TextElement from 'components/elements/TextElement.vue';
import TimeElement from 'components/elements/TimeElement.vue';

export default defineComponent({
  name: 'IndexPage',
  components: {
    AddressElement,
    CheckboxesElement,
    DateElement,
    DropdownElement,
    EmailElement,
    FileElement,
    NameElement,
    PageBreakElement,
    ParagraphElement,
    PaymentElement,
    PhoneElement,
    RadioElement,
    SectionBreakElement,
    SimpleNameElement,
    TermsElement,
    TextElement,
    TimeElement,
  },
  setup() {
    const current = ref<Array<Element>>([]);
    const fieldData = ref<Record<string, any>>({});

    const { result, loading } = useQuery(gql`
      query allForms {
        allForms {
          id
          name
          createdAt
          updatedAt
          form
        }
      }
    `);

    const onClick = (form: string) => {
      current.value = JSON.parse(form) as Array<Element>;
      console.log(current.value);
    };

    const getElement = (field: Element) => {
      const elementName = field.type
        .split('_')
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      return `${elementName}Element`;
    };

    const columnClass = (size: number | undefined) => {
      return `col-${12 / (size || 2)} element-container`;
    };

    return {
      result,
      loading,
      current,
      fieldData,
      onClick,
      columnClass,
      getElement,
    };
  },
});
</script>
