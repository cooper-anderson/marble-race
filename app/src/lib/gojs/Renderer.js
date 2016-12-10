/**
 * Created by cooperanderson on 12/7/16 AD.
 */

class Renderer {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.transform = this.gameObject.transform;
	}
}

module.exports = {Renderer};