import makeValidator from '../makeValidator';

const common = {
    'max': makeValidator((value, maxValue) => value <= maxValue, 'The value must be less than or equal to the max value.'),
    'min': makeValidator((value, minValue) => value >= minValue, 'The value must be greater than or equal to the min value.'),
};

export default common;