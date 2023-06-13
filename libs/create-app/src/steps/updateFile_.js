import path from "node:path";
import { fs } from "@galaxar/sys";
import { unquote, quote, _ } from "@galaxar/utils";

const fileTypeMapper = {
    ".npmrc": "export",
};

function parseExports(content) {
    const lines = content.split("\n");
    return lines.reduce((vars, line) => {
        if (line === "") return vars;

        let [key, value] = line.split("=");
        value = value.trim();

        vars[key.trim()] = unquote(value, true, ['"', "'"]);

        return vars;
    }, {});
}

function formatExports(vars) {
    const lines = [];

    _.each(vars, (v, k) => {
        lines.push(`${k} = ${typeof v === "string" ? quote(v) : v}`);
    });

    return lines.join("\n") + "\n";
}

async function updateFile_(app, targetPath, relativePath, updater) {
    const filePath = path.resolve(targetPath, relativePath);
    const baseName = path.basename(relativePath);

    const fileExists = await fs.exists(filePath);
    const content = fileExists ? await fs.readFile(filePath, "utf8") : "";

    const fileType = fileTypeMapper[baseName];

    let updated;
    let noContent = false;

    switch (fileType) {
        case "export":
            updated = await updater(parseExports(content));
            noContent = _.isEmpty(updated);
            updated = formatExports(updated);
            break;

        case "json":
            updated = await updater(JSON.parse(content));
            noContent = _.isEmpty(updated);
            updated = JSON.stringify(updated);
            break;
    }

    if (!fileExists && noContent) {
        return;
    }

    await fs.writeFile(filePath, updated, "utf8");
    app.log("info", `Updated file ${relativePath}`);
};

export default updateFile_;
