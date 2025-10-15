import { AddLocationDataType } from '../../data/citrinee.data';
import { Assertion } from '../assertion';
import { BasePage } from '../basePage';
import { Page, Locator, expect } from '@playwright/test';

export class AddLocation extends BasePage{
    locationBtn:Locator;
    addLocationBtn: Locator;
    
    nameTxt:Locator;
    addressTxt:Locator;
    cityTxt:Locator;
    postalCodeTxt:Locator;
    coordinatesLatitudeTxt:Locator
    coordinatesLongitudeTxt: Locator
    stateBtn:Locator
    stateDdl: Locator
    
    submitLocationBtn: Locator
    
    successToast: Locator;
    
    assert: Assertion;

    constructor(page: Page) {
        super(page)
        this.assert = new Assertion(this._page)
        this.locationBtn = page.getByRole('menuitem').filter({ hasText: 'Locations' }).first()
        this.addLocationBtn = page.getByRole('button', { name: 'Add New Location' })
        
        this.nameTxt = page.locator('#name')
        this.addressTxt = page.locator('#address')
        this.cityTxt = page.locator('#city')
        this.postalCodeTxt = page.locator('#postalCode')
        this.coordinatesLatitudeTxt = page.locator('#coordinates_latitude')
        this.coordinatesLongitudeTxt = page.locator('#coordinates_longitude')
        this.stateBtn = page.locator('#state')
        this.stateDdl = page.locator('.ant-select-item-option');

        this.submitLocationBtn = page.getByRole('button', { name: 'Submit' })
        
        this.successToast = page.getByText(/Location updated/i);
    }
   
    async addNewLocation(addLocationData: AddLocationDataType): Promise<void> {
        await this.locationBtn.click()
        await this.addLocationBtn.click()

        await this.nameTxt.fill(addLocationData.name)
        await this.addressTxt.fill(addLocationData.address)
        await this.cityTxt.fill(addLocationData.city)
        await this.postalCodeTxt.fill(addLocationData.postalCode)
        await this.stateBtn.click()
        await this.stateBtn.waitFor();
        
        const count = await this.stateDdl.count();
        const randomIndex = Math.floor(Math.random() * count);
        await this.stateDdl.nth(randomIndex).scrollIntoViewIfNeeded();
        await this.stateDdl.nth(randomIndex).click();

        await this.coordinatesLatitudeTxt.fill(addLocationData.coordinates_latitude)
        await this.coordinatesLongitudeTxt.fill(addLocationData.coordinates_longitude)
                
        await this.submitLocationBtn.click()

        await expect(this.successToast).toBeVisible();
    }
}