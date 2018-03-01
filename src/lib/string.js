const startsWith = value => text => text.indexOf(value) === 0;
const isEmpty = text => text.length === 0;

module.exports = {startsWith, isEmpty};