require('chromedriver');
const { username, password } = require('./constants.js');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { By, Key } = webdriver;

async function login(driver) {

    try {
        await driver.get("https://dev.enertiv.com/app/login");
        await driver.manage().setTimeouts( { implicit: 5000 } );

        await driver.findElement(By.xpath("//input[@placeholder='Username']")).sendKeys(username);
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(password, Key.RETURN);
    } catch (exception) {
        console.log("Login failed!\n" + exception);
    }
}

module.exports = { login };