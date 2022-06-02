<template>
  <q-layout
    container
    class="full-width full-height"
    style="min-height: calc(100vh - 50px)"
    view="hHh Lpr fff"
  >
    <q-drawer v-model="drawer" show-if-above bordered side="left">
      <q-tabs v-model="tab" align="justify" dense narrow-indicator>
        <q-tab name="add" label="Add Field" />
        <q-tab name="edit" label="Edit Field" :disable="!currentField" />
      </q-tabs>
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="add">
          <draggable
            :list="sourceFields"
            class="source-field"
            :group="sourceOptions"
            :clone="createField"
            :sort="false"
            item-key="id"
          >
            <template #item="{ element }">
              <q-btn
                type="button"
                size="12px"
                dense
                align="left"
                class="btn-fixed-width"
                @click="onAddFieldClick(element.type)"
                :icon="element.icon"
                :label="element.label"
              />
            </template>
          </draggable>
        </q-tab-panel>
        <q-tab-panel name="edit">
          <element-options :value="currentField" :types="sourceFields" />
        </q-tab-panel>
      </q-tab-panels>
      <div class="q-pa-md" style="max-width: 400px">
        <q-form @submit="onCreate" class="q-gutter-md">
          <q-input
            filled
            v-model="name"
            label="Form Name *"
            hint="Form Name"
            lazy-rules
            :rules="[
              (val) => (val && val.length > 0) || 'Please type form name',
            ]"
          />

          <div>
            <q-btn label="Create" type="submit" color="primary" />
          </div>
        </q-form>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="q-form-builder-page">
        <draggable
          v-model="fields"
          :group="destinationOptions"
          @change="onChange"
          :class="{
            'q-form-builder-elements-container': true,
            empty: fields.length == 0,
          }"
          item-key="label"
        >
          <template #item="{ element, index }">
            <div class="element-container">
              <element-container
                :value="element"
                :class="{ selected: isSelectedForEdit(index) }"
                :ref="element.cid"
                :isSelectedForEdit="(cid) => isSelectedForEdit(index, cid)"
                :duplicateField="(cid) => duplicateField(index, cid)"
                :deleteField="(cid) => deleteField(index, cid)"
                @subclick="(cid) => onGridClick(index, cid)"
                @click.stop="() => selectForEdit(element)"
                @change="(value) => onGridChange(element, value)"
              />
              <div
                class="element-action-buttons"
                v-if="isSelectedForEdit(index)"
              >
                <q-btn
                  class="element-button"
                  @click="deleteField(index)"
                  color="red"
                  icon="delete"
                  round
                  size="xs"
                >
                  <q-tooltip>Delete this field</q-tooltip>
                </q-btn>
                <q-btn
                  class="element-button"
                  @click="duplicateField(index)"
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

        <q-separator />

        <div class="q-pa-md q-form-container">
          <h4>Form Rendering</h4>
          <div v-for="(field, index) in fields" :key="index">
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
    </q-page-container>
  </q-layout>
</template>

<script>
import { uid, useQuasar } from 'quasar';
import { defineComponent, ref } from 'vue';
import Draggable from 'vuedraggable';
import { useQuery, useMutation } from '@vue/apollo-composable';
import gql from 'graphql-tag';

