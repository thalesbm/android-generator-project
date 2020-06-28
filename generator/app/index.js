'use strict'

var Generator = require('yeoman-generator')

module.exports = class extends Generator {

	initializing() {
		this.pkg = require('../package.json')
		this.responses = {}
	}

	prompting() {
		this.log('Welcome to Android Project Generator')

		var prompts = [
			{
				name: 'name',
				message: 'Project name:',
				store: true,
				default: "project-name"
			},
			{
				name: 'applicationId',
				message: 'Application ID:',
				store: true,
				default: "bm.it.mobile.app"
			},
			{
				name: 'architeture',
				message: 'Architeture:',
				type: 'list',
				choices: ['NONE', 'MVVM', 'MVP Clean'],
				store: true,
				default: 0
			},
			{
				name: 'module',
				message: 'Has module (y/n):',
				store: true,
				default: "n"
			}
		]

		return this.prompt(prompts).then((responses) => {
			this.responses = responses
		})
	}

	configuring() {
		this.log("STEP [1 / 5]")
		this.destinationRoot("android-" + this.responses.name)
		this.config.set('appPackage', this.responses.name)
	}

	writing() {
		this.log("STEP [2 / 5]")

		this.fs.copyTpl(this.templatePath('_settings.gradle.ejs'),
            this.destinationPath('settings.gradle'), {
				module: this.responses.module
			}
		)

		this.fs.copyTpl(this.templatePath('_build.gradle.ejs'),
			this.destinationPath('build.gradle'), {
				appName: this.responses.name
			}
		)

		this.fs.copyTpl(this.templatePath('_README.md.ejs'),
            this.destinationPath('README.md'), {
				name: this.responses.name
            }
		)

		this.fs.copyTpl(this.templatePath('app/_build.gradle.ejs'),
            this.destinationPath('app/build.gradle'), {
				name: this.responses.name,
				package: this.responses.applicationId,
				module: this.responses.module
            }
		)

		this.log("STEP [3 / 5]")

		this.fs.copy(this.templatePath('versions.gradle'), this.destinationPath('versions.gradle'))
		this.fs.copy(this.templatePath('gradle.properties'), this.destinationPath('gradle.properties'))
		this.fs.copy(this.templatePath('gradlew'), this.destinationPath('gradlew'))
		this.fs.copy(this.templatePath('gradlew.bat'), this.destinationPath('gradlew.bat'))
		this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'))
		this.fs.copy(this.templatePath('gradle'), this.destinationPath('gradle'))
		// this.fs.copy(this.templatePath('local.properties'), this.destinationPath('local.properties'))
		this.fs.copy(this.templatePath('app/proguard-rules.pro'), this.destinationPath('app/proguard-rules.pro'))
		this.fs.copy(this.templatePath('app/src/main/res'), this.destinationPath('app/src/main/res'))

		this.log("STEP [4 / 5]")

		if (this.responses.architeture == 'MVVM') {
			this.fs.copy(this.templatePath('app/src/main/java-mvvm'), this.destinationPath('app/src/main/java'))
			this.fs.copy(this.templatePath('app/src/main/AndroidManifest.xml'), this.destinationPath('app/src/main/AndroidManifest.xml'))

		} else if (this.responses.architeture == 'MVP Clean') {
			this.fs.copy(this.templatePath('app/src/main/java-mvp'), this.destinationPath('app/src/main/java'))
			this.fs.copy(this.templatePath('app/src/main/AndroidManifest.xml'), this.destinationPath('app/src/main/AndroidManifest.xml'))

		} else {
			this.fs.copy(this.templatePath('app/src/main/java-none'), this.destinationPath('app/src/main/java'))
			this.fs.copy(this.templatePath('app/src/main/AndroidManifest-none.xml'), this.destinationPath('app/src/main/AndroidManifest.xml'))
		}

		this.log("STEP [5 / 5]")

		if (this.responses.module == 'y') {
			this.fs.copyTpl(this.templatePath('module/_build.gradle.ejs'),
				this.destinationPath('library/build.gradle'), {
					appName: this.responses.name,
					package: this.responses.applicationId
				}
			)

			this.fs.copy(this.templatePath('module/proguard-rules.pro'), this.destinationPath('library/proguard-rules.pro'))
			this.fs.copy(this.templatePath('module/src/main/res'), this.destinationPath('library/src/main/res'))
			this.fs.copy(this.templatePath('module/src/main/java'), this.destinationPath('library/src/main/java'))
			this.fs.copy(this.templatePath('module/src/main/AndroidManifest.xml'), this.destinationPath('library/src/main/AndroidManifest.xml'))
		}
	}

	end() {
		this.log("FINISHED")
	}
}