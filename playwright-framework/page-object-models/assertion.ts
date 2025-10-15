import {expect, Page} from '@playwright/test'
import {BasePage} from './basePage'

/**
 * Library of assertions to be called in page-object-models and specs.
 *
 * Functions implemented in this class must be generic and not specific to
 * app functionality.
 */

export class Assertion extends BasePage {

    constructor(page: Page) {
        super(page)
    }

    async shouldContainPageTitle(pageTitle: string): Promise<void> {
        expect.soft(await this._page.title(), 'The page title does not match').toContain(pageTitle)
    }

    async shouldContainUrl(url: string): Promise<void> {
        expect.soft(this._page.url(), 'The url does not match').toContain(url)
    }

    async shouldNotContainUrl(url: string): Promise<void> {
        expect.soft(this._page.url(), 'The url does not match').not.toContain(url)
    }

    async shouldBeVisible(locator: string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator is not visible when it should be').toBeVisible()
    }

    async shouldNotBeVisible(locator: string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator is visible when it should not be').not.toBeVisible()
    }

    async shouldBeDisabled(locator: string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator is not disabled when it should be').toBeDisabled()
    }

    async shouldBeEnabled(locator: string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator is not enabled when it should be').toBeEnabled()
    }

    async shouldHaveCssOld(locator: string, font: string, color: string): Promise<void> {
        await Promise.all([
            expect.soft(this._page.getAttribute(locator, 'font-size')).toBe(font),
            expect.soft(this._page.$eval(locator, e => getComputedStyle(e).backgroundColor)).toBe(color)
        ])
    }

    async shouldHaveCss(locator: string, cssProperty: string, expectedValue: string): Promise<void> {
        switch(cssProperty) {
            case 'background-color': {
                const webElementBGColor = this._page.locator(locator)
                const bgColor = await webElementBGColor.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('background-color')
                })
                expect.soft(bgColor).toBe(expectedValue)
                break
            }
            case 'font-size': {
                const webElementFontSize = this._page.locator(locator)
                const fontsize = await webElementFontSize.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('font-size')
                })
                expect.soft(fontsize).toBe(expectedValue)
                break
            }
            case 'color': {
                const webElementColor = this._page.locator(locator)
                const color = await webElementColor.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('color')
                })
                expect.soft(color).toBe(expectedValue)
                break
            }
            case 'width': {
                const webElementWidth = this._page.locator(locator)
                const Width = await webElementWidth.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('width')
                })
                expect.soft(Width).toBe(expectedValue)
                break
            }
            case 'min-width': {
                const webElementWidth = this._page.locator(locator)
                const Width = await webElementWidth.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('min-width')
                })
                expect.soft(Width).toBe(expectedValue)
                break
            }
            case 'height': {
                const webElementHeight = this._page.locator(locator)
                const height = await webElementHeight.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('height')
                })
                expect.soft(height).toBe(expectedValue)
                break
            }
            case 'border-radius': {
                const webElementBorderRadius = this._page.locator(locator)
                const borderRadius = await webElementBorderRadius.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('border-radius')
                })
                expect.soft(borderRadius).toBe(expectedValue)
                break
            }
            case 'font-weight': {
                const webElementFontWeight = this._page.locator(locator)
                const fontWeight = await webElementFontWeight.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('font-weight')
                })
                expect.soft(fontWeight).toBe(expectedValue)
                break
            }
            case 'border-color': {
                const webElementBorderColor = this._page.locator(locator)
                const borderColor = await webElementBorderColor.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('border-color')
                })
                expect.soft(borderColor).toBe(expectedValue)
                break
            }
            case 'padding': {
                const webElementPadding = this._page.locator(locator)
                const borderColor = await webElementPadding.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('padding')
                })
                expect.soft(borderColor).toBe(expectedValue)
                break
            }
            case 'min-height': {
                const webElementMinWidth = this._page.locator(locator)
                const minHeight = await webElementMinWidth.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('min-height')
                })
                expect.soft(minHeight).toBe(expectedValue)
                break
            }
            case 'border': {
                const webElementBorder = this._page.locator(locator)
                const border = await webElementBorder.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('border')
                })
                expect.soft(border).toBe(expectedValue)
                break
            }
            case 'border-width': {
                const webElementBorderWidth = this._page.locator(locator)
                const borderWidth = await webElementBorderWidth.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('border-width')
                })
                expect.soft(borderWidth).toBe(expectedValue)
                break
            }
            case '-webkit-line-clamp': {
                const webElementwebkitLineClamp = this._page.locator(locator)
                const webkitLineClamp = await webElementwebkitLineClamp.evaluate((e) => {
                    return window.getComputedStyle(e).getPropertyValue('-webkit-line-clamp')
                })
                expect.soft(webkitLineClamp).toBe(expectedValue)
                break
            }
            default: { 
                throw new Error('ERROR: cssPropertys does not exist')
            }
        }
    }

    async shouldHaveAttribute(locator: string, attributeName: string, value: string | RegExp): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator\'s attribute does not match').toHaveAttribute(attributeName, value)
    }

    async shouldContainText(locator: string, expected: RegExp | string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator does not have this text').toContainText(expected, {ignoreCase: true})
    }

    async shouldNotContainText(locator: string, expected: RegExp | string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator has text it should not').not.toContainText(expected)
    }

    async shouldHaveSnapshot(screenshot: string): Promise<void> {
        expect.soft(await this._page.screenshot()).toMatchSnapshot(screenshot)
    }

    async shouldHaveElementCount(locator: string, count: number): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator count does not match').toHaveCount(count)
    }

    async shouldHaveToolTip(ariaLabel: string, toolTip: string): Promise<void> {
        await this._page.locator(`span[aria-label="${ariaLabel}"]`).hover()
        // await this.elementIsVisible(`div[role="tooltip"]:has-text("${toolTip}")`)
    }

    async shouldBeChecked(locator: string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator is not checked when it should be').toBeChecked()
    }

    async shouldNotBeChecked(locator: string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator is checked when it should not be').not.toBeChecked()
    }

    async shouldBeHidden(locator: string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator is not hidden when it should be').toBeHidden()
    }

    async shouldNotBeHidden(locator: string): Promise<void> {
        await expect.soft(this._page.locator(locator), 'The locator is hidden when it should not be').not.toBeHidden()
    }
}
