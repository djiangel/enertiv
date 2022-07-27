const { login } = require('./login.js');
const { screen } = require('./constants.js');
require('chromedriver');
const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { By, Key } = webdriver;

async function equipmentPageLoadTest(driver) {
    await login(driver);

    try {
        //ensure that all equipments are loaded
        await scrollToEndOfPage(driver);

        // ensure that equipment is properly loaded and clickable
        let element = await driver.findElement(By.className("MuiGridListTile-root"));
        await element.click();
        let currentUrl = await driver.getCurrentUrl();
        if (currentUrl.includes("tab")) {
            // go back to previous page for next test
            await driver.executeScript("window.history.go(-1)");
            console.log("Equipment page load test: Passed");
            return true;
        } else {
            console.log("Equipment page load test: Failed!\n" + "No equipment to click on.");
            return false;
        }
    } catch (exception) {
        console.log("Equipment page load test: Failed!\n" + exception);
        return false;
    }
}

async function equipmentSearchTest(driver) {
    let searchString = "hi";

    try {
        // getting names of all equipments
        await scrollToEndOfPage(driver);
        let allEquipments = await driver.findElements(By.className("MuiGridListTile-tile"));
        let allTitles = [];
        for (let i = 0; i < allEquipments.length; i++) {
            // getting inner html elements with titles
            let titleHtml = await allEquipments[i].findElements(By.xpath(".//div[@title]"));
            let title = await titleHtml[0].getAttribute("innerHTML");
            allTitles.push(title);
        }

        await driver.findElement(By.xpath("//input[@placeholder='Search']")).sendKeys(searchString);
        await scrollToEndOfPage(driver);
    
        // getting names of all searched equipments
        let searchedEquipments = await driver.findElements(By.className("MuiGridListTile-tile"));
        let searchedTitles = [];
        for (let i = 0; i < searchedEquipments.length; i++) {
            // getting inner html elements with titles
            let titleHtml = await searchedEquipments[i].findElements(By.xpath(".//div[@title]"));
            let title = await titleHtml[0].getAttribute("innerHTML");
            searchedTitles.push(title);
            if (!(title.includes(searchString))) {
                console.log("Equipment search test: Failed!\n" + title + " does not contain searched keyword.");
                return false;
            }
        }

        // filtering all titles by search string and comparing with search results
        let filteredTitles = allTitles.filter(title => title.includes(searchString));
        if (filteredTitles.every(element => { return searchedTitles.includes(element)})) {
            console.log("Equipment search test: Passed");
            return true;
        } else {
            console.log("Equipment search test: Failed!\nNot all equipments with searched keyword are displayed.");
            return false;
        }
    } catch (exception) {
        console.log("Equipment search test: Failed!\n" + exception);
        return false;
    }
}

// scroll to end of page while taking care of lazy loading
async function scrollToEndOfPage(driver) {
    let lastHeight = await driver.executeScript("return document.body.scrollHeight");

    while (true) {
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        await driver.sleep(2000);
        newHeight = await driver.executeScript("return document.body.scrollHeight");
        if (newHeight == lastHeight) {
            break;
        }
        lastHeight = newHeight;
    }
}

async function equipmentPageTest() {
    let driver = await new webdriver.Builder()
    .forBrowser("chrome")
    .build();

    let tests = [
        await equipmentPageLoadTest(driver),
        await equipmentSearchTest(driver)
    ];
    let totalTests = tests.length;
    let testsPassed = tests.filter(test => test).length;

    console.log("Equipment page tests: " + testsPassed + "/" +  totalTests + " passed.");

    driver.quit();

    return { totalTests, testsPassed };
}

module.exports = { equipmentPageTest };