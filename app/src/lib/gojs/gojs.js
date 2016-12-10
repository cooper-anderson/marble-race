/**
 * Created by cooperanderson on 12/7/16 AD.
 */

const fs = require("fs");

let gojs = {};

fs.readdirSync((`${__dirname}`)).forEach(function(item) {
	if (item != "gojs.js") {
		$.extend(gojs, require(`${__dirname}/${item}`));
	}
});

for (let key in gojs) {
	eval(`${key} = gojs[key]`);
}

module.exports = gojs;