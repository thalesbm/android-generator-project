'use strict';
var Generator = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var path = require('path');


module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.pkg = require('../package.json');

    this.destinationRoot("App");
    this.responses = {}
  };

  prompting() {
    this.log(yosay(
      'Welcome to Lib Generator!'
    ));

    var prompts = [{
      name: 'name',
      message: 'What is the project name?',
      store: true,
      default: "ProjectName"
    },{
      name: 'description',
      message: 'Tell me about your project',
      store: true,
      default: "ProjectDescription"
    },{
      name: 'targetSdk',
      message: 'Target SDK?',
      store: true,
      default: 28 // Android 9.0 (Pie)
    },{
      name: 'minSdk',
      message: 'minSdk?',
      store: true,
      default: 19 // Android 4.4 (KitKat)
    },{
      name: 'versionGradle',
      message: 'gradleVersion?',
      store: true,
      default: 2.2 //2.2.3
    },
    {
      name: 'versionKotlin',
      message: 'kotlinVersion?',
      store: true,
      default: 1.1 // 1.1.61
    }];

    return this.prompt(prompts).then((responses) => {
      this.responses = responses
    })
  }

  configuring() {
    this.log("Config Start..")
    this.config.set('appPackage', this.responses.name);
    this.log("Config End..")
  }

  writing() {
    var appName = this.responses.name
    var artifactId = appName + 'Lib'

    this.fs.copyTpl(
      this.templatePath('_versions.gradle.ejs'),
      this.destinationPath('versions.gradle'), {
        //versionGradle: this.responses.versionGradle,
        //versionKotlin: this.responses.versionKotlin,
        //targetSdk: this.responses.targetSdk,
        minSdk: this.responses.minSdk
        //appName: appName,
        //artifactId: artifactId,
        //descriptionApp: this.responses.description
      }
    )

    // this.fs.copyTpl(
    //   this.templatePath('_build.gradle.ejs'),
    //   this.destinationPath('build.gradle'), {
    //     appName: appName
    //   }
    // )
  }
}