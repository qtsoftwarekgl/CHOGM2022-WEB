const { createGlobPatternsForDependencies } = require('@nrwl/react/tailwind');
const { join } = require('path');
const plugin = require('tailwindcss/plugin');

module.exports = {
	content: [
		join(__dirname, 'src/**/*!(*.stories|*.spec).{ts,tsx,html}'),
    ...createGlobPatternsForDependencies(__dirname)
	],
  theme: {
		extend: {
			width: {
				18: '18.75rem'
			}
		},
  },
	plugins: [
		require('@tailwindcss/forms'),
		plugin(({ addVariant, e }) => {
      addVariant('sidebar-expanded', ({ modifySelectors, separator }) => {
        modifySelectors(({ className }) => `.sidebar-expanded .${e(`sidebar-expanded${separator}${className}`)}`);
      });
    }),
	],
}
