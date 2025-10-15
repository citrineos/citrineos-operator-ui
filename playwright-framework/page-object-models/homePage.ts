import {Assertion} from './assertion'
import {BasePage} from './basePage'
import {Page,Locator,expect} from '@playwright/test'






/**
 * Library of functions .
 *
 */

export class HomePage extends BasePage {

    email: Locator;
    password: Locator;
    signInBtn: Locator;
    heading: Locator;
    assert: Assertion;

    constructor(page: Page) {
        super(page)
        this.assert = new Assertion(this._page)
        this.email = page.getByPlaceholder('Email');
        this.password = page.getByRole('textbox', { name: 'Password' })
        this.signInBtn = page.getByRole('button', { name: 'Sign In' })
        this.heading = page.getByRole('heading', { name: 'Charger Activity' })
    }

   

    async LoginAndNavigateToDashboard(): Promise<void> {
        await this.email.fill(process.env.VITE_ADMIN_EMAIL!);
        await this.password.fill(process.env.VITE_ADMIN_PASSWORD!);
        await this.signInBtn.click();
        await expect(this.heading).toBeVisible();
    }

}
