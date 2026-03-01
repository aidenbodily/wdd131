const character = {
	name: "Snortleblat",
	class: "Swamp Beast Diplomat",
	level: 5,
	health: 100,
	image: "snortleblat.webp",
	attacked() {
		if (this.health > 20) {
			this.health -= 20;
		} else {
			this.health = 0;
		}
		return this.health;
	},
	levelUp() {
		this.level += 1;
		return this.level;
	}
};

const characterName = document.querySelector("#characterName");
const characterClass = document.querySelector("#characterClass");
const characterLevel = document.querySelector("#characterLevel");
const characterHealth = document.querySelector("#characterHealth");
const characterImage = document.querySelector("#characterImage");
const statusMessage = document.querySelector("#statusMessage");
const attackBtn = document.querySelector("#attackBtn");
const levelBtn = document.querySelector("#levelBtn");

function renderCharacter() {
	characterName.textContent = character.name;
	characterClass.textContent = character.class;
	characterLevel.textContent = character.level;
	characterHealth.textContent = character.health;
	characterImage.src = character.image;
}

attackBtn.addEventListener("click", () => {
	if (character.health <= 0) {
		return;
	}

	character.attacked();
	renderCharacter();

	if (character.health === 0) {
		statusMessage.textContent = `${character.name} has died.`;
		attackBtn.disabled = true;
		setTimeout(() => {
			alert(`${character.name} has died.`);
		}, 50);
	} else {
		statusMessage.textContent = "";
	}
});

levelBtn.addEventListener("click", () => {
	character.levelUp();
	renderCharacter();
});

renderCharacter();
