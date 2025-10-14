import {Page} from '@playwright/test'


/**
 * Library of functions that perform actions on common components.
 *
 * This class should be inherited by all page-object-models.
 *
 * Only functions dealing with common components should be placed here.
 */

export class BasePage {
    protected _page: Page
    constructor(page: Page) {
        this._page = page
    }
}

export interface StoredData {
    number: string
}
