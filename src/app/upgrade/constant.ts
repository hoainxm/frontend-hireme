export const FEATURES = [
  { key: 'feature1', label: 'title.feature1', lite: true, plus: true, max: true },
  { key: 'feature2', label: 'title.feature2', lite: true, plus: true, max: true },
  { key: 'feature3', label: 'title.feature3', lite: false, plus: true, max: true },
  { key: 'feature4', label: 'title.feature4', lite: false, plus: true, max: true },
  { key: 'feature5', label: 'title.feature5', lite: false, plus: false, max: true },
  { key: 'feature6', label: 'title.feature6', lite: false, plus: false, max: true },
];

export const PLAN_OPTIONS = [
  {
    planType: 'lite',
    name: 'plans.lite',
    saveLabel: 'save.lite',
    price: 'price.lite',
    billingCycle: 'month',
    discount: 'discount.lite',
    billedAnnually: 'yearly',
    buttonText: 'button.currentPlan',
    isCurrent: true,
  },
  {
    planType: 'plus',
    name: 'plans.plus',
    saveLabel: 'save.plus',
    price: 'price.plus',
    billingCycle: 'month',
    discount: 'discount.plus',
    billedAnnually: 'yearly',
    buttonText: 'button.getNow',
    isCurrent: false,
  },
  {
    planType: 'max',
    name: 'plans.max',
    saveLabel: 'save.max',
    price: 'price.max',
    billingCycle: 'month',
    discount: 'discount.max',
    billedAnnually: 'yearly',
    buttonText: 'button.getNow',
    isCurrent: false,
  },
];
