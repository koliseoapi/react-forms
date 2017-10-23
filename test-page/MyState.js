// just a class that can be spied for changes
const output = document.getElementsByClassName('output')[0];

window.addEventListener('error', function(err) {
  console.error(err);
  output.classList.add('error');
  output.innerHTML = err.message;
});

export default class MyState {

  constructor(props) {
    Object.assign(this, props);
  }

  set name(name) {
    this._name = name;
    this.printState();
  }

  get name() {
    return this._name;
  }

  set age(age) {
    this._age = age;
    this.printState();
  }

  get age() {
    return this._age;
  }

  set subscribed(subscribed) {
    this._subscribed = subscribed;
    this.printState();
  }

  get subscribed() {
    return this._subscribed;
  }

  printState(message) {
    output.classList.remove('error');
    output.classList.add('highlight');
    output.innerHTML = message || JSON.stringify(this);
    setTimeout(() => output.classList.remove('highlight'), 0);
  }

}
