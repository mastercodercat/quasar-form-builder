<template>
  <div class="q-editable-element">
    <div class="overlay"></div>
    <component
      v-bind:is="element"
      :label="value.label"
      :required="value.required"
      :options="value.options"
      :id="value?.id || value.cid"
      :cid="value.cid"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, PropType } from 'vue';
import AddressElement from './elements/AddressElement.vue';
import CheckboxesElement from './elements/CheckboxesElement.vue';
import DateElement from './elements/DateElement.vue';
import DropdownElement from './elements/DropdownElement.vue';
import EmailElement from './elements/EmailElement.vue';
import FileElement from './elements/FileElement.vue';
import NameElement from './elements/NameElement.vue';
import PageBreakElement from './elements/PageBreakElement.vue';
import ParagraphElement from './elements/ParagraphElement.vue';
import PaymentElement from './elements/PaymentElement.vue';
import PhoneElement from './elements/PhoneElement.vue';
import RadioElement from './elements/RadioElement.vue';
import SectionBreakElement from './elements/SectionBreakElement.vue';
import SimpleNameElement from './elements/SimpleNameElement.vue';
import TermsElement from './elements/TermsElement.vue';
import TextElement from './elements/TextElement.vue';
import TimeElement from './elements/TimeElement.vue';
import { Element } from './models';

export default defineComponent({
  name: 'ElementContainer',
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
  props: {
    value: {
      type: Object as PropType<Element>,
      required: true,
    },
  },
  setup(props) {
    const element = computed(() => {
      const elementName = props.value.type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');

      return `${elementName}Element`;
    });

    return {
      element,
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
