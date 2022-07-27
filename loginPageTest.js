require('chromedriver');
const { username, password, screen } = require('./constants.js');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { By, Key } = webdriver;

async function loginPageLoadTest(driver) {
    // checks if username input is loaded
    try {
        await driver.get("https://dev.enertiv.com/app/login");
        // implicit wait for page to load
        await driver.manage().setTimeouts( { implicit: 5000 } );
        await driver.findElement(By.xpath("//input[@placeholder='Username']"));
        console.log("Login page load test: Passed");
        return true;
    } catch (exception) {
        console.log("Login page load test: Failed!\n" + exception);
        return false;
    }
}

async function loginTest(driver) {

    // login and check if account username is present
    try {
        // login
        await driver.findElement(By.xpath("//input[@placeholder='Username']")).sendKeys(username);
        await driver.findElement(By.xpath("//input[@placeholder='Password']")).sendKeys(password, Key.RETURN);
        // checking if account username is present
        let usernameElement = "//*[text()='" + username + "']";
        await driver.manage().setTimeouts( { implicit: 5000 } );
        await driver.findElement(By.xpath(usernameElement));
        console.log("Login test: Passed");
        return true;
    } catch (exception) {
        console.log("Login test: Failed!\n" + exception);
        return false;
    }
}

async function loginPageTest() {
    let driver = await new webdriver.Builder()
    .forBrowser("chrome")
    .build();

    let tests = [
        await loginPageLoadTest(driver),
        await loginTest(driver)
    ];
    let totalTests = tests.length;
    let testsPassed = tests.filter(test => test).length;

    console.log("Login page tests: " + testsPassed + "/" +  totalTests + " passed.");

    driver.quit();

    return { totalTests, testsPassed };
}

module.exports = { loginPageTest };