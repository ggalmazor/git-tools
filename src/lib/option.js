class Option {
  static of(value) {
    if (value === null || value === undefined)
      return NONE;
    if (value instanceof Option)
      return value;
    return new Some(value);
  }

  static none() {
    return NONE;
  }
}

class None extends Option {
  orElse(defaultValue) {
    return defaultValue;
  }

  map(mapper) {
    return this;
  }

  isPresent() {
    return false;
  }

  isEmpty() {
    return true;
  }
}

const NONE = new None();

class Some extends Option {
  constructor(value) {
    super();
    this.value = value;
  }

  orElse(defaultValue) {
    return this.value;
  }

  map(mapper) {
    return Option.of(mapper(this.value));
  }

  isPresent() {
    return true;
  }

  isEmpty() {
    return false;
  }
}


module.exports = Option;