const getLocale = require("os-locale").sync;

const chalk = require("chalk");

const fs = require("fs");
const path = require("path");

const replaceWithArray = require("string-replace-with-array");

class ti18n {
    constructor(opts = {}) {
        this.language = opts.language ? opts.language : process.env.LOCALE ? process.env.LOCALE : getLocale();
        this.bareLanguage = this.language.split("_")[0];

        this.fallbackLang = opts.fallbackLang ? opts.fallbackLang : "en";

        if (fs.existsSync(path.resolve(`./locales/${this.language}.json`))) {
            this.locale = require(`./locales/${this.language}.json`);
        } else if (fs.existsSync(path.resolve(`./locales/${this.bareLanguage}.json`))) {
            this.locale = require(`./locales/${this.bareLanguage}.json`);
        } else {
            this.locale = require(`./locales/${this.fallbackLang}.json`);
        }
    }

    get(key, replacements) {
        const locale = this.locale[key];
        return replaceWithArray(locale, replacements, "%");
    }

    log(key, replacements) {
        process.stdout.write(this.get(key, replacements) + "\n");
    }

    success(key, replacements) {
        process.stdout.write(chalk.green(this.get(key, replacements) + "\n"));
    }

    prepare(key, replacements) {
        process.stdout.write(chalk.yellow(this.get(key, replacements) + "\n"));
    }

    info(key, replacements) {
        process.stdout.write(chalk.blue(this.get(key, replacements) + "\n"));
    }

    error(key, replacements) {
        process.stderr.write(chalk.red(this.get(key, replacements) + "\n"));
    }
}

module.exports = ti18n;