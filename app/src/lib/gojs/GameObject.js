/**
 * Created by cooperanderson on 12/7/16 AD.
 */

class GameObject {
	constructor() {
		this.components = []
		this.transform = this.AddComponent(Transform);
	}
	AddComponent(Type) {
		if (!this.GetComponent(Type)) {
			let component = new Type(this);
			this.components.push(component);
			return component;
		} else {
			return false;
		}
	}
	GetComponent(Type) {
		for (let component in this.components) {
			if (this.components[component] instanceof Type) {
				return this.components[component];
			}
		}
		return false;
	}
	RemoveComponent(Type) {
		for (let component in this.components) {
			if (this.components[component] instanceof Type) {
				this.components.splice(component, 1);
				return true;
			}
		}
		return true;
	}
	Update() {
		for (let component in this.components) {
			if (this.components[component].Update) {
				this.components[component].Update();
			}
		}
	}
}

module.exports = {GameObject};