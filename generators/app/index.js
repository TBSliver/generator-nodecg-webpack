const Generator = require('yeoman-generator');

module.exports = class extends Generator {
    // noinspection JSUnusedGlobalSymbols
    async prompting() {
        this.answers = await this.prompt([
            {
                type: "input",
                name: "name",
                message: "New bundle name",
                default: this.appname
            },
            {
                type: "confirm",
                name: "hasDashboard",
                message: "Add example extension?"
            },
            {
                type: "confirm",
                name: "hasExtension",
                message: "Add example dashboard?"
            },
            {
                type: "confirm",
                name: "hasGraphic",
                message: "Add example graphic?"
            }
        ]);
    }

    // noinspection JSUnusedGlobalSymbols
    setupExtension() {
        if (!this.answers.hasExtension) return;
        this._copyFiles('src/extension/index.js');
    }

    // noinspection JSUnusedGlobalSymbols
    setupDashboard() {
        if (!this.answers.hasDashboard) return;
        this._copyFiles([
            'src/dashboard/panel.css',
            'src/dashboard/panel.html',
            'src/dashboard/panel.js'
        ]);
    }

    // noinspection JSUnusedGlobalSymbols
    setupGraphic() {
        if (!this.answers.hasGraphic) return;
        this._copyFiles([
            'src/graphics/index.css',
            'src/graphics/index.html',
            'src/graphics/index.js'
        ]);
    }

    // noinspection JSUnusedGlobalSymbols
    setupWebpackConfig() {
        this.fs.copyTpl(
            this.templatePath('webpack.config.js'),
            this.destinationPath('webpack.config.js'),
            this.answers);
    }

    // noinspection JSUnusedGlobalSymbols
    setupPackageJson() {
        const pkgJson = {
            "name": this.answers.name.replace(/\s+/g, '-'),
            "version": "1.0.0",
            "description": "",
            "homepage": "",
            "scripts": {
                "start": "webpack --watch",
                "build": "webpack"
            },
            "files": [
                "dashboard",
                "graphics",
                "extension"
            ],
            "keywords": [
                "nodecg-bundle"
            ],
            "nodecg": {
                "compatibleRange": "^1.1.1",
            },
            "devDependencies": {
                "@babel/preset-env": "^7.12.1",
                "@babel/core": "^7.13.8",
                "babel-loader": "^8.1.0",
                "babel-plugin-add-module-exports": "^1.0.4",
                "webpack-node-externals": "^2.5.2",
                "css-loader": "^4.3.0",
                "html-webpack-plugin": "^4.4.1",
                "style-loader": "^1.2.1",
                "webpack": "^4.44.1",
                "webpack-cli": "^3.3.12"
            }
        };
        if (this.answers.hasDashboard) {
            pkgJson.nodecg.dashboardPanels = [
                {
                    "name": "panel",
                    "title": "Panel",
                    "width": 2,
                    "file": "panel.html",
                    "headerColor": "#525F78"
                }
            ];
        }
        if (this.answers.hasGraphic) {
            pkgJson.nodecg.graphics = [
                {
                    "file": "index.html",
                    "width": 1280,
                    "height": 720
                }
            ]
        }

        this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
        this.npmInstall();
    }

    // noinspection JSUnusedGlobalSymbols
    end() {
        this.log("All done! Start up webpack for development" +
            " with npm run start, or Build your new bundle by running npm run build")
    }

    _copyFiles(srcFiles) {
        if (Array.isArray(srcFiles)) {
            srcFiles.forEach(file => {
                this.fs.copy(this.templatePath(file), this.destinationPath(file))
            });
        } else {
            this.fs.copy(this.templatePath(srcFiles), this.destinationPath(srcFiles))
        }
    }
};