import ElementContainer from 'components/ElementContainer.vue';
import ElementOptions from 'components/options/ElementOptions.vue';
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
  components: {
    Draggable,
    ElementContainer,
    ElementOptions,
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
    const $q = useQuasar();
    const tab = ref('add');
    const fields = ref([]);
    const fieldData = ref([]);
    const name = ref('');
    const currentField = ref(false);
    const { mutate: createForm } = useMutation(gql`
      mutation createForm($name: String!, $form: String!) {
        createForm(name: $name, form: $form) {
          id
          name
          createdAt
          updatedAt
          form
        }
      }
    `);

    const selectForEdit = (field) => {
      currentField.value = field;
      tab.value = 'edit';
    };

    const isSelectedForEdit = (index, cid) => {
      if (!currentField.value) {
        return false;
      }
      if (cid === undefined) {
        return currentField.value.cid === fields.value[index].cid;
      } else {
        return (
          currentField.value.cid === fields.value[index].options.fields[cid].cid
        );
      }
    };

    const createField = (item) => {
      return {
        label: 'Untitled',
        type: item.type,
        required: true,
        cid: uid(),
        options: { description: '' },
      };
    };

    const onAddFieldClick = (type) => {
      const field = createField({ type });
      fields.value.push(field);
      selectForEdit(field);
    };

    const onChange = (evt) => {
      console.log(evt);
      if (evt.added) {
        selectForEdit(evt.added.element);
      }
    };

    const deleteField = (index, cid) => {
      currentField.value = false;
      tab.value = 'add';
      if (cid === undefined) {
        fields.value = fields.value.filter((_, idx) => idx !== index);
      } else {
        fields.value = fields.value.map((field, idx) => {
          if (idx === index) {
            return {
              ...field,
              options: {
                ...field.options,
                fields: field.options.fields.filter((_, ix) => ix !== cid),
              },
            };
          }
          return field;
        });
      }
    };

    const duplicateField = (index, cid) => {
      if (cid === undefined) {
        const duplicated = {
          ...fields.value[index],
          cid: uid(),
        };
        fields.value.splice(index + 1, 0, duplicated);
        selectForEdit(duplicated);
      } else {
        const duplicated = {
          ...fields.value[index].options.fields[cid],
          cid: uid(),
        };
        fields.value[index].options.fields.splice(cid + 1, 0, duplicated);
        selectForEdit(duplicated);
      }
    };

    const getElement = (field) => {
      const elementName = field.type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      return `${elementName}Element`;
    };

    const onGridChange = (element, value) => {
      element.options = {
        ...element.options,
        fields: value,
      };
    };

    const onGridClick = (index, cid) => {
      currentField.value = fields.value[index].options.fields[cid];
      tab.value = 'edit';
      console.log(currentField.value);
    };

    const onCreate = async () => {
      const form = JSON.stringify(fields.value);
      const result = await createForm({
        name: name.value,
        form,
      });
      $q.notify(`Form ${name.value} created!`, 'success');
      console.log(result);
    };

    return {
      drawer: ref(true),
      fieldData,
      fields,
      tab,
      name,
      currentField,
      drag: ref(false),
      sourceFields: [
        { type: 'text', icon: 'text_format', label: 'Text', id: 1 },
        { type: 'paragraph', icon: 'text_fields', label: 'Paragraph', id: 2 },
        { type: 'checkboxes', icon: 'check_box', label: 'Checkboxes', id: 3 },
        {
          type: 'radio',
          icon: 'radio_button_checked',
          label: 'Mult. Choice',
          id: 4,
        },
        { type: 'date', icon: 'event', label: 'Date', id: 5 },
        { type: 'time', icon: 'access_time', label: 'Time', id: 6 },
        { type: 'dropdown', icon: 'arrow_drop_down', label: 'Dropdown', id: 7 },
        { type: 'email', icon: 'email', label: 'Email', id: 8 },
        { type: 'name', icon: 'person', label: 'Name', id: 9 },
        {
          type: 'simple_name',
          icon: 'person_outline',
          label: 'Simple Name',
          id: 10,
        },
        { type: 'address', icon: 'home', label: 'Address', id: 11 },
        { type: 'phone', icon: 'phone', label: 'Phone', id: 12 },
        { type: 'file', icon: 'cloud_upload', label: 'File Upload', id: 13 },
        { type: 'payment', icon: 'payment', label: 'Payment', id: 14 },
        { type: 'terms', icon: 'ballot', label: 'Terms', id: 15 },
        {
          type: 'section_break',
          icon: 'view_agenda',
          label: 'Section Break',
          id: 16,
        },
        {
          type: 'page_break',
          icon: 'call_to_action',
          label: 'Page Break',
          id: 17,
        },
        {
          type: 'grid',
          icon: 'grid_on',
          label: 'Grid',
          id: 18,
        },
      ],
      sourceOptions: {
        name: 'q-form-builder',
        pull: 'clone',
        put: false,
      },
      destinationOptions: {
        name: 'q-form-builder',
        pull: true,
        put: true,
      },
      selectForEdit,
      isSelectedForEdit,
      onAddFieldClick,
      createField,
      deleteField,
      duplicateField,
      getElement,
      onChange,
      onGridChange,
      onGridClick,
      onCreate,
    };
  },
});
</script>

<style lang="scss">
.source-field {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;

  .q-btn {
    width: 48%;
    margin-bottom: 6px;
  }
}

.q-page {
  padding: 20px;
}

.q-form-builder-elements-container {
  width: 100%;
  min-height: 200px;
}

.q-editable-element.selected {
  background-color: $blue-grey-1;
}

.element-container {
  position: relative;
}

.element-action-buttons {
  position: absolute;
  bottom: -11px;
  right: 0;
  z-index: 10;

  .element-button {
    float: right;
    margin-right: 5px;
  }
}
</style>
