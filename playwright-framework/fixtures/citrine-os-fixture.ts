import { AddLocation } from '../page-object-models/citrine-os/add-location';
import {test as base} from '@playwright/test'
import {HomePage} from '../page-object-models/homePage'
import {Assertion} from '../page-object-models/assertion'
import {Utilities} from '../page-object-models/utilities'


type ApqpFixtures = {
    addLocation:AddLocation
    homePage: HomePage
    assert: Assertion
    utilities:Utilities   
}

export const test = base.extend<ApqpFixtures>({
    homePage: async ({page}, use) => {
        await use(new HomePage(page))
    },
    assert: async ({page}, use) => {
        await use(new Assertion(page))
    },
    addLocation: async ({page}, use) => {
        await use(new  AddLocation(page))
    },
})
