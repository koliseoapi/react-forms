import { partial, escape } from 'lodash';

export default function(message, data) {

  var templateReplace = function(s, match) {
    return data[match]
  }

  if (typeof data === 'undefined') {
    return partial(template, message);
  } else {
    return message
      .replace(/\$\{\{([^}]+)}}/g, templateReplace)
      .replace(/\$\{([^}]+)}/g, function(s, match) {
        return escape(templateReplace(s, match))
      })
  }
};
