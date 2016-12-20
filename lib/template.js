import { escape } from 'lodash';

const templateReplace = function(s, match) {
  return data[match]
};

// a CSP-friendly implementation of template
export default function(message, data) {

  return message.
    replace(/\$\{\{([^}]+)}}/g, templateReplace).
    replace(/\$\{([^}]+)}/g, function(s, match) {
      return escape(templateReplace(s, match))
    });
};
