const moment = require("moment");
const fs = require("fs");

const start = moment.unix(1659931200);
const end = moment.unix(1660401000);

const run = async () => {
	const groups = {};

	let t = moment.unix(start.unix());
	while (t.isBefore(end)) {
		groups[t.unix()] = [];

		t = t.add("1", "days");
	}

	const files = await fs.readdirSync("top30");

	for (var file of files) {
		for (var key of Object.keys(groups)) {
			const fileTime = file.replace(".json", "");

			if (
				moment
					.unix(fileTime)
					.isBetween(
						moment.unix(key),
						moment.unix(key).add(1, "days"),
						undefined,
						"[)"
					)
			) {
				console.log(`${file} => ${key}.json`);
				const fileContent = await fs.readFileSync(`top30/${file}`);
				const data = JSON.parse(fileContent);
				groups[key].push(data);
			}
		}
	}

	for (var key of Object.keys(groups)) {
		console.log(`output ${key}.json`);
		await fs.writeFileSync(
			`top30-grouped/${key}.json`,
			JSON.stringify(groups[key])
		);
	}

	process.exit(0);
};

run();
