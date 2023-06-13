import path from "node:path";
import { replaceAll } from "@galaxar/utils";

const appNameToFileName = (appName) => replaceAll(replaceAll(appName, "@", ""), path.sep, "-");

export default appNameToFileName;
