<template>
  <DocsCard v-bind="$attrs" v-if="file" :file="file">
    <template #templateCode v-if="parts.template">{{ parts.template }}</template>
    <template #scriptCode v-if="parts.script">{{ parts.script }}</template>
    <template #styleCode v-if="parts.style">{{ parts.style }}</template>
    <component :is="component" v-if="component" />
  </DocsCard>
</template>

<script>
import DocsCard from './DocsCard.vue';
export default {
  components: {
    DocsCard,
  },
  inheritAttrs: false,
  props: {
    file: String,
  },
  data() {
    return {
      // loading: true,
      component: null,
      tabs: [],
      parts: {},
    };
  },
  async created() {
    if (this.file) {
      if (this.$lightvue && this.$lightvue.nuxt === 3) {
        // new way
        const fileName = this.file.split('/');
        if (fileName.length <= 2) {
          Promise.all([
            await import(`lightvueDocs/example/${fileName[0]}/${fileName[1]}.vue`).then(comp => {
              this.component = comp.default;
            }),
            await import(`lightvueDocs/example/${fileName[0]}/${fileName[1]}.vue?raw`).then(comp => {
              this.parseComponent(comp.default);
            }),
          ]);
        } else if (fileName.length <= 3) {
          Promise.all([
            await import(`lightvueDocs/example/${fileName[0]}/${fileName[1]}/${fileName[2]}.vue`).then(comp => {
              this.component = comp.default;
            }),
            await import(`lightvueDocs/example/${fileName[0]}/${fileName[1]}/${fileName[2]}.vue?raw`).then(comp => {
              this.parseComponent(comp.default);
            }),
          ]);
        } else {
          console.log(this.file + 'not found!...');
        }
      } else {
        //  old way
        // If this is intended to be left as-is, you can use the /* @vite-ignore */ comment inside the import() call to suppress this warning.
        if (!this.component) {
          import(/* @vite-ignore */ 'lightvueDocs/example/' + this.file + '.vue').then(comp => {
            this.component = comp.default;
          });
        }
        Promise.all([
          import(/* @vite-ignore */ '!raw-loader!lightvueDocs/example/' + this.file + '.vue').then(comp => {
            this.parseComponent(comp.default);
          }),
        ]).then(() => {
          // this.loading = false;
        });
      }
    }
  },
  // watch: {
  //   file: function (newValue) {
  //     import(`${newValue}.vue`).then(loadedComponent => {
  //       this.component = loadedComponent;
  //     });
  //   },
  // },
  // mounted: function () {
  //   import(`${this.file}.vue`).then(loadedComponent => {
  //     this.component = loadedComponent;
  //   });
  // },
  methods: {
    parseComponent(comp) {
      const template = this.parseTemplate('template', comp),
        script = this.parseTemplate('script', comp),
        style = this.parseTemplate('style', comp);
      this.parts = {
        template,
        script,
        style,
      };
      this.tabs = ['template', 'script', 'style'].filter(type => this.parts[type]);
    },
    parseTemplate(target, template) {
      const string = `(<${target}(.*)?>[\\w\\W]*<\\/${target}>)`,
        regex = new RegExp(string, 'g'),
        parsed = regex.exec(template) || [];
      return parsed[1] || '';
    },
  },
};
</script>

<style></style>
