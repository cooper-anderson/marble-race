/**
 * Created by cooperanderson on 12/7/16 AD.
 */

const {Vector2} = require("./Mathj");

class RigidBody {
	constructor(gameObject) {
		this.gameObject = gameObject;
		this.transform = this.gameObject.transform;
		this.velocity = new Vector2();
	}
	Update() {

	}
}

module.exports = {RigidBody};