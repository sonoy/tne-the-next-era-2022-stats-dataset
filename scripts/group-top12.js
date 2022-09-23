const moment = require("moment");
const fs = require("fs");

const start = moment.unix(1663473600);
const end = moment.unix(1664118000);
const now = moment();
const last = moment.unix(now.unix() - now.unix() % 14400);

const run = async () => {
	const groups = {};

	let t = moment.unix(start.unix());
	while (t.isBefore(end) && t.isBefore(last)) {
		groups[t.unix()] = [];

		t = t.add("4", "hours");
	}

	const files = await fs.readdirSync("top12");

	for (var file of files) {
		for (var key of Object.keys(groups)) {
			const fileTime = file.replace(".json", "");

			if (
				moment
					.unix(fileTime)
					.isBetween(
						moment.unix(key),
						moment.unix(key).add(4, "hours"),
						undefined,
						"[)"
					)
			) {
				console.log(`${file} => ${key}.json`);
				const fileContent = await fs.readFileSync(`top12/${file}`);
				const data = JSON.parse(fileContent);
				groups[key].push(data);
			}
		}
	}

	for (var key of Object.keys(groups)) {
		console.log(`output ${key}.json`);
		await fs.writeFileSync(
			`top12-grouped/${key}.json`,
			JSON.stringify(groups[key])
		);
	}

	process.exit(0);
};

run();
