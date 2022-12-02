"use strict";

const request = require("request");
const util = require("util");

// The target
const statusUpdateService = {
	statusUpdates: {},

	sendUpdate: function (status) {
		console.log("Status sent: " + status);
		let id = Math.floor(Math.random() * 1000000);
		this.statusUpdates[id] = status;
		return id;
	},

	destroyUpdate: (id) => {
		console.log("this.statusUpdates!!", statusUpdateService.statusUpdates);
		delete statusUpdateService.statusUpdates[id];
	},
};

// The Command
function createSendStatusCmd(service, status) {
	let postId = null;

	const command = () => {
		postId = service.sendUpdate(status);
	};

	command.undo = () => {
		if (postId) {
			service.destroyUpdate(postId);
			postId = null;
		}
	};

	command.serialize = () => {
		// 타입과 함께 command를 지정
		return { type: "status", action: "post", status: status };
	};

	return command;
}

// The Invoker(호출자): 대싱에서 명령을 실행
class Invoker {
	constructor() {
		this.history = [];
	}

	run(cmd) {
		this.history.push(cmd);
		cmd();
		console.log("Command executed", cmd.serialize());
	}

	delay(cmd, delay) {
		setTimeout(() => {
			this.run(cmd);
		}, delay);
	}

	undo() {
		const cmd = this.history.pop();
		cmd.undo();
		console.log("Command undone", cmd.serialize());
	}

	runRemotely(cmd) {
		request.post(
			"http://localhost:3000/cmd",
			{ json: cmd.serialize() },
			(err) => {
				console.log("Command executed remotely", cmd.serialize());
			}
		);
	}
}

// The Client code
const invoker = new Invoker();
const command = createSendStatusCmd(statusUpdateService, "HI!");
invoker.run(command);
// 1시간 후에 메시지를 보내도록 설정
invoker.delay(command, 1000 * 60 * 60);
invoker.undo();
invoker.runRemotely(command);
