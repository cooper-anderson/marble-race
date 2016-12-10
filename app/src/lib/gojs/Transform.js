/**
 * Created by cooperanderson on 12/7/16 AD.
 */

const {Vector2} = require("./Mathj");

class Transform {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.transform = this.gameObject.transform;
		this.position = new Vector2();
		this.localPosition = new Vector2();
		this.rotation = 0;
		this.localRotation = 0;
		this.scale = new Vector2();
		this.localScale = new Vector2();
	}
	Update() {

	}
}

module.exports = {Transform};