module.exports = {
  extends: ['stylelint-config-standard'],
  rules: {
    'color-no-invalid-hex': true,
    'declaration-block-no-duplicate-properties': true,
    'selector-pseudo-element-no-unknown': true,
    'unit-no-unknown': true,
    'at-rule-no-unknown': [true, { ignoreAtRules: ['supports', 'document'] }],
    'declaration-colon-newline-after': null,
    'no-descending-specificity': null,
  },
};
