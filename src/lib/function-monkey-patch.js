Function.prototype.and = function (other) {
  const self = this;
  return function (...args) {
    return self.apply(self, args) && other.apply(other, args);
  }
};

Function.prototype.not = function () {
  const self = this;
  return function (...args) {
    return !self.apply(self, args)
  }
};
