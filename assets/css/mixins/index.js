/**
* These are mixins for use with the gulp postcss-precss plugin
* This index just loads all the mixins and returns them,
* the gulp task can then just load this one file to access all the mixins
*
* The precss plugin actuall itself uses the postcss-mixins plugin, refer to the docs
* on how to create a mixin
* See: https://github.com/postcss/postcss-mixins#function-mixin
*/

module.exports = {
    cardColorMixins: require("./cardColors")
};
