import { Utilities } from './../page-object-models/utilities';
import { test } from '../fixtures/citrine-os-fixture'

test.describe('@e2e1', () => {
    
    test.beforeEach(async ({page}) => {
        await page.goto('/')
    })

    test.afterEach(async ({page}) => {
        await page.close()
    })

    test('TC01- Scenario A - Login and navigate to dashboard', async ({homePage,addLocation}) => {
        const utilities = new Utilities();
        await homePage.LoginAndNavigateToDashboard();
        await addLocation.addNewLocation(utilities.generateAddLocationData());
    })
})