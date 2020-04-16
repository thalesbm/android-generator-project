'use strict';

var Generator = require('yeoman-generator')
var chalk = require('chalk')
var yosay = require('yosay')
var path = require('path')

module.exports = class extends Generator {

	initializing() {
		this.pkg = require('../package.json')
		this.responses = {}
	}

	prompting() {
		this.log('Welcome to Android Project Generator')

		var prompts = [{
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
		// {
		// 	name: 'architeture',
		// 	message: '? architeture:',
		// 	store: true,
		// 	default: 1
		// },
		{
			name: 'targetSDK',
			message: 'Target SDK:',
			store: true,
			default: 28 // Android 9.0 (Pie)
		},
		{
			name: 'minSDK',
			message: 'Min SDK:',
			store: true,
			default: 19 // Android 4.4 (KitKat)
		},
		{
			name: 'gradleVersion',
			message: 'Gradle version:',
			store: true,
			default: 3.6 // 3.6.2
		},
		{
			name: 'kotlinVersion',
			message: 'Kotlin version:',
			store: true,
			default: 1.3 // 1.3.61
		}]

		return this.prompt(prompts).then((responses) => {
			this.responses = responses
		})
	}

	configuring() {
		this.log("STEP [1 / 3]")
		this.destinationRoot("android-" + this.responses.name)
		this.config.set('appPackage', this.responses.name)
	}

	writing() {
		this.log("STEP [2 / 3]")

		// copy infos
		this.fs.copyTpl(this.templatePath('_versions.gradle.ejs'),
            this.destinationPath('versions.gradle'), {
				gradleVersion: this.responses.gradleVersion + ".2",
				kotlinVersion: this.responses.kotlinVersion + ".61",
				targetSDK: this.responses.targetSDK,
				minSDK: this.responses.minSDK
            }
		)

		this.fs.copyTpl(this.templatePath('_build.gradle.ejs'),
			this.destinationPath('build.gradle'), {
				appName: this.responses.name
			}
		)

		this.fs.copyTpl(this.templatePath('_settings.gradle.ejs'),
            this.destinationPath('settings.gradle'), {
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
				package: this.responses.applicationId
            }
		)

		this.fs.copyTpl(this.templatePath('app/src/main/res/values/_strings.xml.ejs'),
            this.destinationPath('app/src/main/res/values/strings.xml'), {
				name: this.responses.name
            }
		)

		this.log("STEP [3 / 3]")
		
		// copy files
		this.fs.copy(this.templatePath('gradle.properties'), this.destinationPath('gradle.properties'))
		this.fs.copy(this.templatePath('gradlew'), this.destinationPath('gradlew'))
		this.fs.copy(this.templatePath('gradlew.bat'), this.destinationPath('gradlew.bat'))
		this.fs.copy(this.templatePath('.gitignore'), this.destinationPath('.gitignore'))
		this.fs.copy(this.templatePath('gradle'), this.destinationPath('gradle'))
		this.fs.copy(this.templatePath('local.properties'), this.destinationPath('local.properties'))
		this.fs.copy(this.templatePath('app/proguard-rules.pro'), this.destinationPath('app/proguard-rules.pro'))
		this.fs.copy(this.templatePath('app/src/main'), this.destinationPath('app/src/main'))
	}

	end() {
		this.log("FINISHED")
	}
}