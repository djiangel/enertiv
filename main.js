const { loginPageTest } = require('./loginPageTest.js');
const { equipmentPageTest } = require('./equipmentPageTest.js')

async function main() {
    let loginTests = loginPageTest();
    let equipmentTests = equipmentPageTest();

    let totalTests = (await loginTests).totalTests + 
        (await equipmentTests).totalTests;
    let testsPassed = (await loginTests).testsPassed + 
        (await equipmentTests).testsPassed;
    
    console.log("Total tests: " + testsPassed + "/" + totalTests + " passed.")
}

main();