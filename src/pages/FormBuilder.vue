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
                @click="() => selectForEdit(element)"
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
            />
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
import { uid } from 'quasar';
import { defineComponent, ref } from 'vue';
import Draggable from 'vuedraggable';

import ElementContainer from 'components/ElementContainer.vue';
import ElementOptions from 'components/options/ElementOptions.vue';
import AddressElement from 'components/elements/AddressElement.vue';
import CheckboxesElement from 'components/elements/CheckboxesElement.vue';
import TextElement from 'components/elements/TextElement.vue';
import ParagraphElement from 'components/elements/ParagraphElement.vue';
import RadioElement from 'components/elements/RadioElement.vue';

export default defineComponent({
  components: {
    Draggable,
    ElementContainer,
    ElementOptions,
    AddressElement,
    CheckboxesElement,
    TextElement,
    ParagraphElement,
    RadioElement,
  },
  setup() {
    const tab = ref('add');
    const fields = ref([]);
    const fieldData = ref([]);
    const currentField = ref(false);

    const selectForEdit = (field) => {
      currentField.value = field;
      tab.value = 'edit';
    };

    const isSelectedForEdit = (index) => {
      return currentField.value.cid === fields.value[index].cid;
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

    const deleteField = (index) => {
      currentField.value = false;
      tab.value = 'add';
      fields.value = fields.value.filter((_, idx) => idx !== index);
    };

    const duplicateField = (index) => {
      const duplicated = {
        ...fields.value[index],
        cid: uid(),
      };
      fields.value.splice(index + 1, 0, duplicated);
      selectForEdit(duplicated);
    };

    const getElement = (field) => {
      const elementName = field.type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      return `${elementName}Element`;
    };

    return {
      drawer: ref(true),
      fieldData,
      fields,
      tab,
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
      ],
      sourceOptions: {
        name: 'q-form-builder',
        pull: 'clone',
        put: false,
      },
      destinationOptions: {
        name: 'q-form-builder',
        pull: false,
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
