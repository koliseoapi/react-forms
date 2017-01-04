import { escape } from 'lodash';

// replaces messages. We cannot use ES6 templates (lack of context), 
// and lodash does not pass CSP 
function template(message, data) {

  var templateReplace = function(s, match) {
    return data[match.trim()]
  }

  return message.replace(/\$\{([^}]+)}/g, function(s, match) {
    return escape(templateReplace(s, match))
  });

}

let contents = {
  required: "Please fill out this field",
  min: "Value must be greater than or equal to ${min}",
  max: "Value must be less than or equal to ${max}",
};

export default {

  get(key, props) {
    return template(contents[key], props);
  },

  set(newContents) {
    contents = Object.assign(contents, newContents);
  }

}
