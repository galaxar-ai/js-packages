const path = require("path");
const { fs } = require("@genx/sys");
const localConfig = require("./config");
const { steps, packageConfig } = require("../..");
const getTemplatePath = require("../../utils/getTemplatePath");
const copyFileFromTemplate_ = require("../../utils/createFileFromTemplate_");
const deleteLines_ = require("../../utils/deleteLines_");

module.exports = async (app, options) => {
    const appNameLowerCase = options.appName.toLowerCase();
    options = {
        ...localConfig,
        ...options,
        appNameLowerCase,
    };

    const targetPath = path.join(options.workingPath, options.appDir);
    let cmd = `npx react-native init ${options.appName} --npm`;
    let cwd;

    if (!fs.existsSync(targetPath)) {
        cwd = options.workingPath;
        cmd += ` --directory ${options.appDir}`;
    } else {
        cwd = targetPath;
        cmd += ` --directory .`;
    }

    await steps.runCommand_(app, cwd, cmd, true);

    if (options.disablePackageLock) {
        await fs.unlink(path.join(targetPath, "package-lock.json"));
    }

    const templatePath = getTemplatePath(options.appMode);

    await steps.removeFiles_(app, targetPath, ["app.json", ".prettierrc.js", "App.js", "index.js"]);

    await steps.copyFilesFromTemplate_(app, templatePath, targetPath, options);

    const fileMainActivity = `android/app/src/main/java/com/${appNameLowerCase}/MainActivity.java`;
    await copyFileFromTemplate_(
        path.join(__dirname, "changes/MainActivity.java.tpl"),
        path.join(targetPath, fileMainActivity),
        options
    );
    app.log("info", `Updated ${fileMainActivity}`);

    await steps.updatePackageJson_(app, targetPath, (config) => {
        packageConfig.addPackages(config, options);
        packageConfig.addConfig(config, options);
        packageConfig.addNpmScripts(config, options);
    });

    await steps.npmInstall_(app, targetPath, options);

    await steps.runCommand_(app, targetPath, "npm run pod");
    await steps.runCommand_(app, targetPath, "npm run link");

    const iosProject = `ios/${options.appName}.xcodeproj/project.pbxproj`;
    await deleteLines_(path.join(targetPath, iosProject), [
        "/* AntDesign.ttf in Resources */",
        "/* Entypo.ttf in Resources */",
        "/* EvilIcons.ttf in Resources */",
        "/* Feather.ttf in Resources */",
        "/* FontAwesome.ttf in Resources */",
        "/* FontAwesome5_Brands.ttf in Resources */",
        "/* FontAwesome5_Regular.ttf in Resources */",
        "/* FontAwesome5_Solid.ttf in Resources */",
        "/* Fontisto.ttf in Resources */",
        "/* Foundation.ttf in Resources */",
        "/* Ionicons.ttf in Resources */",
        "/* MaterialCommunityIcons.ttf in Resources */",
        "/* MaterialIcons.ttf in Resources */",
        "/* Octicons.ttf in Resources */",
        "/* SimpleLineIcons.ttf in Resources */",
        "/* Zocial.ttf in Resources */",
    ]);
    app.log("info", `Patched ${iosProject} for work around "react-native-vector-icons" duplicate resources issue.`);
};
